import OpenAI from "openai";
import type { ChatCompletionMessageParam, ChatCompletionMessageToolCall } from "openai/resources";
import { toolsArr } from "../tools";
import agent from "./agent";

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

  // We will start the agent using loop. It will give tools array for read, write and bash actions which we will execute one by one.
  while (true) {
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      messages: messagesArr,
      tools: toolsArr
    });

    if (!response.choices || response.choices.length === 0) {
      return;
    }

    messagesArr.push(response.choices[0].message); //There will be only one choice in our case

    const toolCalls: ChatCompletionMessageToolCall[] = response.choices[0].message.tool_calls ?? [];

    await agent(toolCalls, messagesArr)

    if (response.choices[0].finish_reason === "stop") {
      console.log(response.choices[0].message.content);
      return;
    }
  }

}

main();
