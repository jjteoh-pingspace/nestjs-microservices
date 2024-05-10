import { Controller, Get, Param } from '@nestjs/common';
import { Product } from '../models/product';
import { ProductService } from '../product.service';

@Controller({
  path: `/product`,
})
export class ProductHttpGateway {
  constructor(private readonly _productService: ProductService) {}

  // GET /:id
  @Get(`/:id`)
  async index(@Param(`id`) id: string): Promise<Product> {
    return await this._productService.findOneById(id);
  }
}
