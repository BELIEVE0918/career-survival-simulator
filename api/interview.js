function buildInterviewPrompt(payload) {
  const dimensions = JSON.stringify(payload.dimensions || {});
  return `
你是《职场生存模拟器》的 AI 面试官，身份是严谨但不冷冰冰的校园招聘面试官。

你的任务不是重新打分，也不是闲聊，而是像真人面试官一样，对候选人的上一轮回答做短评。
你必须结合候选人的原话和目标岗位，指出“哪里像真实面试中的有效表达、哪里会让面试官不放心、下一轮该怎么补”。

目标岗位：${payload.jobName || ""}
当前轮次：${payload.roundName || ""}
面试官问题：${payload.question || ""}
候选人回答：${payload.answer || ""}
系统本轮评价等级：${payload.scoreLabel || ""}
系统维度评价：${dimensions}

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
{
  "feedback": "像真人面试官一样的具体点评",
  "suggestion": "下一轮最该改的一件事"
}
`.trim();
}

function parseJsonFromText(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = String(text || "").match(/\{[\s\S]*\}/);
    if (!match) return {};
    try {
      return JSON.parse(match[0]);
    } catch {
      return {};
    }
  }
}

function mergeFeedback(parsed, rawAnswer) {
  const feedback = parsed.feedback || "";
  const suggestion = parsed.suggestion || "";
  if (feedback && suggestion && !feedback.includes(suggestion)) {
    return `${feedback} 下一轮建议：${suggestion}`;
  }
  return feedback || rawAnswer || "";
}

async function readSseAnswer(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let finalAnswer = "";
  const answerParts = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const dataText = trimmed.slice(5).trim();
      if (!dataText || dataText === "[DONE]") continue;

      let eventData;
      try {
        eventData = JSON.parse(dataText);
      } catch {
        continue;
      }

      let data = Object.prototype.hasOwnProperty.call(eventData, "data") ? eventData.data : eventData;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          continue;
        }
      }
      if (!data || typeof data !== "object") continue;
      if (data.type === "answer" && data.content) {
        if (String(data.content).trim().startsWith("{")) finalAnswer = data.content;
        else answerParts.push(data.content);
      }
    }
  }

  return String(finalAnswer || answerParts.join("")).trim();
}

async function callCoze(payload) {
  const token = process.env.COZE_API_TOKEN;
  const botId = process.env.COZE_BOT_ID;
  const baseUrl = (process.env.COZE_BASE_URL || "https://api.coze.cn").replace(/\/$/, "");

  if (!token) throw new Error("COZE_API_TOKEN is missing");
  if (!botId) throw new Error("COZE_BOT_ID is missing");

  const response = await fetch(`${baseUrl}/v3/chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream, application/json",
    },
    body: JSON.stringify({
      bot_id: botId,
      user_id: payload.userId || "career-sim-user",
      stream: true,
      additional_messages: [
        {
          role: "user",
          content: buildInterviewPrompt(payload),
          content_type: "text",
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Coze HTTP ${response.status}: ${detail.slice(0, 300)}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json());
  }
  return readSseAnswer(response);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const answer = await callCoze(req.body || {});
    if (!answer) throw new Error("Coze returned empty answer");
    const parsed = parseJsonFromText(answer);
    return res.status(200).json({
      fallback: false,
      feedback: mergeFeedback(parsed, answer),
      suggestion: parsed.suggestion || "",
    });
  } catch (error) {
    return res.status(200).json({
      fallback: true,
      feedback: "",
      error: error.message || "Coze call failed",
    });
  }
}
