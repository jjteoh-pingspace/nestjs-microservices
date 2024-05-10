import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Product } from '../models/product';
import { ProductService } from '../product.service';

@Controller()
export class ProductTCPGateway {
  constructor(private readonly _productService: ProductService) {}

  // TCP endpoint
  @MessagePattern({ cmd: `get_product_by_id`, transport: `TCP` })
  async getProductById(id: string): Promise<Product> {
    console.log(`(tcp)received message: ${id}`);

    return await this._productService.findOneById(id);
  }
}
