import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  ngOnInit(): void {
  }

  signinForm: FormGroup = this.fb.group({});
    
    constructor(private fb: FormBuilder, private auth: AuthService) {
      if(auth.isAuthenticated()){
        auth.navigateToHome();
      }
      this.initiateForm();
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

}
