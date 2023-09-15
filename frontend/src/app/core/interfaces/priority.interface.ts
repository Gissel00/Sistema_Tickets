export interface PriorityResponse {
    _id:            string;
    nombre:         string;
    color:          string;
    creador_id:     string;
    modificador_id: string;
    creado_a:       Date;
    actualizado_a:  Date;
    [key: string]: any;
  }
  
  export interface Priority {
    _id:            string;
    nombre:         string;
    color:          string;
    creador_id:     string;
    modificador_id: string;
    creado_a:       string;
    actualizado_a:  string;
    [key: string]: any;
  }
  
  export interface PriorityEdit {
    _id:            string;
    nombre:         string;
    color:          string;
    actualizado_a:  Date;
    [key: string]: any;
  }
  
  export interface MessageResponse {
    message: string;
  }
  
  export interface PriorityCreate {
    nombre:         string;
    color:          string;
    [key: string]: any;
  }
  export interface PriorityDelete {
    _id:            string;
  }