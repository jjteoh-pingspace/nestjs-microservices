import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { Product } from '../models/product';
import { ProductService } from '../product.service';

@Controller()
export class ProductTCPGateway {
  constructor(private readonly _productService: ProductService) {}

  // TCP(request-response) endpoint
  @MessagePattern({ cmd: `get_product_by_id`, transport: `TCP` })
  async getProductById(id: string): Promise<Product> {
    console.log(`(tcp)received message: ${id}`);

    return await this._productService.findOneById(id);
  }

  // TCP(event based) endpoint
  @EventPattern({ event: `product_created`, transport: `TCP` })
  async handleProductCreated(payload: Record<string, unknown>) {
    console.log(`(tcp)received event(product_created): `, payload);
  }
}
