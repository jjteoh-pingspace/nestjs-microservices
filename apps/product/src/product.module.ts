import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { diKeys } from './common/keys';
import { FakeProductRepo } from './fake/fake-product';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

const productFaker = new FakeProductRepo();

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
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: diKeys.FAKE_PRODUCT_REPO,
      useValue: productFaker,
    },
  ],
})
export class ProductModule {}
