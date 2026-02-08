import type { ChatCompletion } from "openai/resources";
import { toolCallSchema } from "../schemas";
import type { ChatCompletionMessageParam } from "openai/resources";

import fs from "fs";

export default function read(
  filePath: string,
  toolCallid: string,
  messagesArr: ChatCompletionMessageParam[],
) {
  // if (!response.choices[0].message.tool_calls)
  //   //Choices will be only one in our case
  //   return;
  // // throw new Error("No tool calls detected");

  // const message = response.choices[0].message;
  // const toolCalls = response.choices[0].message.tool_calls;

  // toolCalls.forEach((toolCall) => {
  //@ts-ignore
  // const fn = toolCall.function;
  // const result = toolCallSchema.safeParse(fn);

  // if (result.success) {
  // const name = result.data.name;
  // const file_path = result.data.arguments.file_path;
  const data = fs.readFileSync(filePath).toString().replace(/\n/g, "");

  messagesArr.push({ role: "tool", tool_call_id: toolCallid, content: data });

  // console.log(data.toString().replace(/\n/g, ""));
  // } else {
  //TODO: here there can be a better implementation of all the errors which failed validation
  // return;
  // }
  // });
}
