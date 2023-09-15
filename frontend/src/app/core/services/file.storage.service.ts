import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { JwtService } from './jwt.service';
import { ApiService } from './api.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import * as helper from '../helpers';
import { environment } from '../../../env/env';
import { FileMetadata, FileMetadataResponse } from '../interfaces/files.storage.interfaces';


@Injectable({
  providedIn: 'root'
})
export class FileStorageServices {
    
  constructor(
    private jwtService: JwtService,
    private postService: ApiService<any>,
    private getService: ApiService<any>,
    private http:HttpClient
    ) { }
  
  uploadFile(ticketId: Number, file: any):Observable<any> {
    const token = this.jwtService.getToken();
    let formData = new FormData(); 

    formData.append('file', file, file.name);
    formData.append('ticket',ticketId.toString());

    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
        'x-access-token': `${token}`
      });
    return this.postService.postForm('/archivos', formData, { headers })
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

  downloadProfileImg(attachmentId: String):Observable<any>{
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');

    const headers = new HttpHeaders({
      'x-access-token': `${token}`,
    });

    const responseType = {
      responseType: 'arraybuffer'
    }
    
    return this.getService.get(`/archivos/foto/${attachmentId}`, new HttpParams(), headers, responseType);
  }

  getListOfFiles(tickeId: Number): Observable<FileMetadataResponse[]> {
    const token = this.jwtService.getToken();
    if (helper.isNullOrWhitespace(token)) throw new Error('No token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': `${token}`,
    });

    return this.getService.getAll(`/archivos/lista/${tickeId}`,  new HttpParams(), headers);
  }

  materilizeFileReponse(response: any): FileMetadata[] {
    const files: FileMetadata[] = [];
    response.forEach((file: any) => {
        files.push({
        _id: file._id,
        ticket: file.ticket,
        gDriveFileId: file.gDriveFileId,
        fileNameAndExtension: file.fileNameAndExtension,
        creado_a: new Date(file.creado_a).toLocaleString(),
        fileContentType: file.fileContentType,
        actualizado_a: file.actualizado_a
      });
    });
    return files;
  }

  
}