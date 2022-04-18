import { Url } from 'url';
import { Deserializable } from './Desrializable.model';
export class Patient implements Deserializable {
    _id: string;
    email:  string;
    full_name:  string;
    Bday:  string;
    phoneNumber:  Number;
    profilePicture: Url;
    gender : string
  constructor(_id: string, email: string, full_name: string, Bday: string, phoneNumber: Number, gender : string) { this._id = _id; this.email = email;this.gender= gender; this.full_name = full_name; this.Bday = Bday; this.phoneNumber = phoneNumber }
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
