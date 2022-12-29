import { Console } from "./console";

const form: HTMLElement | null = document.querySelector("#form");
if (form === null) {
  throw new Error("Missing required form element. Terminating...");
}
const appConsole = new Console(form);

class Person {
  constructor(public name: string, public address: string, public phoneNumber: string) {}

  print(): void {
    appConsole.writeLine(`Person[Name=${this.name}, Address=${this.address}, Phone=${this.phoneNumber}]`);
  }

  static async input(): Promise<Person> {
    appConsole.writeLine("Enter name:");
    const name = await appConsole.readLine();
    appConsole.writeLine(name);
    appConsole.writeLine("Enter address:");
    const address = await appConsole.readLine();
    appConsole.writeLine(address);
    appConsole.writeLine("Enter phone number:");
    const phoneNumber = await appConsole.readLine();
    appConsole.writeLine(phoneNumber);
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
  constructor(public name: string, public address: string, public phoneNumber: string) {}

  print(): void {
    appConsole.writeLine(`Organization[Name=${this.name}, Address=${this.address}, Phone=${this.phoneNumber}]`);
  }

  static async input(): Promise<Organization> {
    appConsole.writeLine("Enter name:");
    const name = await appConsole.readLine();
    appConsole.writeLine(name);
    appConsole.writeLine("Enter address:");
    const address = await appConsole.readLine();
    appConsole.writeLine(address);
    appConsole.writeLine("Enter phone number:");
    const phoneNumber = await appConsole.readLine();
    appConsole.writeLine(phoneNumber);
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

async function main(): Promise<void> {
  while (true) {
    appConsole.writeLine("What do you want to do?");
    appConsole.writeLine("1. Add a new contact");
    appConsole.writeLine("2. Lookup contact");
    appConsole.writeLine("3. Exit");
    const choice = await appConsole.readLine();
    switch (choice) {
      case "1":
        appConsole.writeLine("Enter contact type (Person/Organization):");
        const type = await appConsole.readLine();
        if (type === "Person") {
          contacts.push(await Person.input());
        } else if (type == "Organization") {
          contacts.push(await Organization.input());
        } else {
          appConsole.writeLine("ERROR: Unknown contact type");
        }
        break;
      case "2":
        appConsole.writeLine("Enter search term");
        const searchTerm = await appConsole.readLine();
        appConsole.writeLine("Search result:");
        contacts.filter((contact) => contact.name.includes(searchTerm)).forEach((contact) => contact.print());
        break;
      case "3":
        appConsole.writeLine("Bye!");
        document.querySelector(".input")!.remove();
        document.querySelector(".enter")!.remove();
        return;
      case "clear":
        appConsole.clear();
        continue;
    }
    appConsole.writeLine("");
  }
}

main();
