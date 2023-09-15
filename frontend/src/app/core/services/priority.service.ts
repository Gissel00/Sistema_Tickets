import { Injectable } from '@angular/core';
import { PriorityCreate, PriorityEdit, PriorityResponse, MessageResponse, Priority } from '../interfaces/priority.interface';
import { JwtService } from './jwt.service';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import * as helper from '../helpers';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {
  constructor(
    private jwtService: JwtService,
    private postService: ApiService<MessageResponse>,
    private getService: ApiService<PriorityResponse>
  ) {}

  createPriority(request: PriorityCreate): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.post('/prioridades', request, { headers });
  }

  getPriorities(): Observable<PriorityResponse[]> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.getService.getAll('/prioridades',  new HttpParams(), headers);
  }

  editPriority(request: PriorityEdit): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.put(`/prioridades/${request._id}`, request, { headers });
  }

  deletePriority(id: string): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.delete(`/prioridades/eliminar/${id}`, { headers });
  }

  materializePriorities(priorities: PriorityResponse[]): Priority[] {
    const priorityMaterialized: Priority[] = [];
    priorities.forEach((priority) => {
      priorityMaterialized.push({
        _id: priority._id,
        nombre: priority.nombre,
        color: priority.color,
        creador_id: priority.creador_id,
        modificador_id: priority.modificador_id,
        creado_a: new Date(priority.creado_a).toLocaleDateString('es-ES'),
        actualizado_a: new Date(priority.actualizado_a).toLocaleDateString('es-ES'),
      });
    }
    );
    return priorityMaterialized;
  }
}
