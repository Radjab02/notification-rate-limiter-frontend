// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ClientLimit {
  clientId: string;
  monthlyLimit: number;
  windowCapacity: number;
  windowDurationSeconds: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  getLimits(): Observable<ClientLimit[]> {
    return this.http.get<ClientLimit[]>(`${this.baseUrl}/admin/limits`);
  }

  createLimit(limit: ClientLimit): Observable<ClientLimit> {
    return this.http.post<ClientLimit>(`${this.baseUrl}/admin/limits`, limit);
  }

  deleteLimit(clientId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/limits/${clientId}`);
  }

  getLimit(clientId: string): Observable<ClientLimit> {
    return this.http.get<ClientLimit>(`${this.baseUrl}/admin/limits/${clientId}`);
  }


  sendNotification(clientId: string): Observable<{ message: string; remaining: number }> {
  return this.http.get(`${this.baseUrl}/api/notifications/send`, {
    headers: { 'X-Client-ID': clientId },
    observe: 'response', // full HttpResponse
    responseType: 'text' // make sure body is text
  }).pipe(
    map((res: HttpResponse<string>) => {

      
      console.log("=== RAW HTTP RESPONSE ===");
      console.log(res);

      console.log("=== RESPONSE HEADERS (Angular) ===");
      console.log(res.headers);

      console.log("All header keys:", res.headers.keys());

      console.log(
        "X-Rate-Limit-Remaining:",
        res.headers.get('X-Rate-Limit-Remaining')
      );

      const remainingHeader = res.headers.get('X-Rate-Limit-Remaining');
      const remaining = remainingHeader !== null ? parseInt(remainingHeader, 10) : 0;
      return {
        message: res.body || 'No message',
        remaining
      };
    })
  );
}
}
