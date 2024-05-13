import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  NatsContext,
  Payload,
} from '@nestjs/microservices';
import { Product } from '../models/product';
import { ProductService } from '../product.service';

@Controller()
export class ProductNATSGateway {
  constructor(private readonly _productService: ProductService) {}

  // NATS(request-response) endpoint
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

  // NATS(event based) endpoint
  @EventPattern({ event: `product_created`, transport: `NATS` })
  async handleProductCreated(payload: Record<string, unknown>) {
    console.log(`(nats)received event(product_created): `, payload);
  }
}
