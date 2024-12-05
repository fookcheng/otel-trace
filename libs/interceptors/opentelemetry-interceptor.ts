import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { trace } from '@opentelemetry/api';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class OpenTelemetryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(context);

    const tracer = trace.getTracer('default');
    const span = tracer.startSpan('getHello-span');

    return next.handle().pipe(
      tap(() => {
        span.setAttribute('http.status_code', 'testing'); // Optional: add response status
        span.end(); // Automatically close the span after request is completed
      }),
      catchError((error) => {
        span.setAttribute('error', true); // Optional: add error information to the span
        span.setAttribute('http.status_code', 500); // Set error status code
        span.end(); // Close the span on error
        throw error; // Propagate erro
      }),
    );
  }
}
