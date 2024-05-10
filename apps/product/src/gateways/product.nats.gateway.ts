import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from '@nestjs/microservices';
import { Product } from '../models/product';
import { ProductService } from '../product.service';

@Controller()
export class ProductNATSGateway {
  constructor(private readonly _productService: ProductService) {}

  // NATS endpoint
  @MessagePattern({ cmd: `get_product_by_id`, transport: `NATS` })
  async getProductById(
    @Payload() id: string,
    @Ctx() context: NatsContext,
  ): Promise<Product> {
    console.log(`(nats)received message: ${id}`);

    const headers = context.getHeaders();
    console.log(`headers`, headers); // in real world app, auth token can be extracted for auth purpose

    return await this._productService.findOneById(id);
  }
}
