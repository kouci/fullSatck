import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from '../common/country';
import { map } from 'rxjs/operators';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl="http://localhost:8585/api/countries";
  private statesUrl ="http://localhost:8585/api/states";

  getCountries():Observable<Country[]>{
    
    return this.httpClient.get<getResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )

  }
  getStates(theCountryCode: string):Observable<State[]>{

    const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<getResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
    );
  }


  constructor(private httpClient: HttpClient) { }

  getCreditCardMonth(startMonth: number): Observable<number[]>{

    let data : number[] = [];
    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
    data.push(theMonth);
    }

    return of (data);
  }

  getCreditCardYears(): Observable<number[]>{
    let data : number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear : number = startYear+10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);

    }
    return of (data);
  }
}
   interface getResponseCountries {
     _embedded:{
       countries: Country[]
     }
   }
   interface getResponseStates{
     _embedded:{
       states: State[]
     }
   }

