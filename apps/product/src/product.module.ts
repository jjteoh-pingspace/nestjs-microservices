import { Module } from '@nestjs/common';

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

@Module({
  imports: [
    // no need ClientsModule, because this is server
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
