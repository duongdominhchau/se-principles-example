type PromiseResolve = () => void;

class Console {
  private input: string[] = [];
  private output: string[] = [];
  private resolveConsoleReadLine: PromiseResolve | null = null;
  private inputElement: HTMLInputElement;
  private outputElement: HTMLElement;
  private submitButton: HTMLElement;

  constructor(containerForm: HTMLElement) {
    const inputElement = containerForm.querySelector(".input");
    if (!(inputElement instanceof HTMLInputElement)) {
      throw new Error("Unexpected HTML structure. Must have input field");
    }
    this.inputElement = inputElement;
    const outputElement = containerForm.querySelector(".output");
    if (!(outputElement instanceof HTMLElement)) {
      throw new Error("Unexpected HTML structure. Must have an element to display output");
    }
    this.outputElement = outputElement;
    const submitButton = containerForm.querySelector('input[type="submit"]');
    if (!(submitButton instanceof HTMLInputElement) || submitButton.type.toLowerCase() !== "submit") {
      throw new Error("Unexpected HTML structure. Must have a submit button");
    }
    this.submitButton = submitButton;
    this.outputElement.textContent = "";
    containerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.input.push(this.inputElement.value);
      if (this.resolveConsoleReadLine !== null) {
        this.resolveConsoleReadLine();
        this.resolveConsoleReadLine = null;
      }
      this.inputElement.value = "";
    });
  }

  clear(): void {
    this.outputElement.textContent = "";
    this.output = [];
  }

  stopReceivingInput(): void {
    this.inputElement.remove();
    this.submitButton.remove();
  }

  async readLine(): Promise<string> {
    while (true) {
      const line = this.input.shift();
      if (line) {
        return line;
      }
      // Block until there is a new line to read
      await new Promise((resolve: (value: unknown) => void) => {
        this.resolveConsoleReadLine = () => resolve(undefined);
      });
    }
  }

  writeLine(content: string): void {
    this.output.push(content);
    this.renderConsole();
  }

  private renderConsole(): void {
    this.outputElement.textContent = this.output.join("\n");
    this.outputElement.scrollTo({
      top: this.outputElement.scrollHeight,
    });
  }
}

export { Console };
