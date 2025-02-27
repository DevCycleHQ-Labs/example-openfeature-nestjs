import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { OpenFeatureModule } from '@openfeature/nestjs-sdk';
import { DevCycleNestJSProvider } from '@devcycle/openfeature-nestjs-provider';
import { OpenFeature } from '@openfeature/server-sdk';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskService } from './task.service';

const provider = new DevCycleNestJSProvider(
  process.env.DEVCYCLE_SERVER_SDK_KEY,
);

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    OpenFeatureModule.forRoot({
      contextFactory: () => ({
        targetingKey: 'user123',
        email: 'jane.doe@email.com',
        name: 'Jane Doe',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TaskService,
    {
      provide: 'DVC_CLIENT',
      useValue: provider.devcycleClient,
    },
  ],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    await OpenFeature.setProviderAndWait(provider);
  }
}
