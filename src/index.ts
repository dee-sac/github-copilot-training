import { fileURLToPath } from "node:url";

export function createGreeting(): string {
  return "Hello from github-copilot-training with Node + TypeScript";
}

export function main(): void {
  console.log(createGreeting());
}

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main();
}
