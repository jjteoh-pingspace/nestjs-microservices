import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy, NatsRecordBuilder } from '@nestjs/microservices';
import * as nats from 'nats';
import { Observable, timeout } from 'rxjs';
import { diKeys } from './common/keys';

@Controller({
  path: `fake-client`,
})
export class FakeClientController {
  constructor(
    @Inject(diKeys.TCP_CLIENT) private readonly _tcpClient: ClientProxy,

    // NOTE: observed every injection will spawn a new connection
    @Inject(diKeys.NATS_CLIENT) private readonly _natsClient: ClientProxy,
  ) {}

  @Get(`/tcp/:id`)
  getViaTCP(@Param(`id`) id: string): Observable<any> {
    // send message to tranporter/message bus(_tcpClient)
    // which will resolve the value from subscriber
    // and return to client
    return this._tcpClient
      .send<any>({ cmd: `tcp_get_product_by_id` }, id)
      .pipe(timeout(5000));
  }

  @Get(`/nats/:id`)
  getViaNATS(@Param(`id`) id: string): Observable<any> {
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
        .send<any>({ cmd: `nats_get_product_by_id` }, record)
        .pipe(timeout(5000));
    } catch (ex) {
      console.error(ex);
    }
  }
}
