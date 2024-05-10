import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  ClientGrpc,
  ClientProxy,
  NatsRecordBuilder,
} from '@nestjs/microservices';
import * as nats from 'nats';
import { Observable, timeout } from 'rxjs';
import { diKeys } from './common/keys';
import { Product } from './models/product';

/**
 * an interface that mock the "shape" of the ProductsService defined in protobuf
 * to enforce typing
 */
interface ProductGrpcService {
  findOne(dto: { id: string });
}

/**
 * a HTTP controller use for testing
 * convert HTTP protocol to other transport medium and
 * return result to HTTP client
 */
@Controller({
  path: `fake-client`,
})
export class FakeClientController implements OnModuleInit {
  private _productgRpcService: ProductGrpcService;

  constructor(
    @Inject(diKeys.TCP_CLIENT) private readonly _tcpClient: ClientProxy,

    // NOTE: observed every injection will spawn a new connection
    @Inject(diKeys.NATS_CLIENT) private readonly _natsClient: ClientProxy,

    @Inject(diKeys.GRPC_CLIENT) private readonly _grpcClient: ClientGrpc,
  ) {}

  async onModuleInit() {
    this._productgRpcService =
      this._grpcClient.getService<ProductGrpcService>(`ProductsService`);
  }

  @Get(`/tcp/:id`)
  getViaTCP(@Param(`id`) id: string): Observable<Product> {
    // send message to tranporter/message bus(_tcpClient)
    // which will resolve the value from subscriber
    // and return to client
    return this._tcpClient
      .send<Product>({ cmd: `get_product_by_id`, transport: `TCP` }, id)
      .pipe(timeout(5000));
  }

  @Get(`/nats/:id`)
  getViaNATS(@Param(`id`) id: string): Observable<Product> {
    const headers = nats.headers();
    headers.set(`x-version`, `1.0.0`);
    headers.set(`token`, `abc123`);

    // build record
    const record = new NatsRecordBuilder()
      .setData(id)
      .setHeaders(headers)
      .build();

    try {
      return this._natsClient
        .send<Product>({ cmd: `get_product_by_id`, transport: `NATS` }, record)
        .pipe(timeout(5000));
    } catch (ex) {
      console.error(ex);
    }
  }

  @Get(`grpc/:id`)
  getViaGrpc(@Param(`id`) id: string) {
    return this._productgRpcService.findOne({ id });
  }
}
