import { ExecutionContext, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DevCycleModule } from '@devcycle/nestjs-server-sdk';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskService } from './task.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    DevCycleModule.forRoot({
      key: process.env.DEVCYCLE_SERVER_SDK_KEY,
      options: {},
      userFactory: (context: ExecutionContext) => ({
        user_id: "user123",
        name: "Jane Doe",
        email: "jane.doe@email.com",
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService, TaskService],
})
export class AppModule {}
