import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesResponse, Category, CategoryCreate, CategoryEdit } from '../interfaces/categories.interface';
import { MessageResponse } from '../interfaces/status.interface';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import * as helper from '../helpers';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(
    private jwtService: JwtService,
    private postService: ApiService<MessageResponse>,
    private getService: ApiService<CategoriesResponse>
  ) {}

  createCategory(request: CategoryCreate): Observable<MessageResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.postService.post('/categorias', request, { headers });
  }

  getCategories(): Observable<CategoriesResponse[]> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.getService.getAll('/categorias',  new HttpParams(), headers);
  }

  editCategory(request: CategoryEdit): Observable<CategoriesResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.getService.put(`/categorias/${request._id}`, request, { headers });
  }

  deleteCategory(id: string): Observable<CategoriesResponse> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.getService.delete(`/categorias/eliminar/${id}`, { headers });
  }

  materializeCategories(categories: CategoriesResponse[]): Category[] {
    const categoryMaterialized: Category[] = [];
    categories.forEach((category) => {
      categoryMaterialized.push({
        _id: category._id,
        nombre: category.nombre,
        color: category.color,
        grupo_id: category.grupo_id,
        creador_id: category.creador_id,
        modificador_id: category.modificador_id,
        creado_a: new Date(category.creado_a).toLocaleDateString('es-ES'),
        actualizado_a: new Date(category.actualizado_a).toLocaleDateString(
          'es-ES'
        ),
      });
    });
    return categoryMaterialized;
  }
}
