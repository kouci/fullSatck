import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems : CartItem[] =[];

  totalPrice:  Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  

  constructor() { }

  addToCart(theCartItem: CartItem){
    let alreadyExistsInCart : boolean = false;
    let existingCartItem: CartItem = undefined;
   if(this.cartItems.length >0){

   existingCartItem = this.cartItems.find( tempCartItem => theCartItem.id === tempCartItem.id);
  
    alreadyExistsInCart = (existingCartItem !=undefined);
   
    }
    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    
    
    }

    this.computeCartTotals();
  
 
}


 
  computeCartTotals() {
  let totalPriceValue: number = 0;
  let totalQuantityValue : number = 0;

  if(this.cartItems.length >0){
  for( let currentCartItem of this.cartItems){
    totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
    totalQuantityValue += currentCartItem.quantity;
  }
}

  this.totalPrice.next(totalPriceValue);
  this.totalQuantity.next(totalQuantityValue);

  this.logCartData(totalPriceValue,totalQuantityValue);

  }
  logCartData(totalPriceValue: number, totalQuantityValue: number): any {
    console.log("Contents of cart");
   for(let tempcarItem of this.cartItems){
     let subTotalPrice = tempcarItem.quantity * tempcarItem.unitPrice;
     console.log(`name:${tempcarItem.name}, quantity:${tempcarItem.quantity} ,unitPrce: ${tempcarItem.unitPrice},price:${subTotalPrice}`)
   }
   
   console.log(`Ttal price : ${totalPriceValue.toFixed(2)} , Total quantity: ${totalQuantityValue}`);
   console.log("-------")
  }

  decrementQuantity(theCartItem : CartItem){
    theCartItem.quantity--;
    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }

  }
  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id);
   
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  
}


