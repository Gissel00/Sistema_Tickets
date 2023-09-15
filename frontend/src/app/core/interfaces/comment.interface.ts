import { CreadorIDClass, TicketResponse } from "./ticket.interface";

export interface CommentResponse {
  _id: string;
  asunto: string;
  contenido: string;
  creador: CreadorIDClass;
  ticket: TicketResponse,
  modificador_id: string;
  esta_eliminado: boolean;  
  creado_a: Date;
  actualizado_a: Date;
  message?: string;
  img_url: any;
}

export interface CommentCreate {
  asunto: string;
  contenido: string;
  ticket: number;
  img_url: any;
}

export interface CommentPushing {
  message: string;
  comentario: CommentResponse[];
}