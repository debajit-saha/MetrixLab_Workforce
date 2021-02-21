import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEmployee, IEmployeeListDetails } from 'src/app/models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  public employeeListDetails: IEmployeeListDetails = null;
  private readonly baseUrl = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) { }

  public getAllEmployees(page: number): Observable<IEmployeeListDetails> {
    return this.http.get<IEmployeeListDetails>(`${this.baseUrl}?page=${page}`);
  }

  public addEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.http.post<IEmployee>(this.baseUrl, employee);
  }

  public updateEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.http.put<IEmployee>(this.baseUrl, employee);
  }

  public deleteEmployee(employeeId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${employeeId}`);
  }
}
