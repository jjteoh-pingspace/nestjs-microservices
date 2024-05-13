import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    // const rpcCtx = context.switchToRpc();
    // const data = rpcCtx.getData();
    // console.log(`data`, data);

    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`After... ${Date.now() - now}ms`)),
      catchError((err) => {
        console.error(err);

        return throwError(() => {
          new HttpException({ message: `doomed` }, 400);
        });
      }),
    );
  }
}
