import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateTicket,
  Ticket,
  TicketPostResponse,
  TicketResponse,
  UpdateTicketStatus
} from '../interfaces/ticket.interface';
import { ApiService, JwtService } from './';
import * as helper from '../helpers';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(
    private jwtService: JwtService,
    private postService: ApiService<TicketPostResponse>,
    private getService: ApiService<TicketResponse>
  ) {
  }

  
  createTicket(request: CreateTicket): Observable<TicketPostResponse> {
    
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.post('/tickets', request, { headers });
  }

  updateTicket(id: number, request: UpdateTicketStatus): Observable<TicketPostResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.put(`/tickets/${id}`, request, { headers });
  }

  getTickets(): Observable<TicketResponse[]> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.getService.getAll('/tickets',  new HttpParams(), headers);
  }

  getTicketById(id: string): Observable<TicketResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.getService.get(`/tickets/${id}`, new HttpParams(), headers);
  }

  materializeResponseToTicket(response:TicketResponse[]){
    const tickets: Ticket[] = [];
    response.forEach((ticketResponse: TicketResponse) => {
      const ticket: Ticket = {
        _id: ticketResponse._id,
        asunto: ticketResponse.asunto,
        contenido: ticketResponse.contenido,
        estado: ticketResponse.estado_id.nombre,
        prioridad: ticketResponse.prioridad_id.nombre,
        creador: ticketResponse.creador_id.nombres.split(" ", 1) + ' ' + ticketResponse.creador_id.apellidos.split(" ",1),
        categoria: ticketResponse.categoria_id.nombre,
        flujo: ticketResponse.trabajo_flujo_id.nombre,
        modificador: ticketResponse.modificador_id?.email ?? '',
        creado_a: new Date(ticketResponse.creado_a).toLocaleDateString('es-ES'),
        actualizado_a: new Date(ticketResponse.actualizado_a).toLocaleDateString('es-ES'),
        foto_perfil: ticketResponse.creador_id.foto_perfil
      };
      tickets.push(ticket);
    });
    return tickets;
  }

  materializeResponseToTicketById(response:TicketResponse){
    const ticket: Ticket = {
      _id: response._id,
      asunto: response.asunto,
      contenido: response.contenido,
      estado: response.estado_id.nombre,
      prioridad: response.prioridad_id.nombre,
      creador: response.creador_id.nombres.split(" ",1) + ' ' + response.creador_id.apellidos.split(" ",1),
      categoria: response.categoria_id.nombre,
      flujo: response.trabajo_flujo_id.nombre,
      modificador: response.modificador_id?.email ?? '',
      creado_a: new Date(response.creado_a).toLocaleDateString('es-ES'),
      actualizado_a: new Date(response.actualizado_a).toLocaleDateString('es-ES'),
      foto_perfil: response.creador_id.foto_perfil
    };
    return ticket;
  }
}
