import * as amqp from "amqplib";
import AppError from "../base/error";

abstract class RabbitMQProperty {
  protected connection!: amqp.Connection;
  protected channel!: amqp.Channel;
  protected connectionString =
    (process.env.RABBITMQURL as string) ||
    "amqp://user:password@localhost:5673";
  protected userQueues: string[] = ["New-User-Queue"];

  protected exchanges: string[] = ["User-Exchanges"];
}

class RabbitMQ extends RabbitMQProperty {
  public async connect() {
    try {
      this.connection = await amqp.connect(
        `${this.connectionString}?heartbeat=10`
      );

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
      const queues = [...this.userQueues];
      for (const exchange of this.exchanges) {
        await this.channel.assertExchange(exchange, "direct", {
          durable: true,
          autoDelete: false,
        });
      }

      for (const queue of queues) {
        await this.channel.assertQueue(queue, {
          durable: true,
          autoDelete: false,
        });
      }

      for (const exchange of this.exchanges) {
        for (const queue of queues) {
          await this.channel.bindQueue(queue, exchange, `${exchange}.${queue}`);
        }
      }
    } catch (err) {
      throw new AppError({ message: err as any, statusCode: 501 });
    }
  }
}

export default new RabbitMQ();
