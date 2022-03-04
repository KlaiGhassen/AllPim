import { HttpClient } from "@angular/common/http";
import { GlobalService } from "./global.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class InitialazerService {
  constructor(private http: HttpClient, private gs: GlobalService) {}

  Init() {
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem("token");
      if (token) {
        this.http.get(`${this.gs.uri}/authPatient/current`).subscribe(
          (user: any) => {
            this.gs.setUser(user[0]);
            resolve(true);
            console.log(user[0]);
          },
          (err) => {
            if (err.status === 401 || err.status === 403) {
             // this.gs.logOut();
            } else if (err.status === 0) {
              alert("erreur dans le serveur");
            }
            resolve(true);
          }
        );
      } else {
      //  this.gs.logOut();
        resolve(true);
      }
    });
  }


  
}
