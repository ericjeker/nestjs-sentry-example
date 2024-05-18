import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  throwError() {
    throw new HttpException({ message: 'Sample Error' }, 500);
  }

  success() {
    return { version: 'v3.0' };
  }

  async successAsync() {
    return { version: 'v3.0' };
  }
}
