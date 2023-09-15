export interface GroupResponse {
  _id:            string;
  nombre:         string;
  color:          string;
  creador_id:     string;
  modificador_id: string;
  creado_a:       Date;
  actualizado_a:  Date;
  [key: string]: any;
}

export interface Group {
  _id:            string;
  nombre:         string;
  color:          string;
  creador_id:     string;
  modificador_id: string;
  creado_a:       string;
  actualizado_a:  string;
}

export interface GroupEdit {
  _id:            string;
  nombre:         string;
  color:          string;
  actualizado_a:  Date;
  [key: string]: any;
}

export interface MessageResponse {
  message: string;
}

export interface GroupCreate {
  nombre:         string;
  color:          string;
  [key: string]: any;
}
export interface GroupDelete {
  _id:            string;
}