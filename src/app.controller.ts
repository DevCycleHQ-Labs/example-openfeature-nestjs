import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Res() res) {
    const greeting = await this.appService.getFeatureValue(
      'example-text',
      'default',
    );
    const html = this.appService.getHello(greeting);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('/variables')
  getVariables() {
    return this.appService.getVariables();
  }
}
