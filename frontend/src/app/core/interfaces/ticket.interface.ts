import { Department } from "./department.interface";

export interface CreateTicket {
  prioridad_id: string;
  categoria_id: string;
  contenido: string;
  asunto: string;
  estado_id: string;
  trabajo_flujo_id: string;
}

export interface UpdateTicketStatus {
  estado_id: string;
}

export interface TicketSelect {
  prioritiesSelect: string;
  categoriesSelect: string;
  flujosSelect: string;
  contenido: string;
  asunto: string;
}

export interface TicketPostResponse {
  error?: string;
  message: string;
}

export interface TicketGetResponse {
  _id:              string;
  asunto:           string;
  contenido:        string;
  estado_id:        string;
  prioridad_id:     string;
  creador_id:       string;
  categoria_id:     string;
  trabajo_flujo_id: string;
  modificador_id?:  string;
  esta_eliminado:   boolean;
  [key: string]: any;
}

export interface FlujoActual {
  _id:             string;
  ticket_id:       string;
  flujo_paso_id:   string;
  creador_id:      string;
  compleado_a?:    string;
  asignado_id?:    string;
  esta_completado: boolean;
  modificador_id?: string;
  esta_eliminado:  boolean;
  creado_a:        Date;
  actualizado_a:   Date;
}

export interface TicketResponse {
  _id:               number;
  asunto:           string;
  contenido:        string;
  estado_id:        ID;
  prioridad_id:     ID;
  creador_id:       CreadorIDClass;
  categoria_id:     ID;
  trabajo_flujo_id: ID;
  modificador_id:   CreadorIDClass;
  esta_eliminado:   boolean;
  creado_a:         Date;
  actualizado_a:    Date;
}

export interface ID {
  _id:            string;
  nombre:         string;
  color?:         string;
  grupo_id?:      string;
  creador_id:     CreadorIDEnum;
  modificador_id: null;
  esta_eliminado: boolean;
  creado_a:       Date;
  actualizado_a:  Date;
}

export enum CreadorIDEnum {
  The63E454Aa56A687743D28C890 = "63e454aa56a687743d28c890",
}

export interface CreadorIDClass {
  _id:              string;
  nombres:          string;
  apellidos:        string;
  email:            string;
  es_administrador: boolean;
  es_usuario:       boolean;
  esta_activo:      boolean;
  creado_a:         Date;
  foto_perfil:      string;
  actualizado_a:    Date;
}

export interface Ticket {
  _id:               number;
  asunto:           string;
  contenido:        string;
  estado:           string;
  prioridad:        string;
  creador:          string;
  categoria:        string;
  flujo:            string;
  modificador:      string;
  creado_a:         string;
  actualizado_a:    string;
  foto_perfil:      string;
  [key: string]: any;
}

export interface HistoryResponse {
  ticket_id: TicketResponse;
  flujo_paso_id: string;
  departamento_id: Department
  creador_id: CreadorIDClass;
  compleado_a: Date;
  asignado_id: CreadorIDClass;
  esta_completado: boolean;
  modificador_id: CreadorIDClass;
  esta_eliminado: boolean;
  creado_a: Date;
  actualizado_a: Date;
  message?: string;
  tiempoEstimadoResolucion?: number;
  tiempoResolucionHorasOficina?: string;
  tiempoRealResolucion?: number;
}

export interface HistoryTable {
  ticket_id: string;
  flujo_paso_id?: string;
  departamento_id: string
  creador_id: string;
  compleado_a: string;
  asignado_id: string;
  modificador_id: string;
  creado_a: string;
  actualizado_a: string;
  message?: string;
  tiempoEstimadoResolucion?: string;
  tiempoResolucionHorasOficina?: string;
  tiempoRealResolucion?: string;
}
export interface historyRequest {
  ticket_id: number,
  departamento_id: string,
  asignado_id: string
}