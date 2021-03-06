import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../Admin.service';
import { Input } from '@angular/core';
import { staff } from '../../Model/staff';

@Component({
	selector: 'app-edit-staff',
	templateUrl: './edit-staff.component.html',
	styleUrls: ['./edit-staff.component.css']
})
export class EditStaffComponent implements OnInit {
	EditForm: FormGroup;
	submitted = false;
	conFirm: boolean;
	user =new staff;
	depts = [];
	date:string;
	month:number; day:number; year:number;
	dd: string ; MM:string ; yyyy:string;
	@Input() idstaff;
	constructor(
		private service: AdminService,
		private FormBuilder: FormBuilder
	) { }

	ngOnInit() {
		this.EditForm = this.FormBuilder.group({
			full_name: ['', Validators.required],
			gender: ['', Validators.required],
			address: ['', Validators.required],
			email: ['', Validators.required],
			birthday: ['', Validators.required],
			grade: ['', Validators.required],
			id_department: ['', Validators.required],
		})
		this.service.listDept().subscribe(
			data => {
				this.depts = data;
			}
		)
		this.service.getStaff(this.idstaff).subscribe(
			data => {
				this.user = data[0];
				this.user.birthday = new Date(data[0].birthday);
				this.day = this.user.birthday.getDate();
				this.month = this.user.birthday.getMonth()+1;
				this.year = this.user.birthday.getFullYear();
				if(this.day <= 9){
					this.dd = '0'+ this.day.toString();
				}
				if(this.day >9){
					this.dd = this.day.toString();
				}
				if(this.month <=9){
					this.MM = '0'+this.month.toString();
				}
				if(this.month >9){
					this.MM = this.month.toString();
				}
				this.yyyy = this.year.toString();
				this.date = this.yyyy +'-'+this.MM+'-'+this.dd;
				this.EditForm = this.FormBuilder.group({
					full_name: [this.user.full_name, Validators.required],
					gender: [this.user.gender, Validators.required],
					address: [this.user.address, Validators.required],
					email: [this.user.email, Validators.required],
					birthday: [this.date, Validators.required],
					grade: [this.user.grade, Validators.required],
					id_department: [this.user.id_department, Validators.required],
				})
			}
		)
	}
	get f() {
		return this.EditForm.controls;
	}
	onSubmit() {
		this.submitted = true;
		if (this.EditForm.invalid) {
			return;
		}
		console.log(this.EditForm.value.full_name);

		if (this.EditForm.value.grade == "Manager") {
			console.log("manager");
			this.service.findManager(this.EditForm.value.id_department).subscribe(
				data => {
					if (data) {
						console.log(data);
						this.service.updateManager(data.id).subscribe(
							data => {
								if (data && data.msg == 'successfully') {
									this.conFirm = confirm("Bộ phận này đã có quản lí. Bạn có muốn tiếp tục? ");
									if (this.conFirm) {
										this.service.editStaff(this.idstaff, this.EditForm.value).subscribe(data => {
											console.log("OK");
											location.reload();

										});

										console.log(this.EditForm.value);
										this.submitted = false;
										location.reload();
									}
								}
							}
						)
					}
					else {
						this.service.editStaff(this.idstaff, this.EditForm.value).subscribe(data => {
							console.log("ok");

						});
						this.submitted = false;

						location.reload();

					}
				},
			)
			this.submitted = false;
		} else {
			this.service.editStaff(this.idstaff, this.EditForm.value).subscribe(data => {
				console.log("OK");

			});
			console.log(this.EditForm.value);
			this.submitted = false;
			location.reload();
		}
	}
}

