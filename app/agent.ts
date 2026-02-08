import type { ChatCompletionMessageParam, ChatCompletionMessageToolCall } from "openai/resources";
import { toolCallSchema } from "../schemas";
import read from "./read";
import write from "./write";
import bash from "./bash";

export default async function agent(toolCalls: ChatCompletionMessageToolCall[], messagesArr: ChatCompletionMessageParam[]){
    for(const toolCall of toolCalls){
      //@ts-ignore
      const fn = toolCall.function;
      const result = toolCallSchema.safeParse(fn);

      if (result.success) {
        const name = result.data.name;
        
        if (name === "Read") {
          read(result.data.arguments.file_path ?? '', toolCall.id, messagesArr);
        } else if (name === "Write") {
          write(
            result.data.arguments.file_path ?? '',
            toolCall.id,
            result.data.arguments.content ?? "",
            messagesArr,
          );
        } else if (name === "Bash") {
          await bash(result.data.arguments.command ?? "", toolCall.id, messagesArr);
        }
      } else {
        //TODO: here there can be a better implementation of all the errors which failed validation
        return;
      }
    };
}