import { Component, OnInit } from '@angular/core';
import { IEmployeeResponse } from '../models/employee';
import { EmployeeService } from '../services/employee/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  public employeeResponse: IEmployeeResponse = null;
  constructor(private employeeSvc: EmployeeService) { }

  ngOnInit(): void {
    this.employeeSvc.getAllEmployees(1).subscribe((response: IEmployeeResponse) => {
      this.employeeResponse = response;
      console.log(response);
    });
  }
}
