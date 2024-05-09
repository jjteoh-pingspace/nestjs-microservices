import { Injectable } from '@nestjs/common';

@Injectable()
export class FakeClientService {
  getHello(): string {
    return 'Hello World!';
  }
}
