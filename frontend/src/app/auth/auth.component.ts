import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Errors, UserService } from '../core';
import { User, UserInfo, UserResponse } from '../core/interfaces/user.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  authType: string = '';
  title: String = '';
  errors: Errors = { errors: {} };
  isSubmitting = false;
  isUser = false;
  isAdministrator = false;
  authForm: FormGroup;
  newRequestUser: User = {
    email: '',
    password: '',
    names: '',
    lastNames: '',
  };
  userResponse: UserResponse = {
    message: '',
    token: '',
    userInfo: {} as UserInfo,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.url.subscribe((data) => {
      // Get the last piece of the URL (it's either 'login' or 'register')
      this.authType = data[data.length - 1].path;
      // Set a title for the page accordingly
      this.title = this.authType === 'login' ? 'Sign in' : 'Sign up';
      // add form control for username if this is the register page
      if (this.authType === 'register') {
        this.authForm.addControl('names', new FormControl());
        this.authForm.addControl('lastNames', new FormControl());
        this.authForm.addControl('telefono', new FormControl());
      }
    });
  }

  onChangeUser(event: any) {
    const isChecked: boolean = event.target.checked;
    if (!this.isAdministrator && isChecked) {
      this.isUser = isChecked;
      return;
    }
    this.isUser = isChecked;
  }

  onChangeAdministrator(event: any) {
    const isChecked: boolean = event.target.checked;
    if (!this.isUser && isChecked) {
      this.isAdministrator = isChecked;
      return;
    }
    this.isAdministrator = isChecked;
  }

  handleOnSubmitForm() {
    const { password, email, names, lastNames, telefono } = this.newRequestUser;
    if (this.authType === 'login') {
      this.userService.attemptAuth(this.authType, password, email).subscribe({
        next: (response) => {
          this.userResponse = response;
          this.toastr.success(this.userResponse.message, 'Login exitoso');
          this.router.navigateByUrl('/my-tickets');
        },
        error: (err) => this.toastr.error(err),
      });

      return;
    }
    this.userService
      .registerNewUser(
        this.authType,
        password,
        email,
        names!,
        lastNames!,
        telefono!,
        this.isAdministrator,
        this.isUser
      )
      .subscribe({
        next: (data) => {
          this.userResponse = data;
          this.router.navigateByUrl('/login');
        },
        error: (err) => this.toastr.error(err),
      });
  }
}
