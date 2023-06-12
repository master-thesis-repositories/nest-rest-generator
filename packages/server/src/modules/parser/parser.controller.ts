import {Controller, Inject} from '@nestjs/common';
import {ParserService} from './parser.service';


@Controller('parser')
export class ParserController {
  @Inject(ParserService)
  private readonly parserService: ParserService;
}
