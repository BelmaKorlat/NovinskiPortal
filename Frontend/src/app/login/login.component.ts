import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const payload = {
        emailOrUsername: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.apiService.post<any>('/authentication/login', payload)
        .then((response: any) => {
          if (response && response.token) {
            localStorage.setItem("authToken", response.token);
            this.router.navigate(['/admin']);
          } else {
            this.errorMessage = 'Neispravni podaci ili problem s autentifikacijom.';
          }
        })
        .catch((error: any) => {
          console.error('Greška pri prijavi:', error);
          this.errorMessage = 'Greška pri prijavi. Provjerite unesene podatke.';
        });
    }
  }
}
