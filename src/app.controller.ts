import { Controller, Get, Res } from '@nestjs/common';
import { VariableValue } from '@devcycle/nestjs-server-sdk';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(
    @Res() res,
    @VariableValue({ key: 'example-text', default: 'default' }) greeting: string,
  ) {
    const html = this.appService.getHello(greeting);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }


  @Get('/variables')
  getVariables() {
    return this.appService.getVariables();
  }
}
