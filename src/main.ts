import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  // Avoid JSON parse errors on GET/HEAD with empty bodies
  app.use((req, res, next) => (req.method === 'GET' || req.method === 'HEAD') ? next() : bodyParser.json({ strict: false })(req, res, next));
  app.use((req, res, next) => (req.method === 'GET' || req.method === 'HEAD') ? next() : bodyParser.urlencoded({ extended: true })(req, res, next));
  app.use(cookieParser());
  app.enableCors({
    origin: (origin: string | undefined, cb: (err: any, allow?: boolean) => void) => cb(null, true),
    credentials: true,
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log();
}
bootstrap();
