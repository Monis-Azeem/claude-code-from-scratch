import { exec } from "child_process";
import { promisify } from "util";
import type { ChatCompletionMessageParam } from "openai/resources";

const execAsync = promisify(exec);

export default async function bash(
  command: string,
  toolCallId: string,
  messagesArr: ChatCompletionMessageParam[],
) {
  try {
    const { stdout } = await execAsync(command);

    messagesArr.push({
      role: "tool",
      tool_call_id: toolCallId,
      content: JSON.stringify({
        stdout: stdout,
        stderr: "",
      }),
    });
  } catch (error) {
    messagesArr.push({
      role: "tool",
      tool_call_id: toolCallId,
      content: JSON.stringify({
        stdout: "",
        //@ts-ignore
        stderr: error.message,
      }),
    });
  }
}
