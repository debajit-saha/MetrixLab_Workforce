import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IEmployeeListDetails } from '../models/employee';
import { EmployeeService } from '../services/employee/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  public employeeListDetails: IEmployeeListDetails;
  private subscription: Subscription;
  public currentPage = 1;

  constructor(
    private employeeSvc: EmployeeService,
    private router: Router) { }

  ngOnInit(): void {
    this.getEmployeeListDetails();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private getEmployeeListDetails(pageChanged = false) {
    if (!this.employeeSvc.employeeListDetails || pageChanged) {
      this.subscription = this.employeeSvc.getAllEmployees(this.currentPage).subscribe((response: IEmployeeListDetails) => {
        this.employeeListDetails = response;
        this.employeeSvc.employeeListDetails = response;
      });
    } else {
      this.employeeListDetails = this.employeeSvc.employeeListDetails;
    }
  }

  public employeeSelected(id: number) {
    this.router.navigate(['/edit-employee', id]);
  }

  public previousPage() {
    this.currentPage -= 1;
    this.getEmployeeListDetails(true);
  }

  public nextPage() {
    this.currentPage += 1;
    this.getEmployeeListDetails(true);
  }
}
