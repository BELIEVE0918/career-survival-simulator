import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 3000);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === "POST" && url.pathname === "/api/interview") {
      return handleInterview(req, res);
    }
    if (req.method !== "GET") {
      return sendJson(res, 405, { error: "Method not allowed" });
    }
    const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const filePath = normalize(join(root, pathname));
    if (!filePath.startsWith(root)) {
      return sendText(res, 403, "Forbidden");
    }
    const content = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mime[extname(filePath)] || "application/octet-stream" });
    res.end(content);
  } catch (error) {
    sendText(res, 404, "Not found");
  }
});

async function handleInterview(req, res) {
  const token = process.env.COZE_API_TOKEN;
  const botId = process.env.COZE_BOT_ID;
  const baseURL = process.env.COZE_BASE_URL || "https://api.coze.cn";
  if (!token || !botId) {
    return sendJson(res, 200, { fallback: true, feedback: "" });
  }

  const body = await readBody(req);
  const payload = JSON.parse(body || "{}");
  const prompt = buildInterviewPrompt(payload);

  try {
    const { CozeAPI, COZE_CN_BASE_URL, ChatStatus, RoleType } = await import("@coze/api");
    const client = new CozeAPI({
      token,
      baseURL: baseURL || COZE_CN_BASE_URL,
    });

    const result = await client.chat.createAndPoll({
      bot_id: botId,
      user_id: payload.userId || "career-sim-user",
      additional_messages: [
        {
          role: RoleType.User,
          content: prompt,
          content_type: "text",
        },
      ],
    });

    if (result.chat?.status !== ChatStatus.COMPLETED) {
      return sendJson(res, 200, { fallback: true, feedback: "" });
    }

    const answer = result.messages?.find((item) => item.type === "answer")?.content || "";
    const parsed = parseJsonFromText(answer);
    sendJson(res, 200, {
      fallback: false,
      feedback: parsed.feedback || answer,
      suggestion: parsed.suggestion || "",
    });
  } catch (error) {
    sendJson(res, 200, {
      fallback: true,
      feedback: "",
      error: error.message,
    });
  }
}

function buildInterviewPrompt(payload) {
  return `
你是《职场生存模拟器》的 AI 面试官。请只围绕大学生求职面试给反馈，不闲聊，不决定录用结果，不改变游戏流程。

目标岗位：${payload.jobName}
当前轮次：${payload.roundName}
面试官问题：${payload.question}
候选人回答：${payload.answer}
系统本轮评价等级：${payload.scoreLabel}
系统维度评价：${JSON.stringify(payload.dimensions || {})}

请返回严格 JSON，不要 Markdown，不要代码块：
{
  "feedback": "80字以内，指出回答优点、不足和改进方向",
  "suggestion": "30字以内，给下一轮准备建议"
}
`;
}

function parseJsonFromText(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return {};
    try {
      return JSON.parse(match[0]);
    } catch {
      return {};
    }
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function sendText(res, status, text) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

server.listen(port, () => {
  console.log(`Career simulator running at http://localhost:${port}`);
});
