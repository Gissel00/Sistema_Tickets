export interface StatusResponse {
    _id:            string;
    nombre:         string;
    color:          string;
    creador_id:     string;
    modificador_id: string;
    esta_eliminado: boolean;
    creado_a:       Date;
    actualizado_a:  Date;
    [key: string]: any;
  }
  
  export interface Status {
    _id:            string;
    nombre:         string;
    color:          string;
    creador_id:     string;
    modificador_id: string;
    creado_a:       string;
    actualizado_a:  string;
    esta_eliminado: boolean;
  }
  
  export interface StatusEdit {
    _id:            string;
    nombre:         string;
    color:          string;
    esta_eliminado: boolean;
    actualizado_a:  Date;
    [key: string]: any;
  }
  
  export interface MessageResponse {
    message: string;
  }
  
  export interface StatusCreate {
    nombre:         string;
    color:          string;
    [key: string]: any;
  }
  export interface StatusDelete {
    _id:            string;
  }