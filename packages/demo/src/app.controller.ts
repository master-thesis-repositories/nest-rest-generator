import {Body, Controller, Get, Inject, Param, Post} from '@nestjs/common';
import {AppService} from './app.service';


@Controller("app")
export class AppController {
  @Inject(AppService)
  private readonly appService: AppService;


  // Methods
  @Get("/")
  public getExample() {
    return this.appService.getExample();
  }

  @Get("/:id")
  public getExampleById(@Param() id: string) {
    return this.appService.getExampleById(id);
  }

  @Post("/")
  public createExample(@Body() body: { example: string }) {
    return this.appService.createExample(body);
  }
}
