import { Weather } from './../models/weather.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey: string = '989752867fcf590352b6973497182b36';
  private url: string = 'https://api.openweathermap.org/data/2.5/weather?q=';
  private unit: string = '&units=metric';
  private _jsonUrl = '../../assets/jsonfiles/countryCity.json';
  private array: { name: string, country: string }[] = [];

  constructor(private http: HttpClient) { }

  fixString(str: string): string {
    return str.includes('-') ? str.replace('-', ',') : str;
  }

  getWeather(city: string, lang: string): Observable<any> {
    city = this.fixString(city);

    //English
    if (lang === 'English') {
      console.log(`1: ${this.url}${city}${this.unit}&appid=${this.apiKey}`);
      return this.http.get<any>(`${this.url}${city}${this.unit}&appid=${this.apiKey}`);
    }
    //Portuguese
    else {
      console.log(`2: ${this.url}${city}${this.unit}&appid=${this.apiKey}`);
      return this.http.get<any>(`${this.url}${city}${this.unit}&appid=${this.apiKey}&lang=pt_br`);
    }
  }

  getInitialLocation(lat: number, lon: number): Observable<any> {
    //console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`);
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}${this.unit}&appid=${this.apiKey}`);
  }


/*   getAllCities(letter: string): Array <{name: string, country: string}> {
    this.http.get(this._jsonUrl).subscribe(data => {
      for (let i = 0; i < 22635; i++) {
        //console.log(data[i].name);
        if (data[i].name.toLocaleLowerCase().includes(letter)) {
          this.array.push(data[i]);
        }
      }
    })
    return this.array;
  } */
getAllCities(): Observable<any> {
  return this.http.get(this._jsonUrl);
}

}
