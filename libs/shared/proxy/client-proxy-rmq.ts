import { RabbitMQ } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxyRMQ {
  constructor(private readonly config: ConfigService) {}

  clientProxyRMQ(queue: RabbitMQ): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.config.get('AMQP_URL')],
        queue,
        queueOptions: {
          durable: false,
        },
      },
    } as any);
  }
}
