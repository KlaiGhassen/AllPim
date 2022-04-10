export class Transaction {
    _id: string;
    id: string;
    docId: string;
    state: Boolean;
    startDate: Date;
    endDate: Date;
    price: Number;


    constructor(id: string, docId: string, state: Boolean, startDate: Date, endDate: Date, price: Number) {
        this.id = id;
        this.docId = docId;
        this.state = state;
        this.startDate = startDate;
        this.endDate = endDate;
        this.price = price;
    }
}