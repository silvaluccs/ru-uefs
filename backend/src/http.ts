import { NestFactory } from '@nestjs/core';
import { HttpModule } from './ui/http/http.module';

async function bootstrap() {
  const app = await NestFactory.create(HttpModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
