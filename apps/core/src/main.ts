import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core.module';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { RabbitMQ } from '@app/shared';

async function bootstrap() {
  config();
  const logger = new Logger('bootstrap');
  const app = await NestFactory.createMicroservice(CoreModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URL],
      queue: RabbitMQ.CoreQueue,
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
  logger.verbose(`Microservice Core is listening`);
}
bootstrap();
