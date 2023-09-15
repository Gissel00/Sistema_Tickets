import { Injectable } from '@angular/core';
import  { 
  Department,
  DepartmentCreate,
  DepartmentDelete,
  DepartmentEdit,
  DepartmentResponse,
  MessageResponse
        } from '../interfaces/department.interface';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import * as helper from '../helpers';


@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  constructor(private jwtService: JwtService, 
    private apiService: ApiService<Department>,
    private postService: ApiService<MessageResponse>,
    private getService: ApiService<DepartmentResponse>
    ) { }

  getDepartments(): Observable<Department[]> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.apiService.getAll('/departamentos', new HttpParams(), headers);
  }

  obtenerDepartamento(): Observable<DepartmentResponse[]> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.getService.getAll('/departamentos',  new HttpParams(), headers);
  }

  createDepartment(request: DepartmentCreate): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.post('/departamentos', request, { headers });
  }

  editDepartment(request: DepartmentEdit): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.put(`/departamentos/${request._id}`, request, { headers });
  }

  deleteDepartment(id: string): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.delete(`/departamentos/eliminar/${id}`, { headers });
  }
  

  materializeResponseToDepartments(response: any): Department[] {
    const departments: Department[] = [];
    response.forEach((department: any) => {
      departments.push({
        _id: department._id,
        nombreDepartamento: department.nombreDepartamento,
        descripcion: department.descripcion,
        creador_id: department.creador_id,
        modificador_id: department.modificador_id,
        esta_eliminado: department.esta_eliminado,
        creado_a: department.creado_a,
        actualizado_a: department.actualizado_a
      });
    });
    return departments;
  }
}
