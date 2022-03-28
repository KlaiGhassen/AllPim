import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
import { GlobalService } from 'app/global.service';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,
        private gs:GlobalService,
        
        )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User>
    { let _user = this.gs.getUser();
        console.log("cuureent user",_user);
        return this._httpClient.get<User>(this.gs.uri+'/auth/current/'+_user._id).pipe(
            tap((user) => {
                this._user.next(user);
                this.user=_user;
            })
            
        );

    }

 
    update(user: any)
    {
        return this._httpClient.patch<any>(this.gs.uri+'/ophto/'+user.email, user)
    }

    updateLicense(email:string ,file:any)
    {
        return this._httpClient.patch<any>(this.gs.uri+'/ophto/license/'+email, {file: file})
    }
    postFile(fileToUpload: File) {
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        return this._httpClient.patch<any>(this.gs.uri+'/ophto/license/'+this.gs.getUser().email,formData,
        );
      }
}