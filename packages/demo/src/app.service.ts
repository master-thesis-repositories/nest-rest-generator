import {Injectable} from '@nestjs/common';


export type Example = {
  example: string;
};


@Injectable()
export class AppService {
  public getExample() {
    const example: Example = {
      example: "example",
    };

    return example;
  }

  public getExampleById(id: string) {
    return {
      example: `Example ${id}`,
    };
  }

  public createExample(data: Example) {
    console.log(data);
  }
}
