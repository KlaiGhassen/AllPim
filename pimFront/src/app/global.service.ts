import { Injectable, Injector } from "@angular/core";
import * as shajs from "sha.js";
import { Router } from "@angular/router";
import { User } from "./entities/user";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GlobalService {
  private user: any;
  private userS: BehaviorSubject<any> = new BehaviorSubject<any>(null);

 uri: any ="http://localhost:3000" //"http://localhost:3000"; 
  // uri: any ="http://localhost:3000" // backend url
   PredectionUri :any = "http://localhost:8000"
   private readonly TOKEN = 'access_token';
   //chat
   public readonly BASE_URL = 'http://localhost:3000';
   public readonly API_URL = `${this.BASE_URL}/api`;

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
  signIn(user: any, jwt: any) {
    localStorage.setItem(this.TOKEN, jwt);
    this.user.next(user);
    this.userS.next(user);
    this.router.navigate(['']);
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
  signOut() {
    localStorage.removeItem(this.TOKEN);
    this.user.next(null);
    this.router.navigate(['sign-in']);
  }
  
  set currentUser(user: any) {
    this.userS.next(user);
  }

  get currentUser(): Observable<any> {
    return this.userS.asObservable();
  }

  get currentAccessToken(): any {
    return localStorage.getItem(this.TOKEN);
  }
}
