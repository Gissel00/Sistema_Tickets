import { Injectable } from '@angular/core';
import { historyRequest, HistoryResponse, HistoryTable, Ticket } from '../interfaces/ticket.interface';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import * as helper from '../helpers';
import { MessageResponse } from '../interfaces/status.interface';
import { Flujo } from '../interfaces/flujo.interface';
import { ReportRequest, ReportResponse } from '../interfaces/report.interface';

@Injectable({
  providedIn: 'root',
})
export class HistoryTicketsService {
  constructor(
    private jwtService: JwtService,
    private apiService: ApiService<HistoryResponse>,
    private postService: ApiService<MessageResponse>,
    private getReportService: ApiService<ReportResponse>
  ) {}

  getHistoryByTicket(ticket: number): Observable<HistoryResponse[]> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.apiService.getAll(
      `/historico/${ticket}`,
      new HttpParams(),
      headers
    );
  }

  crearNuevaActividad(request: Object = {}): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.post(`/historico`, request, { headers });
  }

  reasignTicketToUser(request: historyRequest): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.put(
      `/historico/reasignar/${request.ticket_id}`,
      request,
      { headers }
    );
  }

  completeTicketActivity(id: number): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.put(`/historico/completar/${id}`, {}, { headers });
  }

  assignTimeResolution(
    response: HistoryResponse[],
    flujos: Flujo[],
    ticket: Ticket
  ): HistoryTable[] {
    let historyList: HistoryTable[] = [];
    const ticketFlujo = flujos.find((flujo) => flujo.nombre === ticket.flujo);

    response.forEach((element) => {
      const history: HistoryTable = {
        ticket_id: element.ticket_id._id.toString(),
        departamento_id: element.departamento_id.nombreDepartamento,
        creador_id: element.creador_id.email,
        compleado_a:
          element.compleado_a != undefined
            ? new Date(element.compleado_a).toLocaleString('es-ES')
            : '',
        asignado_id:
          element.asignado_id != undefined ? element.asignado_id.email : '',
        modificador_id:
          element.modificador_id != undefined
            ? element.modificador_id.email
            : '',
        creado_a: new Date(element.creado_a).toLocaleString('es-ES'),
        actualizado_a: new Date(element.actualizado_a).toLocaleString('es-ES'),
        tiempoEstimadoResolucion:
          (ticketFlujo?.tiempo_resolucion || 0).toString() + ' horas',
        tiempoRealResolucion:
          element.compleado_a != undefined
            ? helper.getDiffInHours(element.creado_a, element.compleado_a) +
              ' horas'
            :  '0.00 horas',
        tiempoResolucionHorasOficina: element.tiempoResolucionHorasOficina != undefined ? element.tiempoResolucionHorasOficina : ''
      };
      historyList.push(history);
    });
    return historyList;
  }

  getReportTickets(request: ReportRequest): Observable<ReportResponse[]> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });
    const params = new HttpParams()
      .set('fechaInicio', request.dateStart.toISOString())
      .set('fechaFin', request.dateEnd.toISOString());

    return this.getReportService.getAll(
      `/historico-reporte`,
      params,
      headers
    );
  }

  getReportTicketsByDepto(request: ReportRequest): Observable<ReportResponse[]> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });
    const params = new HttpParams()
      .set('fechaInicio', request.dateStart.toISOString())
      .set('fechaFin', request.dateEnd.toISOString());

    return this.getReportService.getAll(
      `/historico-reporte-departamentos`,
      params,
      headers
    );
  }  
}
