export interface User  {
  email: string,
  password: string,
  username?: string,
  token?: string,
  message?: string,
  Role?: string,
  names?: string,
  lastNames?: string
  telefono?: string,
}

export interface UserResponse  {
  message: string,
  token: string,
  userInfo: UserInfo
}

export interface UserInfo  {
  _id: string,
  email: string,
  nombres: string,
  apellidos: string,
  telefono: string,
  rol: string,
  fotoPerfil: string,
}

export interface GetUserResponse {
  user: UserResponse
}

export interface GetAllUserResponse {
  _id:              string;
  nombres:          string;
  apellidos:        string;
  email:            string;
  password:         string;
  es_administrador: boolean;
  es_usuario:       boolean;
  esta_activo:      boolean;
  creado_a:         Date;
  actualizado_a:    Date;
  foto_perfil:      string;
  img_url:          string;
}

export interface UpdateUserRequest {
  id:               string;
  nombres:          string;
  apellidos:        string;
  email:            string;
  telefono:         string;
  currentPassword:  string;
  newPassword:      string;
  confirmPassword:  string;
}