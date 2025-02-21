import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DevCycleClient } from '@devcycle/nestjs-server-sdk';
import { MockDevCycleClient } from '@devcycle/nestjs-server-sdk/mocks';

import { AppModule } from './../src/app.module';
import { TaskService } from './../src/task.service';

jest.mock('@devcycle/nestjs-server-sdk');

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let devcycleClient: MockDevCycleClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TaskService)
      .useValue({})
      .compile();

    devcycleClient = moduleFixture.get<MockDevCycleClient>(DevCycleClient);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test.each([
    ['step-1', "Welcome to DevCycle's example app."],
    ['step-2', "Great! You've taken the first step in exploring DevCycle."],
    ['step-3', "You're getting the hang of things."],
    ['default', "Welcome to DevCycle's example app."],
  ])('/ (GET)', async (variableValue, expectedText) => {
    devcycleClient.mockVariables({
      'example-text': variableValue,
    });
    const response = await request(app.getHttpServer()).get('/').expect(200);

    expect(response.text).toContain(expectedText);
  });
});
