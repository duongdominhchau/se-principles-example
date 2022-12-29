import { Console } from "./console";
import { Organization } from "./organization";
import { Person } from "./person";

class App {
  public console: Console;
  private contacts: (Person | Organization)[] = [];

  constructor() {
    const form: HTMLElement | null = document.querySelector("#form");
    if (form === null) {
      throw new Error("Missing required form element. Terminating...");
    }
    this.console = new Console(form);
  }

  async run(): Promise<void> {
    while (true) {
      this.console.writeLine("What do you want to do?");
      this.console.writeLine("1. Add a new contact");
      this.console.writeLine("2. Lookup contact");
      this.console.writeLine("3. Exit");
      const choice = await this.console.readLine();
      switch (choice) {
        case "1":
          await this.addContact();
          break;
        case "2":
          await this.searchContacts();
          break;
        case "3":
          this.quit();
          return;
        case "clear":
          this.clearScreen();
          continue;
      }
      this.console.writeLine("");
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
    document.querySelector(".input")!.remove();
    document.querySelector(".enter")!.remove();
  }

  private clearScreen(): void {
    this.console.clear();
  }
}

const app = new App();

export { app };
