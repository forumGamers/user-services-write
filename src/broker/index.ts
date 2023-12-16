import { type Connection,type Channel, connect } from "amqplib";
import AppError from "../base/error";
import type { UserBroker } from "../interfaces/user";
import type { TokenBroker } from "../interfaces/token";
import type { userQueueInput } from "../interfaces/broker";

class RabbitMQProperty {
  protected connection!: Connection;
  protected channel!: Channel;
  protected connectionString =
    (process.env.RABBITMQURL as string) ||
    "amqp://user:password@localhost:5673";
  protected newUserQueue = "New-User-Queue";
  protected updateUserQueue = "Update-User-Queue";
  protected loginUserQueue = "Login-User-Queue";
  protected userChangeProfile = "User-Change-Profile";
  protected userChangeBackground = "User-Change-Background"
  protected userQueues: string[] = [
    this.newUserQueue,
    this.loginUserQueue,
    this.updateUserQueue,
    this.userChangeProfile,
    this.userChangeBackground
  ];

  protected userExchange = "User-Exchanges";
  protected exchanges: string[] = [this.userExchange];

  public async connect() {
    try {
      this.connection = await connect(`${this.connectionString}?heartbeat=10`);

      this.channel = await this.connection.createChannel();
    } catch (err) {
      throw new AppError({ message: err as any, statusCode: 502 });
    }
  }

  public async declareExchangeAndQueue() {
    try {
      for (const exchange of this.exchanges)
        await this.channel.assertExchange(exchange, "direct", {
          durable: true,
          autoDelete: false,
        });

      for (const queue of [...this.userQueues])
        await this.channel.assertQueue(queue, {
          durable: true,
          autoDelete: false,
        });

      for (const exchange of this.exchanges) {
        let queues: string[] = [];
        switch (exchange) {
          case this.userExchange:
            queues = this.userQueues
            break;
          default:
            break;
        }
        for (const queue of queues)
          await this.channel.bindQueue(queue, exchange, `${exchange}.${queue}`);
      }
    } catch (err) {
      throw new AppError({ message: err as any, statusCode: 501 });
    }
  }

  public async sendNewUser(user: UserBroker) {
    return this.channel.sendToQueue(
      this.newUserQueue,
      Buffer.from(JSON.stringify(user))
    );
  }

  public async sendNewToken(token: TokenBroker) {
    return this.channel.sendToQueue(
      this.loginUserQueue,
      Buffer.from(JSON.stringify(token))
    );
  }

  public async sendUpdateUser(user: UserBroker) {
    return this.channel.sendToQueue(
      this.updateUserQueue,
      Buffer.from(JSON.stringify(user))
    );
  }

  public async sendMessageToQueue(queue: userQueueInput, data: object) {
    return this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  }
}

export default new RabbitMQProperty();
