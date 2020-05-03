import { Weather } from '../models/weather.model';
import { WeatherService } from '../weather-service/weather.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormControl} from '@angular/forms';


/**
 * @title Simple autocomplete
 */


/* export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40
} */

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @Input('lang') language: string;
  @Output() initialLanguage = new EventEmitter();

/*   @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
    let i = 0;
    if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.matchedCities[i--];
    }

    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      this.matchedCities[i++];
    }
  } */
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  decobomba = 'ANDRE MACHADO DO MONTE'; 
  weather: Weather = new Weather();
  input: string = "";
  displayInfo: boolean;
  error: boolean = false;
  error2: boolean = false;
  matchedCities: { name: string, country: string }[] = [];
  cities: { name: string, country: string }[] = [];



  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.displayInfo = false;
    this.getGeoLocation();
    this.getAll();
  }
getName(city): string {
  return city.name + ',' + city.country;
}
  getAll() {
    this.weatherService.getAllCities().subscribe(data => {
      this.cities = data;
    })
  }

  callOtherfunc(event: any) {
    if (event.key === 'ArrowDown') {
      console.log('larissa DOWN')
    }
    else if (event.key === 'ArrowUp') {
      console.log('Ronaldo UP')
    }
  }

  autoComplete() {
    if (this.input.length >= 3) {
      this.matchedCities = this.cities.filter((value) => {
        return value.name.toLowerCase().includes(this.input.toLowerCase());
      })
      console.log(this.matchedCities);
    }
     if (this.input.length < 1) {
      console.log('Apagou array');
      this.matchedCities = [];
    }
  }

  setcity(param: any) {
    this.matchedCities = [];
    this.input = param.name + ', ' + param.country;
  }

  move(arr: { name: string, country: string }, direction: string) {
    alert('arrow ' + direction);
    console.log(arr.name + '' + arr.country);
  }

  hiddeAutoBox() {
    this.matchedCities = [];
  }

  createWeatherObj(cityname: string, language: string) {
    this.weatherService.getWeather(cityname, language)
      .subscribe(data => {
        this.changeBG(this.dayOrNight(
          this.getLocalDate(data.timezone),
          this.getSunrise_sunset_time(data.timezone, data.sys.sunrise),
          this.getSunrise_sunset_time(data.timezone, data.sys.sunset)))
        this.weather = new Weather
          (
            data.name,
            data.sys.country,
            new Date(this.getLocalDate(data.timezone)),
            data.weather[0].icon,
            data.weather[0].main,
            data.weather[0].description,
            Math.round(data.main.temp),
            this.meterSecondTokmHour(data.wind.speed),
            this.getWindDirection(data.wind.deg),
            data.main.humidity,
            Math.round(data.main.feels_like),
            data.main.pressure,
            Math.round(data.main.temp_min),
            Math.round(data.main.temp_max),
            this.meterToKm(data.visibility),
            new Date(this.getSunrise_sunset_time(data.timezone, data.sys.sunrise)),
            new Date(this.getSunrise_sunset_time(data.timezone, data.sys.sunset))
          )
        this.displayInfo = true;
      }, (err) => { this.error2 = true; this.error = false; console.log(err.message) })
  }

  getWeatherInfo() {
    this.matchedCities = [];

    if (!this.input) {
      this.error = true;
      this.error2 = false;
      return
    }
    this.error = false;
    this.error2 = false;
    this.createWeatherObj(this.input, this.language);
  }

  meterSecondTokmHour(speed1: number): number {
    return Math.round(speed1 * 3.6);
  }

  meterToKm(number: number): number {
    return Math.round(number / 1000);
  }

  getWindDirection(num: number) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
  }

  changeBG(str: string) {
    let element = document.getElementById('day_night');
    let button = document.getElementById('dark-light');
    element.classList.remove('init');
    button.classList.remove('btn-primary');

    if (str === 'night') {
      element.classList.remove('day', 'init');
      element.classList.add('night');
      button.classList.remove('btn-dark', 'text-white', 'btn-primary', 'text-white');
      button.classList.add('btn-warning', 'text-dark');
    }
    else {
      element.classList.remove('night', 'init');
      element.classList.add('day');
      button.classList.remove('btn-warning', 'text-dark', 'btn-primary', 'text-white');
      button.classList.add('btn-dark', 'text-white');
    }
  }

  dayOrNight(localTime: number, sunrise: number, sunset: number): string {
    return (localTime >= sunset || localTime < sunrise) ? 'night' : 'day';
  }

  getSunrise_sunset_time(timezone: number, timestamp: number): number {
    let offsettime = new Date().getTimezoneOffset() * 60000;
    timezone = timezone * 1000;
    return (timestamp * 1000) + (timezone + offsettime);//timestamp * 1000 to convert seconds in miliseconds
  }

  getLocalDate(timezone: number): number {
    let date = new Date().getTime();
    let localOffset = new Date().getTimezoneOffset() * 60000;
    let localTime = date + localOffset + (timezone * 1000);
    return localTime;
  }

  getGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((geoPosition) => {
        this.weatherService.getInitialLocation(/* -5.79, -35.21 */geoPosition.coords.latitude, geoPosition.coords.longitude)
          .subscribe(data => {
            if (data.sys.country === 'BR' || data.sys.country === 'PT' || data.sys.country === 'AO' || data.sys.country === 'CV' || data.sys.country === 'GW' || data.sys.country === 'GQ') {
              this.initialLanguage.emit("Português");
              this.language = 'Português';
            }
            else {
              this.initialLanguage.emit("English");
              this.language = 'English';
            }
            this.createWeatherObj(data.name, this.language);
          }), (error => { console.log(error.message) });
      }, (error) => {
        console.log(error.message);
      })
    }
  }

}
