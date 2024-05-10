import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { diKeys } from './common/keys';
import { FakeProductRepo } from './fake/fake-product';
import { ProductGRPCGateway } from './gateways/product.grpc.gateway';
import { ProductHttpGateway } from './gateways/product.http.gateway';
import { ProductNATSGateway } from './gateways/product.nats.gateway';
import { ProductTCPGateway } from './gateways/product.tcp.gateway';
import { ProductService } from './product.service';

const productFaker = new FakeProductRepo();
const gateways = [
  ProductTCPGateway,
  ProductNATSGateway,
  ProductHttpGateway,
  ProductGRPCGateway,
];

const protoPath = join(__dirname, `../../../apps/product/product.proto`);

@Module({
  imports: [
    ClientsModule.register([
      {
        name: diKeys.TCP_CLIENT,
        transport: Transport.TCP,
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
  controllers: gateways,
  providers: [
    ProductService,
    {
      provide: diKeys.FAKE_PRODUCT_REPO,
      useValue: productFaker,
    },
  ],
})
export class ProductModule {}
