import { Component, OnInit, ViewChild } from "@angular/core";
import { GroupsService, GroupDto, AssessmentDto, UserDto } from "../../../../../api";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../auth/services/auth.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

@Component({
	selector: "app-group-detail",
	templateUrl: "./group-detail.component.html",
	styleUrls: ["./group-detail.component.scss"]
})
export class GroupDetailComponent implements OnInit {

	group: GroupDto;

	assessments: AssessmentDto[];
	displayedColumns: string[] = ["name", "type", "score", "action"];
	dataSource: MatTableDataSource<AssessmentDto>;

	@ViewChild(MatSort) sort: MatSort;
	
	constructor(private groupService: GroupsService,
				private authService: AuthService,
				private route: ActivatedRoute) { }

	ngOnInit(): void {
		const groupId = this.route.snapshot.paramMap.get("groupId");
		this.groupService.getGroup("java-wise1920", groupId).subscribe(
			result => { 
				this.group = result;
				this.assessments = this.group.assessments;
				this.dataSource = new MatTableDataSource(this.assessments);
				this.dataSource.sort = this.sort;
			},
			error => console.log(error)
		);
	}

	/** TODO */
	onPromoteToLeader(user: UserDto): void {

	}

	/** TODO */
	onRemoveUser(user: UserDto): void {

	}

}
