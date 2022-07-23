import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../model/product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  searchProduct(filter: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiProductURL}/products/search`, { params: filter });
  }

  getProduct(code: string): Observable<any> {
    return this.http.get<any>(`${environment.apiProductURL}/products/${code}`);
  }

  getProductService(code: string): Observable<any> {
    return this.http.get<any>(`${environment.apiProductURL}/products/service/${code}`);
  }
}
