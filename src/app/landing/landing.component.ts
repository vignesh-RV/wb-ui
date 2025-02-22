import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NSEService } from '../services/nse.service';
import { Router } from '@angular/router';
declare var Swiper: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  showLoginForm:boolean = false;
  showSignupForm:boolean = false;

  date:Date = new Date();


  ngOnInit(): void {
  }

  ngAfterViewInit(): void{
    new Swiper('.swiper', {
      spaceBetween: 10,
      loop: true,
      autoplay: { delay: 3000 },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      breakpoints: {
        320: { slidesPerView: 1 },  // Small screens (mobile)
        640: { slidesPerView: 2 },  // Tablets
        1024: { slidesPerView: 4 }, // Laptops
        1440: { slidesPerView: 5 }  // Large screens
      }
    });
  }

  signinForm: FormGroup = this.fb.group({});
  requiredIndexes:any = [{name: "NIFTY 50"},{name: "Nifty Financial Services"},{name: "NIFTY 500"},{name: "NIFTY Bank"},
    {name: "NIFTY 100"},{name: "NIFTY 200"},{name: "NIFTY Next 50"},{name: "NIFTY Midcap 150"}]

    constructor(private fb: FormBuilder, private auth: AuthService, private nse: NSEService, private currentRoute: Router) {
      this.getStocks();
      if(auth.isAuthenticated()){
        auth.navigateToHome();
      }
      this.initiateForm();

      this.showSignupForm = currentRoute.url == '/signup'
      this.showLoginForm = currentRoute.url == '/login'
    }

    initiateForm(){
      this.signinForm = this.fb.group({
        phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        password: [
          '', 
          [
            Validators.required,
            Validators.minLength(8)
          ]
        ]
      });
    }

    submitForm() {
      if(!this.signinForm) return;

      let data = this.signinForm.getRawValue();
      this.auth.doLogin(data);
    }

  async getStocks() {
    for(let i = 0; i < this.requiredIndexes.length; i++) {
      let stocks = await this.nse.getNseData(this.requiredIndexes[i]['name']);
      console.dir(stocks);
      stocks['data']['change'] = parseFloat(stocks['data']['change']).toFixed(2);
      this.requiredIndexes[i]['data'] = stocks;
    }
  }

  signInWithGoogle(){
    this.auth.showGoogleLogin();
  }

  navigateToLogin() {
    this.auth.navigateToLogin();
  }
  
  navigateToSignup() {
    this.auth.navigateToSignup();
  }

  navigateToHome(){
    this.auth.navigateToHome();
  }
}
