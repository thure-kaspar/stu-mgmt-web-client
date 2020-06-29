import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { GroupsService, GroupDto, GroupWithAssignedEvaluatorDto } from "../../../../api";
import { Observable, Subscription, BehaviorSubject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Paginator } from "../../shared/paginator/paginator.component";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { MatTableDataSource } from "@angular/material/table";
import { AssessmentTargetFilter } from "../assessment-target-picker/assessment-target-picker.component";

@Component({
	selector: "app-assessment-group-picker",
	templateUrl: "./assessment-group-picker.component.html",
	styleUrls: ["./assessment-group-picker.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentGroupPickerComponent implements OnInit, OnDestroy {

	@Input() filter$: Observable<AssessmentTargetFilter>;
	private filter: AssessmentTargetFilter;

	/** Emits the group that was selected by the user. */
	@Output() onGroupSelected = new EventEmitter<GroupDto>();
	/** Emits the ```assessmentId``` of the assessment that should be switched to for editing. */
	@Output() onSwitchToEdit = new EventEmitter<string>();
	
	selectedId: string;
	courseId: string;
	assignmentId: string;
	isLoading$ = new BehaviorSubject<boolean>(false);

	private groups: GroupWithAssignedEvaluatorDto[];
	private filterSub: Subscription;

	displayedColumns: string[] = ["action", "name", "assignedTo"];
	dataSource: MatTableDataSource<GroupWithAssignedEvaluatorDto>;
	@ViewChild(Paginator, { static: true }) private paginator: Paginator;
	
	constructor(private groupService: GroupsService,
				private route: ActivatedRoute,
				private snackbar: SnackbarService) { }

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.assignmentId = this.route.snapshot.params.assignmentId;

		this.filterSub = this.filter$.subscribe(
			filter => {
				// Reload groups, if filter changes
				this.filter = filter;
				this.loadGroups();
			}
		);
	}

	/** Loads the group for this assignment. Considers the current filter settings. */
	loadGroups(): void {
		const skip = this.paginator.currentPage;
		const take = this.paginator.pageSize;

		this.isLoading$.next(true);
		this.groupService.getGroupsWithAssignedEvaluator(
			this.courseId, 
			this.assignmentId,
			skip,
			take,
			this.filter?.assignedEvaluatorId,
			this.filter?.excludeAlreadyReviewed,
			this.filter?.nameOfGroupOrUser,
			"response"
		).subscribe(
			response => {
				this.groups = response.body;
				this.dataSource = new MatTableDataSource(this.groups);
				this.paginator.setTotalCountFromHttp(response);
				this.isLoading$.next(false);
			},
			error => {
				console.log(error);
				this.snackbar.openErrorMessage();
				this.isLoading$.next(false);
			}
		);
	}

	selectGroup(group: GroupDto): void {
		this.selectedId = group.id;
		this.onGroupSelected.emit(group);
	}

	ngOnDestroy(): void {
		this.filterSub.unsubscribe();
	}

}
