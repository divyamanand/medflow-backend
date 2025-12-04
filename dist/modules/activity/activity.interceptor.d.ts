import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ActivityService } from './activity.service';
export declare class ActivityInterceptor implements NestInterceptor {
    private readonly activitySvc;
    constructor(activitySvc: ActivityService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
