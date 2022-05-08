import { Component, OnInit , ViewEncapsulation } from '@angular/core';
import { Transaction } from './pricing.model';
import { GlobalService } from 'app/global.service';
import { PricingService } from './pricing.service';
import { MatEndDate } from '@angular/material/datepicker';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  encapsulation  : ViewEncapsulation.None,

})
export class PricingComponent implements OnInit {
  yearlyBilling: boolean = true;
  user
  token
  priceMonth:Number = 29
  priceYear:Number = 324
  price_topay
  appendtype = " / year"
  transactions: Transaction[]

  constructor(private gs: GlobalService, private _pricingService:PricingService) { }
  handler:any = null;
 

  


  ngOnInit() {
    
    //console.log(this.gs.getUser()._id)
    this.user = this.gs.getUser()._id
    this.price_topay = 339;

    this.loadStripe();

    this._pricingService.getAllTransactionsByDocId(this.user).subscribe((res)=>{
      this.transactions = res
      this.transactions.forEach(element => {
        if(element.state === true){
          const button = window.document.getElementById('buyPremium').setAttribute("disabled","disabled");
        }
      });
    })
  }

  checkifpaid(){
    this._pricingService.getAllTransaction().subscribe((res) => {
      res
    });
  }

 
  toggle(){
    this.yearlyBilling = !this.yearlyBilling
    if(!this.yearlyBilling){
    this.price_topay = this.priceMonth
    this.appendtype = " / mo"
  }else{
    this.price_topay = this.priceYear
    this.appendtype = " / year"
  }
  }


  pay(amount: any) {    
 
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51KmTfQICv7N54aCWi65iPJlDBR9inEdxFaEGqthyoGG7sskaZukL5JMPvFolg6rUinjG6egMj8DDSchS9TGgo44L00mtlHCpXT',
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        console.log(token)
        console.log("token:::::::::::::",token.id)

        this.token = token

        //alert('Token Created!!');
      }
      
    });
    
        //-----------------------------------
        
        var id = this.token;
        //var docId = this.gs.getUser()._id;
        //console.log("dociiiiii",docId)
        var price = 0;
        if(this.yearlyBilling ){
          price = 339
        } else{
          price = 29
        }
        
        var state = true;
        var gg = new Date

          if(!this.yearlyBilling ){
            var t = new Transaction(id,this.user,state,gg,gg,price)
            this._pricingService.checkout(t,"month").subscribe((res)=> {
              console.log
              this.ngOnInit()
            })
          }
          else {
            var t = new Transaction(id,this.user,state,gg,gg,price)
            this._pricingService.checkout(t,"year").subscribe((res)=> {
              console.log
              this.ngOnInit()
            })
          }
        

        //-----------------------------------
        
 
    handler.open({
      name: 'Premium Subscription',
      description: '',
      amount: amount * 100
    });
 
  }
 
  loadStripe() {
     
    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51KmTfQICv7N54aCWi65iPJlDBR9inEdxFaEGqthyoGG7sskaZukL5JMPvFolg6rUinjG6egMj8DDSchS9TGgo44L00mtlHCpXT',
          locale: 'auto',
          token: function (token: any) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
           
            
          }
        });
      }
       
      window.document.body.appendChild(s);
    }
  }
}
