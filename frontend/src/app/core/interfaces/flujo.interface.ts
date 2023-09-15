export interface DepartmentReponse {
  _id: string;
  nombreDepartamento: string;
  descripcion: string;
  creador_id: string;
  modificador_id: string;
  esta_eliminado: boolean;
}

export interface FlujoResponse {
  _id:            string;
  nombre:         string;
  tiempo_resolucion: number;
  departamento: DepartmentReponse;
  creador_id:     string;
  modificador_id: string;
  esta_eliminado: boolean;
  creado_a:       Date;
  actualizado_a:  Date;
  [key: string]: any;
}

export interface Flujo {
  _id:            string;
  nombre:         string;
  tiempo_resolucion: number;
  departamento: string;
  modificador_id: string;
  creado_a:       string;
  actualizado_a:  string;
  [key: string]: any;
}

export interface FlujoEdit {
  _id:            string;
  nombre:         string;
  departamento: string;
  tiempo_resolucion: number;
  [key: string]: any;
}

export interface FlujoCreate {
  nombre:         string;
  tiempo_resolucion: number;
  departamento: string;
  [key: string]: any;
}
export interface FlujoDelete {
  _id:            string;
}

export const flujoNames = {
  compra: 'Compra',
}

export interface MessageResponse {
  message: string;
}

