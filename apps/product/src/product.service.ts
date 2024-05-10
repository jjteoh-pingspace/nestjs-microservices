import { Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { diKeys } from './common/keys';
import { FindOneProductRequest } from './dtos/find-one-product.request';
import { FakeProductRepo } from './fake/fake-product';
import { Product } from './models/product';

export interface IProductService {
  findOne(dto: FindOneProductRequest): Observable<Product>;
}

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
