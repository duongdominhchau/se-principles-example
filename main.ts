class Person {
  constructor(
    public name: string,
    public address: string,
    public phoneNumber: string
  ) {}

  print(): void {
    ConsoleWriteLine(
      `Person[Name=${this.name}, Address=${this.address}, Phone=${this.phoneNumber}]`
    );
  }

  static async input(): Promise<Person> {
    ConsoleWriteLine("Enter name:");
    const name = await ConsoleReadLine();
    ConsoleWriteLine(name);
    ConsoleWriteLine("Enter address:");
    const address = await ConsoleReadLine();
    ConsoleWriteLine(address);
    ConsoleWriteLine("Enter phone number:");
    const phoneNumber = await ConsoleReadLine();
    ConsoleWriteLine(phoneNumber);
    return new Person(name, address, phoneNumber);
  }

  static newFromJson(json: string): Person | null {
    const { $$_type, name, address, phoneNumber } = JSON.parse(json);
    if ($$_type !== "Person") {
      return null;
    }
    return new Person(name, address, phoneNumber);
  }

  printJson(): string {
    return JSON.stringify({
      $$_type: "Person",
      name: this.name,
      address: this.address,
      phoneNumber: this.phoneNumber,
    });
  }
}

class Organization {
  constructor(
    public name: string,
    public address: string,
    public phoneNumber: string
  ) {}

  print(): void {
    ConsoleWriteLine(
      `Organization[Name=${this.name}, Address=${this.address}, Phone=${this.phoneNumber}]`
    );
  }

  static async input(): Promise<Organization> {
    ConsoleWriteLine("Enter name:");
    const name = await ConsoleReadLine();
    ConsoleWriteLine(name);
    ConsoleWriteLine("Enter address:");
    const address = await ConsoleReadLine();
    ConsoleWriteLine(address);
    ConsoleWriteLine("Enter phone number:");
    const phoneNumber = await ConsoleReadLine();
    ConsoleWriteLine(phoneNumber);
    return new Organization(name, address, phoneNumber);
  }

  static newFromJson(json: string) {
    const { $$_type, name, address, phoneNumber } = JSON.parse(json);
    if ($$_type !== "Organization") {
      return null;
    }
    return new Organization(name, address, phoneNumber);
  }

  printJson() {
    return JSON.stringify({
      $$_type: "Organization",
      name: this.name,
      address: this.address,
      phoneNumber: this.phoneNumber,
    });
  }
}

const contacts: (Person | Organization)[] = [];

async function ConsoleReadLine(): Promise<string> {
  while (true) {
    const line = consoleInput.shift();
    if (line) {
      return line;
    }
    // Block until there is a new line to read
    await new Promise((resolve: (value: unknown) => void) => {
      resolveConsoleReadLine = () => resolve(undefined);
    });
  }
}

async function main(): Promise<void> {
  while (true) {
    ConsoleWriteLine("What do you want to do?");
    ConsoleWriteLine("1. Add a new contact");
    ConsoleWriteLine("2. Lookup contact");
    ConsoleWriteLine("3. Exit");
    const choice = await ConsoleReadLine();
    switch (choice) {
      case "1":
        ConsoleWriteLine("Enter contact type (Person/Organization):");
        const type = await ConsoleReadLine();
        if (type === "Person") {
          contacts.push(await Person.input());
        } else if (type == "Organization") {
          contacts.push(await Organization.input());
        } else {
          ConsoleWriteLine("ERROR: Unknown contact type");
        }
        break;
      case "2":
        ConsoleWriteLine("Enter search term");
        const searchTerm = await ConsoleReadLine();
        ConsoleWriteLine("Search result:");
        contacts
          .filter((contact) => contact.name.includes(searchTerm))
          .forEach((contact) => contact.print());
        break;
      case "3":
        ConsoleWriteLine("Bye!");
        document.querySelector("#input")!.remove();
        document.querySelector("#enter")!.remove();
        return;
      case "clear":
        ConsoleClear();
        continue;
    }
    ConsoleWriteLine("");
  }
}

function ConsoleClear() {
  const output = document.querySelector("#output")!;
  output.textContent = "";
  consoleOutput.length = 0;
}

type PromiseResolve = () => void;
let resolveConsoleReadLine: PromiseResolve | null = null;
const consoleInput: string[] = [];
const consoleOutput: string[] = [];
function renderConsole() {
  const output = document.querySelector("#output")!;
  output.textContent = consoleOutput.join("\n");
  output.scrollTo({
    behavior: "smooth",
    top: output.scrollHeight,
  });
}

function ConsoleWriteLine(content: string) {
  consoleOutput.push(content);
  renderConsole();
}

// Bad code, don't use `!` in production, handle null properly instead
document.querySelector("#form")!.addEventListener("submit", (e) => {
  e.preventDefault();
  const input: HTMLInputElement = document.querySelector("#input")!;
  consoleInput.push(input.value);
  if (resolveConsoleReadLine !== null) {
    resolveConsoleReadLine();
    resolveConsoleReadLine = null;
  }
  input.value = "";
});

main();
