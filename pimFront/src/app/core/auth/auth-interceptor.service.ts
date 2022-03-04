import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = localStorage.getItem("token");
    let cloned = req;
    if (token) {
      cloned = req.clone({
        headers: req.headers.append("Authorization", "Bearer " + token),
      });
    }
    return next.handle(cloned);
  }
}
