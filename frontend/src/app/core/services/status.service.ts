import { Injectable } from '@angular/core';
import { StatusCreate, StatusEdit, StatusResponse, MessageResponse, Status } from '../interfaces/status.interface';
import { JwtService } from './jwt.service';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import * as helper from '../helpers';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  constructor(
    private jwtService: JwtService,
    private postService: ApiService<MessageResponse>,
    private getService: ApiService<StatusResponse>
  ) {}

  createStatus(request: StatusCreate): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.post('/estados', request, { headers });
  }

  getStatuses(): Observable<StatusResponse[]> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.getService.getAll('/estados',  new HttpParams(), headers);
  }

  editStatus(request: StatusEdit): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.put(`/estados/${request._id}`, request, { headers });
  }

  deleteStatus(id: string): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.delete(`/estados/eliminar/${id}`, { headers });
  }

  materializeStatus(statuses: StatusResponse[]): Status[] {
    const statusMaterialized: Status[] = [];
    statuses.forEach((status) => {
      statusMaterialized.push({
        _id: status._id,
        nombre: status.nombre,
        color: status.color,
        creador_id: status.creador_id,
        modificador_id: status.modificador_id,
        esta_eliminado: status.esta_eliminado,
        creado_a: new Date(status.creado_a).toLocaleDateString('es-ES'),
        actualizado_a: new Date(status.actualizado_a).toLocaleDateString('es-ES'),
      });
    }
    );
    return statusMaterialized;
  }
}
