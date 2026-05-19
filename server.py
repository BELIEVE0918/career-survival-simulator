from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
import re
import urllib.error
import urllib.request


PORT = int(os.environ.get("PORT", "3000"))
COZE_BASE_URL = os.environ.get("COZE_BASE_URL", "https://api.coze.cn").rstrip("/")


class CareerSimulatorHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".json": "application/json; charset=utf-8",
    }

    def do_POST(self):
        if self.path != "/api/interview":
            self.send_json(404, {"error": "Not found"})
            return

        token = os.environ.get("COZE_API_TOKEN")
        bot_id = os.environ.get("COZE_BOT_ID")
        if not token:
            self.send_json(200, {"fallback": True, "feedback": "", "error": "COZE_API_TOKEN is missing"})
            return
        if not bot_id:
            self.send_json(200, {"fallback": True, "feedback": "", "error": "COZE_BOT_ID is missing"})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
            prompt = build_interview_prompt(payload)
            answer = call_coze(token, bot_id, payload.get("userId") or "career-sim-user", prompt)
            if not answer:
                raise RuntimeError("Coze returned empty answer")
            parsed = parse_json_from_text(answer)
            self.send_json(
                200,
                {
                    "fallback": False,
                    "feedback": merge_feedback(parsed, answer),
                    "suggestion": parsed.get("suggestion") or "",
                },
            )
        except Exception as error:
            self.send_json(200, {"fallback": True, "feedback": "", "error": str(error)})

    def send_json(self, status, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def build_interview_prompt(payload):
    dimensions = json.dumps(payload.get("dimensions") or {}, ensure_ascii=False)
    return f"""
你是《AI面试模拟器》的 AI 面试官，身份是严谨但不冷冰冰的校园招聘面试官。

你的任务不是重新打分，也不是闲聊，而是像真人面试官一样，对候选人的上一轮回答做短评。
你必须结合候选人的原话和目标岗位，指出“哪里像真实面试中的有效表达、哪里会让面试官不放心、下一轮该怎么补”。

目标岗位：{payload.get("jobName", "")}
当前轮次：{payload.get("roundName", "")}
面试官问题：{payload.get("question", "")}
候选人回答：{payload.get("answer", "")}
系统本轮评价等级：{payload.get("scoreLabel", "")}
系统维度评价：{dimensions}

评分维度含义：
- 回答完整：是否正面回答问题，信息是否足够，不只是一句空话。
- 表达结构：是否有清晰顺序，例如背景、行动、结果，或首先、其次、最后。
- 经历证据：是否有项目、实习、社团、数据、结果等真实证据。
- 岗位贴合：是否围绕目标岗位能力展开，而不是泛泛表达。
- 应对心态：面对追问、压力、不确定问题时是否成熟、主动、负责。

回复要求：
1. feedback 要像真人面试官现场点评，120-180 个中文字符。
2. feedback 必须点名候选人回答中的一个具体内容；如果回答明显敷衍或乱码，要直接指出“这不像有效面试回答”。
3. feedback 不要重复“系统本轮评价等级”，也不要输出分数。
4. suggestion 要短，给下一轮一个可执行动作，30-50 个中文字符。
5. 只返回 JSON，不要 Markdown，不要代码块，不要多余解释。

请返回严格 JSON，不要 Markdown，不要代码块：
{{
  "feedback": "像真人面试官一样的具体点评",
  "suggestion": "下一轮最该改的一件事"
}}
""".strip()


def merge_feedback(parsed, raw_answer):
    feedback = parsed.get("feedback") if isinstance(parsed, dict) else ""
    suggestion = parsed.get("suggestion") if isinstance(parsed, dict) else ""
    if feedback and suggestion and suggestion not in feedback:
        return f"{feedback} 下一轮建议：{suggestion}"
    return feedback or raw_answer


def call_coze(token, bot_id, user_id, prompt):
    request_body = json.dumps(
        {
            "bot_id": bot_id,
            "user_id": user_id,
            "stream": True,
            "additional_messages": [
                {
                    "role": "user",
                    "content": prompt,
                    "content_type": "text",
                }
            ],
        },
        ensure_ascii=False,
    ).encode("utf-8")

    request = urllib.request.Request(
        f"{COZE_BASE_URL}/v3/chat",
        data=request_body,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "text/event-stream, application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            content_type = response.headers.get("Content-Type", "")
            if "application/json" in content_type:
                return extract_answer_from_json(json.loads(response.read().decode("utf-8")))
            return extract_answer_from_sse(response)
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"Coze HTTP {error.code}: {detail[:300]}")


def extract_answer_from_sse(response):
    answer_parts = []
    final_answer = ""
    for raw_line in response:
        line = raw_line.decode("utf-8", errors="ignore").strip()
        if not line.startswith("data:"):
            continue
        data_text = line[5:].strip()
        if not data_text or data_text == "[DONE]":
            continue
        try:
            event_data = json.loads(data_text)
        except json.JSONDecodeError:
            continue
        data = event_data.get("data") if isinstance(event_data, dict) and "data" in event_data else event_data
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except json.JSONDecodeError:
                continue
        if not isinstance(data, dict):
            continue
        if data.get("type") == "answer" and data.get("content"):
            content = data["content"]
            if isinstance(content, str) and content.strip().startswith("{"):
                final_answer = content
            else:
                answer_parts.append(content)
    return (final_answer or "".join(answer_parts)).strip()


def extract_answer_from_json(response_json):
    data = response_json.get("data", response_json)
    messages = data.get("messages") if isinstance(data, dict) else None
    if isinstance(messages, list):
        for message in messages:
            if message.get("type") == "answer" and message.get("content"):
                return message["content"]
    return json.dumps(response_json, ensure_ascii=False)


def parse_json_from_text(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}", text or "")
        if not match:
            return {}
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            return {}


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), CareerSimulatorHandler)
    print(f"Career simulator running at http://localhost:{PORT}")
    print("Press Ctrl+C to stop.")
    server.serve_forever()
