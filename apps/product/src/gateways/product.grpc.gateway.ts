import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { FindOneProductRequest } from '../dtos/find-one-product.request';
import { MyCustomRpcExceptionFilter } from '../filters/rpc-exception.filter';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { Product } from '../models/product';
import { ProductService } from '../product.service';

@Controller()
@UseInterceptors(LoggingInterceptor)
export class ProductGRPCGateway {
  constructor(private readonly _productService: ProductService) {}

  @GrpcMethod(`ProductsService`, `FindOne`)
  @UseFilters(MyCustomRpcExceptionFilter)
  async getProductById(
    dto: FindOneProductRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<Product> {
    const { id } = dto;

    console.log(`(grpc) received message: ${id}`);
    console.log(`metadata`, metadata);
    console.log(`token`, metadata.get(`authorization`)); // this can be use for auth
    console.log(`version`, metadata.get(`x-version`));
    console.log(`call req`, call.request);

    const product = await this._productService.findOneById(id);

    if (!product) {
      throw new RpcException({
        message: `${id} not found`,
        code: 5, // NOT_FOUND -- check https://grpc.github.io/grpc/core/md_doc_statuscodes.html
      });
    }

    return product;
  }
}
