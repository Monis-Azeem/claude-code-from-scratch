import fs from "fs";
import type { ChatCompletionMessageParam } from "openai/resources";

export default function write(
  filePath: string,
  toolCallId: string,
  content: string,
  messagesArr: ChatCompletionMessageParam[],
) {
  fs.writeFileSync(filePath, content);

  messagesArr.push({
    role: "tool",
    tool_call_id: toolCallId,
    content: content,
  });
}
