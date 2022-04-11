import { Injectable, Injector } from "@angular/core";
import * as shajs from "sha.js";
import { Router } from "@angular/router";
import { User } from "./entities/user";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class GlobalService {
  private user: any;
 //uri: any ="http://192.168.1.187:3000" //"http://localhost:3000"; 
   uri: any ="http://localhost:3000" // backend url
   PredectionUri :any = "http://localhost:8000"

  constructor(private injector: Injector, 
    private _httpClient: HttpClient) {}

  hashPassword(password: any) {
    return shajs("sha256").update(password).digest("hex");
  }
  postFileToPy(fileToUpload: File,) {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this._httpClient.post<any>(this.PredectionUri+'/predict_disease',formData,
    );
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
