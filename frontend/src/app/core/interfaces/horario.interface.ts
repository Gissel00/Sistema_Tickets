export interface HorarioResponse {
  _id                   : string;
  horaInicio            : number;
  horaFinal             : number;
  incluyeFinesDeSemana  : boolean;
  creado_a              : string;
  actualizado_a         : string;
  [key: string]: any;
}

export interface Horario {
  _id                   : string;
  horaInicio            : number;
  horaFinal             : number;
  incluyeFinesDeSemana  : boolean;
  creado_a              : string;
  actualizado_a         : string;
  [key: string]         : any;
}

export interface HorarioEdit {
  _id                   : string;
  horaInicio            : number;
  horaFinal             : number;
  incluyeFinesDeSemana  : boolean;
  creado_a              : string;
  actualizado_a         : string;
  [key: string]: any;
}

export interface MessageResponse {
  message: string;
}

export interface HorarioCreate {
  horaInicio            : number;
  horaFinal             : number;
  incluyeFinesDeSemana  : boolean;
  [key: string]: any;
}
export interface HorarioDelete {
  _id:            string;
}