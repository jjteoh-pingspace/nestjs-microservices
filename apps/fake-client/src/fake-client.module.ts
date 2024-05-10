import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { diKeys } from './common/keys';
import { FakeClientController } from './fake-client.controller';
import { FakeClientService } from './fake-client.service';

const protoPath = join(__dirname, `../../../apps/fake-client/product.proto`);
console.log(protoPath);

@Module({
  imports: [
    ClientsModule.register([
      {
        name: diKeys.TCP_CLIENT,
        transport: Transport.TCP,
        options: {
          port: 9898, // for TCP the default port is 3000, have to align among all services
        },
      },
      {
        name: diKeys.NATS_CLIENT,
        transport: Transport.NATS,
        options: {
          inboxPrefix: `nat`, // there is a bug in nestjs/microservices lib, if inboxPrefix is not provided, error will be thrown
        },
      },
      {
        name: diKeys.GRPC_CLIENT,
        transport: Transport.GRPC,
        options: {
          package: `product`,
          protoPath,
          url: `localhost:5001`,
        },
      },
    ]),
  ],
  controllers: [FakeClientController],
  providers: [FakeClientService],
})
export class FakeClientModule {}
