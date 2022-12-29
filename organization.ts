import { app } from "./app";

class Organization {
  constructor(public name: string, public address: string, public phoneNumber: string) {}

  print(): void {
    app.console.writeLine(`Organization[Name=${this.name}, Address=${this.address}, Phone=${this.phoneNumber}]`);
  }

  static async input(): Promise<Organization> {
    app.console.writeLine("Enter name:");
    const name = await app.console.readLine();
    app.console.writeLine(name);
    app.console.writeLine("Enter address:");
    const address = await app.console.readLine();
    app.console.writeLine(address);
    app.console.writeLine("Enter phone number:");
    const phoneNumber = await app.console.readLine();
    app.console.writeLine(phoneNumber);
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

export { Organization };
