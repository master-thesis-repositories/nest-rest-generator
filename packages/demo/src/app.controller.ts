import {Controller, Get, Post} from '@nestjs/common';
import { AppService } from './app.service';

@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  public getHello(): string {
    return this.appService.getHello();
  }

  @Get("/:id")
  public getHelloById() {}

  @Post("/")
  public postHello() {

  }
}
