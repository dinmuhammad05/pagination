import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS yoqish
  app.enableCors();
  
  // Global prefix qo'shish
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log('Mini app http://localhost:3000/api da ishlamoqda');
}
bootstrap();