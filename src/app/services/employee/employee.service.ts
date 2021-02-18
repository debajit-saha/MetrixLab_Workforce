import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEmployee, IEmployeeResponse } from 'src/app/models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly baseUrl = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) { }

  public getAllEmployees(page: number): Observable<IEmployeeResponse> {
    return this.http.get<IEmployeeResponse>(`${this.baseUrl}?page=${page}`);
  }
}
