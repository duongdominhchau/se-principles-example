import { Console } from "./console";
import { Organization } from "./organization";
import { Person } from "./person";

class App {
  public console: Console;
  private contacts: (Person | Organization)[] = [];
  private stopped = false;

  private static readonly COMMANDS = [
    {
      name: "add",
      description: "Add a new contact",
      action: App.prototype.addContact,
    },
    {
      name: "search",
      description: "Lookup contact",
      action: App.prototype.searchContacts,
    },
    {
      name: "clear",
      description: "Clear screen",
      action: App.prototype.clearScreen,
    },
    {
      name: "quit",
      description: "Quit",
      action: App.prototype.quit,
    },
  ];

  constructor() {
    const form: HTMLElement | null = document.querySelector("#form");
    if (form === null) {
      throw new Error("Missing required form element. Terminating...");
    }
    this.console = new Console(form);
  }

  private async promptForAction(): Promise<string> {
    this.console.writeLine("What do you want to do?");
    App.COMMANDS.forEach((command) => {
      this.console.writeLine(`(${command.name}) ${command.description}`);
    });
    // Immediately await to ensure there is no other text printed
    return await this.console.readLine();
  }

  async run(): Promise<void> {
    while (!this.stopped) {
      this.console.writeLine("");
      const choice = await this.promptForAction();
      const command = App.COMMANDS.find((command) => command.name === choice);
      if (command !== undefined) {
        await command.action.call(this);
      }
    }
  }

  private async addContact(): Promise<void> {
    this.console.writeLine("Enter contact type (Person/Organization):");
    const type = await this.console.readLine();
    if (type === "Person") {
      this.contacts.push(await Person.input());
    } else if (type == "Organization") {
      this.contacts.push(await Organization.input());
    } else {
      this.console.writeLine("ERROR: Unknown contact type");
    }
  }

  private async searchContacts(): Promise<void> {
    this.console.writeLine("Enter search term");
    const searchTerm = await this.console.readLine();
    this.console.writeLine("Search result:");
    this.contacts.filter((contact) => contact.name.includes(searchTerm)).forEach((contact) => contact.print());
  }

  private quit(): void {
    this.console.writeLine("Bye!");
    this.console.stopReceivingInput();
    this.stopped = true;
  }

  private clearScreen(): void {
    this.console.clear();
  }
}

const app = new App();

export { app };
