import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { CoursesService, UserDto } from "../../../../../api/typescript-angular-client-generated";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
	selector: "app-user-list",
	templateUrl: "./user-list.component.html",
	styleUrls: ["./user-list.component.scss"]
})
export class UserListComponent implements OnInit {

	@Input() courseId: string;
	users: UserDto[];
	displayedColumns: string[] = ["role", "name"];
	dataSource: MatTableDataSource<UserDto>;
	userFilter: string;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private courseService: CoursesService) { }

	ngOnInit(): void {
		this.courseService.getUsersOfCourse(this.courseId).subscribe(
			result => {
				this.users = result,
				this.dataSource = new MatTableDataSource(this.users);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			error => console.log(error)
		);
	}

	applyFilter(): void {
		this.dataSource.filter = this.userFilter.trim().toLowerCase();
	
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

}
