import { Metadata } from '@grpc/grpc-js';
import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  ClientGrpc,
  ClientProxy,
  NatsRecordBuilder,
} from '@nestjs/microservices';
import * as nats from 'nats';
import { Observable, ReplaySubject, timeout, toArray } from 'rxjs';
import { diKeys } from './common/keys';
import { Product } from './models/product';

/**
 * an interface that mock the "shape" of the ProductsService defined in protobuf
 * to enforce typing
 */
interface ProductGrpcService {
  findOne(dto: { id: string }, metadata?: any): Product;
  findMany(
    dto$: Observable<{ id: string }>,
    metadata?: any,
  ): Observable<Product>;
  productCreated(
    dto$: Observable<{ id: string }>,
    metadata?: any,
  ): Observable<Product>;
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
  private _stream: any;

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

  @Get(`/tcp/product-created`)
  emitViaTCP(): Observable<unknown> {
    // publish event to subscriber
    return this._tcpClient
      .emit(
        { event: `product_created`, transport: `TCP` },
        { message: `Hello World` },
      )
      .pipe(timeout(5000));
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

  @Get(`/nats/product-created`)
  emitViaNATS(): Observable<unknown> {
    // publish event to subscriber
    return this._natsClient
      .emit(
        { event: `product_created`, transport: `NATS` },
        { message: `Hello World` },
      )
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

  // should get data in single request-response style
  // just to demo how to use grpc stream
  @Get(`grpc/many`)
  getManyViaGrpc() {
    // create a stream of requests, getting a single product at a time
    const ids$ = new ReplaySubject<{ id: string }>();
    ids$.next({ id: `P001` });
    ids$.next({ id: `P002` });
    ids$.next({ id: `P003` });
    ids$.next({ id: `P004` });
    ids$.next({ id: `P005` });
    ids$.complete();

    const metadata = new Metadata();
    metadata.set(`authorization`, `abc123`);

    const stream = this._productgRpcService.findMany(
      ids$.asObservable(),
      metadata,
    );

    // aggregate the result and return as array
    return stream.pipe(toArray());
  }

  @Get(`grpc/:id`)
  getViaGrpc(@Param(`id`) id: string) {
    const metadata = new Metadata();
    metadata.set(`authorization`, `abc123`);

    return this._productgRpcService.findOne({ id }, metadata);
  }
}
