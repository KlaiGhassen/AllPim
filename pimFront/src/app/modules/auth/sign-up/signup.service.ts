import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from 'app/global.service';

@Injectable({
    providedIn: 'root',
})
export class SignupService {
    constructor(private gs: GlobalService, private http: HttpClient) {}
    registerUser(data: any) {
        return this.http.post<any>(`${this.gs.uri}/signup`, {
            full_name: data.full_name,
            email: data.email,
            profilePicture: data.profilePicture,
            password: this.gs.hashPassword(data.password),
            description: data.description,
            phone_number: data.phoneNumber
        });
    }
}
