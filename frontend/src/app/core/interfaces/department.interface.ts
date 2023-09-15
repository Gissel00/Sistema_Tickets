export interface Department {
  _id: string;
  nombreDepartamento: string;
  descripcion: string;
  creador_id: string;
  modificador_id: string;
  esta_eliminado: boolean;
  creado_a:       string;
  actualizado_a:  string;
}

export interface DepartmentResponse {
  _id: string;
  nombreDepartamento: string;
  descripcion: string;
  creador_id:     string;
  modificador_id: string;
  creado_a:       Date;
  actualizado_a:  Date;
  [key: string]: any;
}

export interface DepartmentEdit {
  _id: string;
  nombreDepartamento: string;
  descripcion: string;
  actualizado_a:  Date;
  [key: string]: any;
}

export interface MessageResponse {
  message: string;
}

export interface DepartmentCreate {
  nombreDepartamento: string;
  descripcion: string;
  [key: string]: any;
}
export interface DepartmentDelete {
  _id:            string;
}

