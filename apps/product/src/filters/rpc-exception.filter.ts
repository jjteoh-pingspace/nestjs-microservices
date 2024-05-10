import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class MyCustomRpcExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    console.log(`rpc exception`, exception);

    const ctx = host.switchToRpc().getContext();
    console.log(host.switchToRpc());
    console.log(`fdgkl`, ctx);
    // const response = ctx.getResponse();

    // return response.status(9).send(exception.getError());

    return throwError(() => exception.getError());
  }
}
