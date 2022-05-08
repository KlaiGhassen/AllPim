export interface Medicalfollowaup{
     patientId: string,
     notes:  string,
     medical_analysis_interpretation:  string,
     chronic_diseases:  string,
     date : string
}
export interface Patient{
    _id: string,
     email:  string,
     fullName:  string,
     Bday:  Date,
     phoneNumber:  Number,
     gender : string
}
export interface ItemData {
  item: string;
  selected: boolean;
}




