import {
  Discord,
  SimpleCommand,
  SimpleCommandMessage,
  SimpleCommandOption,
} from "discordx";

// import wov from "../wov"; <-- but i don't want to reinitialize the class on each command

@Discord()
class simpleCommandExample {
  @SimpleCommand("stalk")
  hello(
    @SimpleCommandOption("username") name: string,
    command: SimpleCommandMessage
  ) {

    // Wov.findUserByName(name).then(user: IUser => {
    //   wov.getUserById(user.id).then(user => {
    //     command.message.reply(`${user.username} are level ${user.level}`);
    //   });
    // });
    // 

  }

}
