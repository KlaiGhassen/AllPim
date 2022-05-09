import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { GlobalService } from 'app/global.service';

@Injectable()
export class AuthService {
    public _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private gs: GlobalService,
        private _httpClient: HttpClient,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(
            this.gs.uri + '/auth/forgot-password',
            email
        );
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string, id): Observable<any> {
        let data = { password: this.gs.hashPassword(password), id: id };
        console.log(data);
        return this._httpClient.post(
            this.gs.uri + '/auth/reset-password',
            data
        );
    }
    socialLog(data: any) {


        return this._httpClient.post<any>(`${this.gs.uri}/auth/socauth`, data);
    }

    downloadMedia(fileName: any): Observable<Blob> {
        return this._httpClient.get(
            ` ${this.gs.uri}/upload/download/` + fileName,
            {
                responseType: 'blob',
            }
        );
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        credentials.password = this.gs.hashPassword(credentials.password);

        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient
            .post(this.gs.uri + '/auth/sign-in', credentials)
            .pipe(
                switchMap((response: any) => {
                    console.log('response from service', response);
                    if (response.user.verified) {
                      
                            this.gs.setUser(response.user);
                            this.accessToken = response.accessToken;
                            this.gs.currentUser=response.user;

                            // Set the authenticated flag to true
                            this._authenticated = true;
    
                            // Store the user on the user service
                            this._userService.user = response.user;
    
                            // Return a new observable with the response
                            return of(response);
                      

                        // Store the access token in the local storage
                       
                    }
                    return of(response);
                })
            );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Renew token
        return this._httpClient
            .post(this.gs.uri + '/auth/refresh-access-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    console.log(response);
                    this.gs.setUser(response.user);
                    console.log(this.gs.getUser());
                    this.gs.currentUser=response.user;

                    // Store the access token in the local storage
                    this.accessToken = response.accessToken;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    verification(token) {
        return this._httpClient.patch<any>(`${this.gs.uri}/auth/verification`, {
            accessToken: token,
        });
    }

    confirmationMail(email) {
        console.log('ConfirmationMail', email);
        return this._httpClient.post<any>(`${this.gs.uri}/auth/verified`, {
            email: email,
        });
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(data: any,socialLog: boolean ): Observable<any> {
        if(socialLog){
            return this._httpClient.post<any>(`${this.gs.uri}/ophto`, {
                full_name: data.full_name,
                email: data.email,
                password: this.gs.hashPassword(data.password),
                description: data.description,
                phone_number: data.phoneNumber,
                role:data.role,
                contacts:data.contacts,
                verified:true,
                social:true,
            });


        }else{
        return this._httpClient.post<any>(`${this.gs.uri}/ophto`, {
            full_name: data.full_name,
            email: data.email,
            password: this.gs.hashPassword(data.password),
            description: data.description,
            phone_number: data.phoneNumber,
            role:data.role,
            contacts:data.contacts,
            verified:false,
                social:false,
        });
    }


    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}

function password(password: any): string {
    throw new Error('Function not implemented.');
}
