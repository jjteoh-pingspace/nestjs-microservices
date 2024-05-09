import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductModule } from './product.module';

// hybrid service setup (HTTP + TCP)
async function bootstrap() {
  const app = await NestFactory.create(ProductModule);

  // TCP transport
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { retryAttempts: 5, retryDelay: 3000, port: 9898 },
  });

  // NATS transport
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [`nats://localhost:4222`],
      queue: `products_queue`,
    },
  });

  await app.startAllMicroservices(); // note: if transport TCP is selected, this will consume port 3000
  await app.listen(3001); // this is HTTP

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
