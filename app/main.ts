import OpenAI from "openai";
import read from "./read";
import write from "./write";
import bash from "./bash";
import type { ChatCompletionMessageParam } from "openai/resources";
import { toolCallSchema } from "../schemas";

async function main() {
  const [, , flag, prompt] = process.argv;
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseURL =
    process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }
  if (flag !== "-p" || !prompt) {
    throw new Error("error: -p flag is required");
  }

  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
  });

  let messagesArr: ChatCompletionMessageParam[] = [
    { role: "user", content: prompt },
  ];

  while (true) {
    const response = await client.chat.completions.create({
      model: "anthropic/claude-haiku-4.5",
      messages: messagesArr,
      tools: [
        {
          type: "function",
          function: {
            name: "Read",
            description: "Read and return the contents of a file",
            parameters: {
              type: "object",
              required: ["file_path"],
              properties: {
                file_path: {
                  type: "string",
                  description: "The path to the file to read",
                },
              },
            },
          },
        },
        {
          type: "function",
          function: {
            name: "Write",
            description: "Write contents to a file",
            parameters: {
              type: "object",
              required: ["file_path", "content"],
              properties: {
                file_path: {
                  type: "string",
                  description: "The path of the file to write to",
                },
                content: {
                  type: "string",
                  description: "The content to write to the file",
                },
              },
            },
          },
        },
        {
          type: "function",
          function: {
            name: "Bash",
            description: "Execute a shell command",
            parameters: {
              type: "object",
              required: ["command"],
              properties: {
                command: {
                  type: "string",
                  description: "The command to execute",
                },
              },
            },
          },
        },
      ],
    });

    if (!response.choices || response.choices.length === 0) {
      return;
    }

    messagesArr.push(response.choices[0].message);

    const toolCalls = response.choices[0].message.tool_calls;

    for(const toolCall of toolCalls ?? []){
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
          // return output;
          // if(output)
          //   return output

          // return;
        }
      } else {
        //TODO: here there can be a better implementation of all the errors which failed validation
        return;
      }
    };

    if (response.choices[0].finish_reason === "stop") {
      console.log(response.choices[0].message.content);
      return;
    }
    // read(response, messagesArr)
  }

  //@ts-ignore
  // console.log(response.choices[0].message.content);
}

main();
