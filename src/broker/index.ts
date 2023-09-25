import { Connection, Channel, connect } from "amqplib";
import AppError from "../base/error";
import UserBroker from "../interfaces/broker-model";

abstract class RabbitMQProperty {
  protected connection!: Connection;
  protected channel!: Channel;
  protected connectionString =
    (process.env.RABBITMQURL as string) ||
    "amqp://user:password@localhost:5673";
  protected newUserQueue = "New-User-Queue";
  protected userQueues: string[] = [this.newUserQueue];

  protected userExchange = "User-Exchanges";
  protected exchanges: string[] = [this.userExchange];
}

class RabbitMQ extends RabbitMQProperty {
  public async connect() {
    try {
      this.connection = await connect(`${this.connectionString}?heartbeat=10`);

      this.channel = await this.connection.createChannel();
    } catch (err) {
      throw new AppError({ message: err as any, statusCode: 502 });
    }
  }

  constructor() {
    super();
  }

  public async declareExchangeAndQueue() {
    try {
      for (const exchange of this.exchanges) {
        await this.channel.assertExchange(exchange, "direct", {
          durable: true,
          autoDelete: false,
        });
      }

      for (const queue of [...this.userQueues]) {
        await this.channel.assertQueue(queue, {
          durable: true,
          autoDelete: false,
        });
      }

      for (const exchange of this.exchanges) {
        let queues: string[] = [];
        switch (exchange) {
          case this.userExchange:
            queues = [this.newUserQueue];
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
}

export default new RabbitMQ();
