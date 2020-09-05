import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { CourseParticipantsService, ParticipantDto, ParticipantsWithAssignedEvaluatorDto, UserDto } from "../../../../api";
import { Paginator } from "../../shared/paginator/paginator.component";
import { ToastService } from "../../shared/services/toast.service";
import { AssessmentTargetFilter } from "../assessment-target-picker/assessment-target-picker.component";

@Component({
	selector: "app-assessment-user-picker",
	templateUrl: "./assessment-user-picker.component.html",
	styleUrls: ["./assessment-user-picker.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentUserPickerComponent implements OnInit, OnDestroy {

	@Input() selectedId: string;

	@Input() filter$: Observable<AssessmentTargetFilter>;
	private filter: AssessmentTargetFilter;
	/** Emits the selected user. */
	@Output() onUserSelected = new EventEmitter<ParticipantDto>();
	/** Emits the ```assessmentId``` of the assessment that should be switched to for editing. */
	@Output() onSwitchToEdit = new EventEmitter<string>();

	assignedEvaluator$: Observable<UserDto>;
	courseId: string;
	assignmentId: string;
	isLoading$ = new BehaviorSubject<boolean>(false);

	displayedColumns: string[] = ["action", "name", "assignedTo"];
	dataSource$ = new BehaviorSubject(new MatTableDataSource<ParticipantsWithAssignedEvaluatorDto>([]));
	@ViewChild(Paginator, { static: true }) private paginator: Paginator;

	private filterSub: Subscription;

	constructor(
		private courseParticipantsService: CourseParticipantsService,
		private route: ActivatedRoute,
		private toast: ToastService
	) { }

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.assignmentId = this.route.snapshot.params.assignmentId;

		this.filterSub = this.filter$.subscribe(
			filter => {
				if (filter) {
					// Reload users, if filter changes
					this.filter = filter;
					this.loadParticipants();
				}
			}
		);
	}

	loadParticipants(): void {
		const [skip, take] = this.paginator.getSkipAndTake();

		this.isLoading$.next(true);
		this.courseParticipantsService.getParticipantsWithAssignedEvaluator(
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
				this.dataSource$.next(new MatTableDataSource(response.body));
				this.paginator.setTotalCountFromHttp(response);
				this.isLoading$.next(false);
			},
			error => {
				this.toast.apiError(error);
				this.isLoading$.next(false);
			}
		);
	}

	selectedParticipant(participant: ParticipantDto): void {
		this.selectedId = participant.userId;
		this.onUserSelected.emit(participant);
	}

	ngOnDestroy(): void {
		this.filterSub.unsubscribe();
	}

}
