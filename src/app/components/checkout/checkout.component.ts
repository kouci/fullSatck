import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup : FormGroup;
  totalPrice: number = 0.00;
  totalQuantity : number =0;

  countries : Country[] = [];
  shippingAddressStates : State[] = [];
  billingAddressStates : State[] = [];


  creditCardyears: number[]= [];
  creditCardMonths : number[] = [];

  constructor(private formBuilder: FormBuilder, private luv2ShopFormService : Luv2ShopFormService  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street : [''],
        city   :[''],
        state  :[''],
        country :[''],
        zipCode  : ['']

      }),
      billingAddress: this.formBuilder.group({
        street : [''],
        city   :[''],
        state  :[''],
        country :[''],
        zipCode  : ['']

      }),
     creditCard : this.formBuilder.group({
        cardType : [''],
        nameOnCard   :[''],
        cardNumber :[''],
        securityNumber:[''],
        expirationMonth  : [''],
        expirationYear  : ['']

      })
    });

    // populate the credit card Month
    const startMonth : number = new Date().getMonth() + 1;
    this.luv2ShopFormService.getCreditCardMonth(startMonth).subscribe(
      data =>{ this.creditCardMonths = data}
    );

    // populate the credit card Year
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardyears = data
      }
    );

    // populate the countries credit card
    this.luv2ShopFormService.getCountries().subscribe(
      data =>{
        this.countries = data;
      }
    )
  }

  copyAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    }else{
       this.checkoutFormGroup.controls.billingAddress.reset();
    }


  }

  onSubmit(){
    console.log("handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log(`Your email ${this.checkoutFormGroup.get('customer').value.email}`);
  }

  handleMethodAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear : number = new Date().getFullYear();

    const selectedYear :number = Number(creditCardFormGroup.value.expirationYear);
    console.log(selectedYear);
    let startMonth : number;
    if( currentYear === selectedYear){
        startMonth = new Date().getMonth() +1;
    }else{
      startMonth = 1;
    }
    this.luv2ShopFormService.getCreditCardMonth(startMonth).subscribe(
      data =>{
         this.creditCardMonths = data
      }
    );

  }
  getStates(formGroupName: string){
    console.log("formgroup name:"+formGroupName);
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
 

    console.log("code of country:" +countryCode);

    this.luv2ShopFormService.getStates("IN").subscribe(

   
      data =>{
        if (formGroupName === "shippingAddress"){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }
        formGroup.get('state').setValue(data[0]);
      }
    );




  }

}
