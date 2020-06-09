import { Component, OnInit, ViewChild } from "@angular/core";
import { GroupsService, GroupDto, AssessmentDto, UserDto } from "../../../../../api";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../auth/services/auth.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { DialogService } from "../../../shared/services/dialog.service";

@Component({
	selector: "app-group-detail",
	templateUrl: "./group-detail.component.html",
	styleUrls: ["./group-detail.component.scss"]
})
export class GroupDetailComponent implements OnInit {

	group: GroupDto;

	courseId: string;
	groupId: string;

	assessments: AssessmentDto[];
	displayedColumns: string[] = ["name", "type", "score", "action"];
	dataSource: MatTableDataSource<AssessmentDto>;

	@ViewChild(MatSort) sort: MatSort;
	
	constructor(private groupService: GroupsService,
				private authService: AuthService,
				private route: ActivatedRoute,
				private dialogService: DialogService,
				private snackbar: SnackbarService) { }

	ngOnInit(): void {
		this.courseId = this.route.parent.parent.snapshot.paramMap.get("courseId");
		this.groupId = this.route.snapshot.paramMap.get("groupId");
		this.loadGroup();
	}

	loadGroup(): void {
		this.groupService.getGroup(this.courseId, this.groupId).subscribe(
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

	/** Removes the selected member from the group, if user confirms the action. */
	onRemoveUser(user: UserDto): void {
		this.dialogService.openConfirmDialog({ 
			title: "Action.Custom.RemoveUserFromGroup",
			params: [user.username], 
		}).subscribe(
			confirmed => {
				if (confirmed) {
					this.groupService.removeUserFromGroup(this.courseId, this.group.id, user.id).subscribe(
						success => {
							this.snackbar.openSuccessMessage();
							this.loadGroup();
						},
						error => {
							console.log(error);
							this.snackbar.openErrorMessage();
						}
					);
				}
			}
		);
	}

}
