import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  
  
  
  private baseUrl = 'http://localhost:8585/api/products';
  
  private categoryUrl = 'http://localhost:8585/api/product-category';
  
  constructor(private httpClient: HttpClient) { }
  
  getProductListPaginate(thePage:number, thePageSize: number,currentId:number): Observable<GetResponseProducts> {
    const searchUrl =`${this.baseUrl}/search/findByCategoryId?id=${currentId}`
       + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
  
  
  getProductCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
      )
    }


    searchProduct(theKeyWord: string): Observable<Product[]> {
      const searchUrl =`${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`;
      return this.getProducts(searchUrl);
    }

    searchProductsPaginate(thePage:number, thePageSize: number,theKeyWord: String): Observable<GetResponseProducts> {
      const searchUrl =`${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`
         + `&page=${thePage}&size=${thePageSize}`;
      return this.httpClient.get<GetResponseProducts>(searchUrl);
    }
    

    

    private getProducts(searchUrl: string):Observable<Product[]>{
      
      return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
        map(response => response._embedded.products)
        );
    }


    getProduct(theProductId: number):Observable<Product>{
      
      const productUrl = `${this.baseUrl}/${theProductId}`;
        return this.httpClient.get<Product>(productUrl);
    }
  }
  
  interface GetResponseProducts {
    _embedded: {
      products: Product[];
    },
    page :{
      size: number,
      totalElements:number,
      totalPages: number,
      number: number,

    }
  }
  
  interface GetResponseCategory {
    _embedded: {
      productCategory: ProductCategory[];
    }
  }
