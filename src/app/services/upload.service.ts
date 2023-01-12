import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Arquivo } from '../models/Arquivo';



@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private xml: string = "";
  
  //Por simplicidade, a URL foi definida no código, e não em arquivos de configuração
  private url: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  upload(arquivo: Arquivo): Promise<any> {
      const formData: FormData = new FormData();
      formData.append('arquivo', arquivo.xml);
      return this.http.post(`${this.url}/upload`, formData, {
        responseType: 'json'
      }).toPromise();
  }
}
