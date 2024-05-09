import { Test, TestingModule } from '@nestjs/testing';
import { FakeClientController } from './fake-client.controller';
import { FakeClientService } from './fake-client.service';

describe('FakeClientController', () => {
  let fakeClientController: FakeClientController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FakeClientController],
      providers: [FakeClientService],
    }).compile();

    fakeClientController = app.get<FakeClientController>(FakeClientController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(fakeClientController.getHello()).toBe('Hello World!');
    });
  });
});
