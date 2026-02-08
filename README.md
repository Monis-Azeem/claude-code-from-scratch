# Claude Code from Scratch

A minimal AI agent built from scratch in TypeScript that can read files, write files, and execute bash commands - just like Claude Code.

Video demo - https://youtu.be/jD42qbgy24Q

## Capabilities

- **Read** — Reads file contents from disk
- **Write** — Writes content to files
- **Bash** — Executes shell commands and captures output

## How It Works

The agent sends your prompt to an LLM (via OpenRouter) along with a `tools` array defining the available capabilities. The model responds with `tool_calls` when it needs to interact with your system. The agent executes each tool call, feeds the result back into the conversation, and loops - until the model returns `finish_reason: "stop"`.

## Usage

```sh
./run.sh -p "create a hello world python file"
```
