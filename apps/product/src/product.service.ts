import { Inject, Injectable } from '@nestjs/common';
import { diKeys } from './common/keys';
import { FakeProductRepo } from './fake/fake-product';
import { Product } from './models/product';

// in real world application these methods may query data from db, thus async is used
@Injectable()
export class ProductService {
  constructor(
    @Inject(diKeys.FAKE_PRODUCT_REPO)
    private readonly _fakeProduct: FakeProductRepo,
  ) {}

  async findOneById(id: string): Promise<Product> {
    return this._fakeProduct.products.find((prod) => prod.id === id);
  }
}
