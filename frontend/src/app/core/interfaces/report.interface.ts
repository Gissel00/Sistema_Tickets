export interface ReportRequest {
  dateStart: Date;
  dateEnd: Date;
}

export interface ReportResponse {
  ticketId: number;
  email_creador: string;
  asignado?: string;
  fechaCreacion: string;
  fechaCompletado: string;
  email_asignado?: string;
  nombreDepartamento?: string;
  tiempoEstimadoResolucion?: string;
  tiempoRealResolucion?: string;
  tiempoResolucionHorasOficina?: string;
  percentageSLA?: string;
}
