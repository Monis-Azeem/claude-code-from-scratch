import { exec } from "child_process";
import { promisify } from "util";
import type { ChatCompletionMessageParam } from "openai/resources";
import { stderr, stdout } from "process";

const execAsync = promisify(exec);

export default async function bash(
  command: string,
  toolCallId: string,
  messagesArr: ChatCompletionMessageParam[],
) {
  let output;
  let error;
  //     let output;
  try {
    const { stdout, stderr } = await execAsync(command);

    // if(error !== null){
    messagesArr.push({
      role: "tool",
      tool_call_id: toolCallId,
      content: JSON.stringify({
        stdout: stdout,
        stderr: "",
      }),
    });
    // }
    // else{
    //     messagesArr.push({role: 'tool', tool_call_id: toolCallId, content: stdout + error.message})
    //     return stdout
    // }
  } catch (error) {
    if (error instanceof Error){
        messagesArr.push({
        role: "tool",
        tool_call_id: toolCallId,
        content: JSON.stringify({
          stdout: "",
          stderr: error.message,
        }),
      });
    }
    else{
        messagesArr.push({
        role: "tool",
        tool_call_id: toolCallId,
        content: JSON.stringify({
          stdout: "",
          stderr: String(error),
        }),
      });

    }
      

    // console.error('Error from executing command in bash.ts: ', error)
    // return;
  }

  // exec(command, (error, stdout, stderr) => {
  //     if(error === null){
  //         messagesArr.push({role: 'tool', tool_call_id: toolCallId, content: stdout + stderr})
  //     }

  //     messagesArr.push({role: 'tool', tool_call_id: toolCallId, content: "" + error?.message})

  //     // return;
  //     // if(!!stderr){
  //     //     messagesArr.push({role: 'tool', tool_call_id: toolCallId, content: stderr})
  //     //     return stderr;
  //     // }

  //     // messagesArr.push({role: 'tool', tool_call_id: toolCallId, content: stdout})
  //     //     return stdout

  // })
}
