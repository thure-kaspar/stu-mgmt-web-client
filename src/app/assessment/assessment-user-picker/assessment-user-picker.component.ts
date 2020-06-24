import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { UserDto, UserWithAssignedEvaluatorDto, CoursesService } from "../../../../api";
import { Observable, Subscription, BehaviorSubject } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { Paginator } from "../../shared/paginator/paginator.component";
import { ActivatedRoute } from "@angular/router";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { AssessmentTargetFilter } from "../assessment-target-picker/assessment-target-picker.component";

@Component({
	selector: "app-assessment-user-picker",
	templateUrl: "./assessment-user-picker.component.html",
	styleUrls: ["./assessment-user-picker.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentUserPickerComponent implements OnInit, OnDestroy {

	@Input() filter$: Observable<AssessmentTargetFilter>;
	private filter: AssessmentTargetFilter;
	@Output() onUserSelected = new EventEmitter<UserDto>();

	assignedEvaluator$: Observable<UserDto>;
	courseId: string;
	assignmentId: string;
	selectedId: string;
	isLoading$ = new BehaviorSubject<boolean>(false);

	displayedColumns: string[] = ["action", "name", "assignedTo"];
	dataSource: MatTableDataSource<UserWithAssignedEvaluatorDto>;
	@ViewChild(Paginator, { static: true }) private paginator: Paginator;

	private users: UserWithAssignedEvaluatorDto[] = [];
	private filterSub: Subscription;

	constructor(private courseService: CoursesService,
				private route: ActivatedRoute,
				private snackbar: SnackbarService) { }

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.assignmentId = this.route.snapshot.params.assignmentId;

		this.filterSub = this.filter$.subscribe(
			filter => {
				// Reload users, if filter changes
				this.filter = filter;
				this.loadUsers();
			}
		);
	}

	loadUsers(): void {
		const skip = this.paginator.currentPage;
		const take = this.paginator.pageSize;

		this.isLoading$.next(true);
		this.courseService.getUsersWithAssignedEvaluator(
			this.courseId, 
			this.assignmentId,
			skip,
			take,
			this.filter?.assignedEvaluatorId,
			this.filter?.excludeAlreadyReviewed,
			this.filter?.nameOfGroupOrUser,
			"response",
		).subscribe(
			response => {
				this.users = response.body;
				this.dataSource = new MatTableDataSource(this.users);
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

	selectUser(user: UserDto): void {
		this.selectedId = user.id;
		this.onUserSelected.emit(user);
	}

	ngOnDestroy(): void {
		this.filterSub.unsubscribe();
	}

}
