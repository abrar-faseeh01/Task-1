import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        // Controllers that already return { success, data } (like your current
        // auth routes) pass through untouched — no double-wrapping.
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }
        return { success: true, data: data ?? null };
      }),
    );
  }
}
