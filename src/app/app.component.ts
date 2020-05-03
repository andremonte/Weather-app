import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  language: string;
  lng: string;
  constructor() {}

  ngOnInit() {

  }

  getLanguage(language_: string) {
    this.language = language_;
  }

  getInitialLanguage(language: string) {
    this.lng = language;
  }

}
