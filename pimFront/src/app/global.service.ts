import { Injectable, Injector } from "@angular/core";
import * as shajs from "sha.js";
import { Router } from "@angular/router";
import { User } from "./entities/user";

@Injectable({
  providedIn: "root",
})
export class GlobalService {
  private user: any;
  uri: any = "http://localhost:3000"; // backend url

  constructor(private injector: Injector) {}

  hashPassword(password: any) {
    return shajs("sha256").update(password).digest("hex");
  }

  isLoggedIn() {
    return !!localStorage.getItem("token") && !!this.user;
  }

  logOut() {
    localStorage.removeItem("token");
    this.user = undefined;
    this.router.navigate(["/login"]);
  }

  saveToken(token:any) {
    localStorage.setItem("token", token);
  }

  getUser() {
    return this.user;
  }

  public get router(): Router {
    return this.injector.get(Router);
  }

  setUser(user:User) {
    this.user = user;
  }
}
