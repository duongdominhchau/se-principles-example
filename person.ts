import { app } from "./app";

class Person {
  constructor(public name: string, public address: string, public phoneNumber: string) {}

  print(): void {
    app.console.writeLine(`Person[Name=${this.name}, Address=${this.address}, Phone=${this.phoneNumber}]`);
  }

  static async input(): Promise<Person> {
    app.console.writeLine("Enter name:");
    const name = await app.console.readLine();
    app.console.writeLine(name);
    app.console.writeLine("Enter address:");
    const address = await app.console.readLine();
    app.console.writeLine(address);
    app.console.writeLine("Enter phone number:");
    const phoneNumber = await app.console.readLine();
    app.console.writeLine(phoneNumber);
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

export { Person };
