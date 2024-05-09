import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from '@nestjs/microservices';
import { diKeys } from './common/keys';
import { Product } from './models/product';
import { ProductService } from './product.service';

@Controller({
  path: `/product`,
})
export class ProductController {
  constructor(
    @Inject(diKeys.TCP_CLIENT) private readonly _tcpClient: ClientProxy,
    @Inject(diKeys.NATS_CLIENT) private readonly _natsClient: ClientProxy,
    private readonly _productService: ProductService,
  ) {}

  // #region GET /:id
  // HTTP subscriber
  @Get(`/:id`)
  async index(@Param(`id`) id: string): Promise<Product> {
    return await this._productService.findOneById(id);
  }

  // TCP subscriber
  @MessagePattern({ cmd: `tcp_get_product_by_id` })
  async tcpGetProductByIdResolver(id: string): Promise<Product> {
    console.log(`received message: ${id}`);
    return await this._productService.findOneById(id);
  }

  // NATS subscriber
  @MessagePattern({ cmd: `nats_get_product_by_id` })
  async natsGetProductById(
    @Payload() id: string,
    @Ctx() context: NatsContext,
  ): Promise<Product> {
    console.log(`received message: ${id}`);

    const headers = context.getHeaders();
    console.log(`headers`, headers); // in real world app, auth token can be extracted for auth purpose

    return await this._productService.findOneById(id);
  }
  // #endregion /:id
}
