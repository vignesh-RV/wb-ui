import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {


  ngOnInit(): void {
  }

  signupForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
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
    if (this.signupForm.valid) {
      console.log("Form Submitted", this.signupForm.value);
    } else {
      console.log("Form has errors!");
    }
  }

}
