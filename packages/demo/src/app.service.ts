import {Injectable} from '@nestjs/common';


export type Example = {
  example: string;
  test: number;
};


@Injectable()
export class AppService {
  public getExample() {
    const example: Example = {
      example: "example",
      test: 0,
    };

    return example;
  }

  public getExampleById(id: string) {
    return {
      example: `Example ${id}`,
    };
  }

  public createExample(data: any) {
    console.log(data);
  }
}
