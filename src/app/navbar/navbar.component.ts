import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() langChanged = new EventEmitter();
  @Input() initialLanguage: string;
  selectedLanguage: string;

  constructor(public translate: TranslateService) {
    translate.addLangs(['English', 'Português']);
    translate.setDefaultLang('English');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/English|Portugês/) ? browserLang : 'English');
   }

  ngOnInit(): void {
    this.selectedLanguage = this.translate.getDefaultLang();
  }

  ngOnChanges() {
    if(this.initialLanguage) {
      this.switchLanguage(this.initialLanguage);
    }
  }

  switchLanguage(selected_language: string) {
   this.selectedLanguage = selected_language;
   this.initialLanguage = selected_language;
   this.translate.use(this.selectedLanguage);
   this.langChanged.emit(this.selectedLanguage);
  }

  refreshPage() {
    document.location.reload();
  }
}
