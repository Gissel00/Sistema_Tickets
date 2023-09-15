import { Injectable } from '@angular/core';
import { HorarioCreate, HorarioEdit, HorarioResponse, MessageResponse } from '../interfaces/horario.interface';
import { JwtService } from './jwt.service';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import * as helper from '../helpers';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  constructor(
    private jwtService: JwtService,
    private postService: ApiService<MessageResponse>,
    private getService: ApiService<HorarioResponse>
  ) {}

  createHorario(request: HorarioCreate): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.post('/horarios', request, { headers });
  }

  getHorarios(): Observable<HorarioResponse[]> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.getService.getAll('/horarios',  new HttpParams(), headers);
  }

  editHorario(request: HorarioEdit): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.put(`/horarios/${request._id}`, request, { headers });
  }

  deleteHorario(id: string): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.delete(`/horarios/eliminar/${id}`, { headers });
  }
}
