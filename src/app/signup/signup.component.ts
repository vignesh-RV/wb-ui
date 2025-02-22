import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {


  ngOnInit(): void {
  }

  signupForm: FormGroup = new FormGroup({});
  
  constructor(private fb: FormBuilder, private api: ApiService, private auth: AuthService) {
    this.initiateForm();
  }

  initiateForm() {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(240)]],
      lastName: ['', [Validators.maxLength(240)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$') // At least 1 capital, 1 lowercase, 1 number
        ]
      ],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  // Custom Validator for Password Matching
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: password && confirmPassword ? true : false };
  }

  submitForm() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    if (this.signupForm.valid) {
      console.log("Form Submitted", this.signupForm.value);
      let data = this.signupForm.getRawValue();
      data.password = btoa(data.password);
      this.api.handleRequest('post', '/user/signup', null, data).then((res: any) => {
        if (res) {
          this.api.info("User created successfully..");
          this.auth.navigateToLogin();
        }else{
          this.api.error("Failed to create user..");
        }
      })
    } else {
      console.log("Form has errors!");
    }
  }

  navigateToLogin(){
    this.auth.navigateToLogin();
  }

  clearForm() {
    this.signupForm.reset();
  }
}
