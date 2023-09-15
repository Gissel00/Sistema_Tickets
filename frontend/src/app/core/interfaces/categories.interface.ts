export interface GroupResponse {
  _id:            string;
   nombre:         string;
   color:          string;
   creador_id:     string;
   modificador_id: string;
   creado_a:       Date;
   actualizado_a:  Date;
 }
 
export interface CategoriesResponse {
  _id:            string;
  nombre:         string;
  color:          string;
  grupo_id:     string;
  creador_id:     string;
  modificador_id: string;
  esta_eliminado: boolean;
  creado_a:       Date;
  actualizado_a:  Date;
  message?:        string;
  [key: string]: any;
}


export interface Category {
  _id:            string;
  nombre:         string;
  color:          string;
  grupo_id:       string;
  creador_id:     string;
  modificador_id: string;
  creado_a:       string;
  actualizado_a:  string;
  [key: string]: any;
}

export interface CategoryEdit {
  _id:            string;
  nombre:         string;
  color:          string;
  actualizado_a:  Date;
  [key: string]: any;
}

export interface CategoryCreate {
  nombre:         string;
  color:          string;
  grupo_id:       string;
  [key: string]: any;
}
export interface CategoryDelete {
  _id:            string;
}