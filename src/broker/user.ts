import RabbitMQProperty from ".";
import { UserBroker } from "../interfaces/user";

class UserPublisher extends RabbitMQProperty {
  constructor() {
    super();
  }

  public async sendNewUser(user: UserBroker) {
    return this.channel.sendToQueue(
      this.newUserQueue,
      Buffer.from(JSON.stringify(user))
    );
  }
}

export default new UserPublisher();
