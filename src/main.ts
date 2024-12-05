import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startTracing } from '../libs/trace/otel';
import { OpenTelemetryInterceptor } from '../libs/interceptors/opentelemetry-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  startTracing();

  app.useGlobalInterceptors(new OpenTelemetryInterceptor());
  await app.listen(6000);
}
bootstrap();
