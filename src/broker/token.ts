import RabbitMQProperty from ".";
import { TokenBroker } from "../interfaces/token";

class TokenPublisher extends RabbitMQProperty {
  constructor() {
    super();
  }

  public async sendNewToken(token: TokenBroker) {
    return this.channel.sendToQueue(
      this.loginUserQueue,
      Buffer.from(JSON.stringify(token))
    );
  }
}

export default new TokenPublisher();
