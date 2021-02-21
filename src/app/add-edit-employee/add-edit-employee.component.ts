import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IEmployee } from '../models/employee';
import { EmployeeService } from '../services/employee/employee.service';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss']
})
export class AddEditEmployeeComponent implements OnInit, OnDestroy {
  public employeeForm: FormGroup;
  public formSubmitted = false;
  public employeeId: number;
  public message = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private employeeSvc: EmployeeService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => {
      this.employeeId = data.id;

      if (this.employeeId && !this.employeeSvc.employeeListDetails) {
        this.router.navigate(['/employees']);
      } else {
        this.createForm();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    }
  }

  private createForm() {
    if (this.employeeId) {
      const employee = this.employeeSvc.employeeListDetails.data.find(e => e.id == this.employeeId);

      this.employeeForm = this.fb.group({
        firstName: [employee.first_name, Validators.required],
        lastName: [employee.last_name, Validators.required],
        emailId: [employee.email, Validators.required],
        photo: [employee.avatar, Validators.required]
      });
    } else {
      this.employeeForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        emailId: ['', Validators.required],
        photo: ['', Validators.required]
      });
    }
  }

  public get formControls() {
    return this.employeeForm ? this.employeeForm.controls : null;
  }

  public addOrUpdateEmployee() {
    this.formSubmitted = true;

    if (!this.employeeForm.valid) {
      return;
    } else {
      this.formSubmitted = false;
      this.employeeForm.disable();

      const employeeObj: IEmployee = {
        first_name: this.employeeForm.get('firstName').value,
        last_name: this.employeeForm.get('lastName').value,
        email: this.employeeForm.get('emailId').value,
        avatar: this.employeeForm.get('photo').value
      };

      // Add new employee
      if (!this.employeeId) {
        this.message = 'Adding employee';

        this.subscriptions.push(
          this.employeeSvc.addEmployee(employeeObj)
            .subscribe((employee: IEmployee) => {
              this.message = '';

              employee.id = employee.id;
              this.employeeSvc.employeeListDetails.data.unshift(employee);
              this.employeeSvc.employeeListDetails.total += 1;

              this.employeeForm.reset();
              this.router.navigate(['/employees']);
            }, () => {
              this.employeeForm.enable();
            }));
      } else {
        // Update new employee
        this.message = 'Updating employee';

        this.subscriptions.push(
          this.employeeSvc.updateEmployee(employeeObj)
            .subscribe((employee: IEmployee) => {
              this.message = '';

              const empIndex = this.employeeSvc.employeeListDetails.data.findIndex(e => e.id == this.employeeId);
              employeeObj.id = empIndex;
              this.employeeSvc.employeeListDetails.data[empIndex] = employeeObj;

              this.employeeForm.reset();
              this.router.navigate(['/employees']);
            }, () => {
              this.employeeForm.enable();
            }));
      }
    }
  }

  public deleteEmployee() {
    if (this.employeeId > 0) {
      this.message = 'Deleting employee';
      this.employeeForm.disable();

      this.subscriptions.push(this.employeeSvc.deleteEmployee(this.employeeId).subscribe(() => {
        this.message = '';

        const empIndex = this.employeeSvc.employeeListDetails.data.findIndex(e => e.id == this.employeeId);
        this.employeeSvc.employeeListDetails.data.splice(empIndex, 1);
        this.employeeSvc.employeeListDetails.total -= 1;

        this.router.navigate(['/employees']);
      }, () => {
        this.employeeForm.enable();
      }));
    }
  }
}
