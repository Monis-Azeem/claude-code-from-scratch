import type { ChatCompletion } from "openai/resources";
import { toolCallSchema } from "../schemas";
import type { ChatCompletionMessageParam } from "openai/resources";

import fs from "fs";

export default function read(
  filePath: string,
  toolCallid: string,
  messagesArr: ChatCompletionMessageParam[],
) {
  const data = fs.readFileSync(filePath).toString().replace(/\n/g, "");

  messagesArr.push({ role: "tool", tool_call_id: toolCallid, content: data });
}
