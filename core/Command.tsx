interface Command {
  execute: (...args: any[]) => unknown
}

export default Command
