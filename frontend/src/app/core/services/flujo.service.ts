import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flujo, FlujoCreate, FlujoEdit, FlujoResponse, MessageResponse } from '../interfaces/flujo.interface';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import * as helper from '../helpers';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlujoService {

  constructor(private jwtService: JwtService, private getService: ApiService<FlujoResponse>, private postService: ApiService<MessageResponse>) { }

  createFlujo(request: FlujoCreate): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.post('/flujos', request, { headers });
  }

  getFlujos(): Observable<FlujoResponse[]> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.getService.getAll('/flujos',  new HttpParams(), headers);
  }

  editFlujo(request: FlujoEdit): Observable<FlujoResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.getService.put(`/flujos/${request._id}`, request, { headers });
  }

  deleteFlujo(id: string): Observable<FlujoResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.getService.delete(`/flujos/eliminar/${id}`, { headers });
  }

  materializeFlujos(flujos: FlujoResponse[]): Flujo[] {
    const flujosMaterialized: Flujo[] = [];
    flujos.forEach((flujo) => {
      flujosMaterialized.push({
        _id: flujo._id,
        nombre: flujo.nombre,
        tiempo_resolucion: flujo.tiempo_resolucion,
        departamento: flujo.departamento.nombreDepartamento,
        modificador_id: flujo.modificador_id,
        creado_a: helper.formatDate(flujo.creado_a),
        actualizado_a: helper.formatDate(flujo.actualizado_a),
      });
    }
    );
    return flujosMaterialized;
  }
}
