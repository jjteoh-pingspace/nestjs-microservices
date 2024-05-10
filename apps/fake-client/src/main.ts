import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FakeClientModule } from './fake-client.module';

// hybrid service setup (HTTP + TCP)
async function bootstrap() {
  const app = await NestFactory.create(FakeClientModule);

  // TCP transport
  // for using TCP transporter, one app(service) connect will do, the app will consume the port
  // another app try connect will hit "address already in use" error
  // this also mean that if the initial app die, it brings down whole TCP communication

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: {
  //     retryAttempts: 5,
  //     retryDelay: 3000,
  //     host: `localhost`,
  //     port: 9898, // default is 3000
  //   },
  // });

  // NATS transport
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [`nats://localhost:4222`],
      queue: `products_queue`,
    },
  });

  // // gRPC transport
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     package: `product`,
  //     protoPath: join(__dirname, `product.proto`),
  //   },
  // });

  await app.startAllMicroservices();

  await app.listen(3002); // this is for HTTP server

  console.log(`Application is running on: ${await app.getUrl()}`);
}

console.log(`starting fake-client`);
bootstrap();
