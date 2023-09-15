import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {
  CommentCreate,
  CommentPushing,
  CommentResponse,
} from '../interfaces/comment.interface';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import * as helper from '../helpers';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(
    private jwtService: JwtService,
    private apiService: ApiService<CommentResponse>,
    private apiServicePushing: ApiService<CommentPushing>,
    private http:HttpClient
  ) {}

  getCommentsByTicketId(id: string): Observable<CommentResponse[]> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.apiService.getAll(
      `/comentarios/${id}`,
      new HttpParams(),
      headers
    );
  }

  createComment(comment: CommentCreate): Observable<CommentPushing> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.apiServicePushing.post('/comentarios', comment, {headers});
  }

  downloadFile(attachmentId: String):Observable<any>{
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');

    const headers = new HttpHeaders({
      'x-access-token': `${token}`,
    });

    return this.http.get(`http://localhost:3000/api/v1/archivos/${attachmentId}`, { 
      headers , responseType: 'arraybuffer'
    });
  }

}
