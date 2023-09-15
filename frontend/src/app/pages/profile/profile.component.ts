import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs'
import { JwtService, UserService } from 'src/app/core';
import { UpdateUserRequest, UserResponse } from 'src/app/core/interfaces/user.interface';
import { FileStorageServices } from 'src/app/core/services/file.storage.service';
import { LoadingService } from 'src/app/shared/loading';
import * as helper from '../../core/helpers/index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  private destroy$: Subject<void> = new Subject<void>();
  user: UserResponse = {} as UserResponse;
  userToUpdate: UpdateUserRequest = {} as UpdateUserRequest;
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private storageService: FileStorageServices,
    private loadingService: LoadingService,
  ) {
    this.user = JSON.parse(this.jwtService.getUserInfo());

    this.userToUpdate = {
      id: this.user?.userInfo?._id,
      nombres: this.user?.userInfo?.nombres,
      apellidos: this.user?.userInfo?.apellidos,
      email: this.user?.userInfo?.email,
      telefono: this.user?.userInfo?.telefono,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.storageService.downloadProfileImg(this.user.userInfo.fotoPerfil)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const blobData: Blob = new Blob([response], { type: 'image/jpeg' });
          const reader = new FileReader();
          reader.readAsDataURL(blobData);
          reader.onloadend = () => {
            const base64data = reader.result;
            this.user.userInfo.fotoPerfil = base64data as string;
            this.loadingService.setLoading(false);
          }
        },
        error: (error) => {
          this.toastr.error('No se pudo cargar la foto de perfil', 'Error');
          this.loadingService.setLoading(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); 
  }

  onUpdateProfile(event: any) {
    event.preventDefault();
    this.loadingService.setLoading(true);
    const request: UpdateUserRequest = this.userToUpdate;
    debugger;
    this.userService
      .update(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {debugger;
          this.toastr.success(response.message, 'Success');
          this.loadingService.setLoading(false);
          if(!helper.isNullOrWhitespace(request.newPassword)){
            this.userService.purgeAuth();
            this.router.navigateByUrl('/login');
            return;
          }
          this.assignToUserUpdated(response);
          this.userService.setAuth(this.user);
        },
        error: (error) => {
          console.log(error);
          this.toastr.error('', 'Error');
          this.loadingService.setLoading(false);
        },
      });
  }

  assignToUserUpdated(userUpdated: UserResponse){
    this.user.userInfo.nombres = userUpdated.userInfo.nombres;
    this.user.userInfo.apellidos = userUpdated.userInfo.apellidos;
    this.user.userInfo.email = userUpdated.userInfo.email;
    this.user.userInfo.telefono = userUpdated.userInfo.telefono;
  }
}
