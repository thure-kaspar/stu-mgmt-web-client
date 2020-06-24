import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { AssignmentsService, GroupDto, CoursesService, UserDto } from "../../../../api";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { EvaluatorsFacade } from "../services/evaluators.facade";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

export class AssessmentTargetFilter {
	assignedEvaluatorId?: string;
	excludeAlreadyReviewed = true;
	nameOfGroupOrUser?: string;
}

@Component({
	selector: "app-assessment-target-picker",
	templateUrl: "./assessment-target-picker.component.html",
	styleUrls: ["./assessment-target-picker.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentTargetPickerComponent implements OnInit, OnDestroy {

	@Input() courseId: string;
	@Input() assignmentId: string;

	@Output() onGroupSelected = new EventEmitter<GroupDto>();
	@Output() onUserSelected = new EventEmitter<UserDto>();

	evaluators: UserDto[];

	filter: AssessmentTargetFilter = new AssessmentTargetFilter();
	private filterSubject = new BehaviorSubject<AssessmentTargetFilter>(this.filter);
	filter$ = this.filterSubject.asObservable();

	private groupnameFilterChangedSubject = new Subject<void>();
	private groupnameFilterSubscription: Subscription;

	constructor(private assigmentService: AssignmentsService,
				private courseService: CoursesService,
				private evaluatorsFacade: EvaluatorsFacade,
				private snackbar: SnackbarService) { }

	ngOnInit(): void {
		this.courseService.getUsersOfCourse(
			this.courseId,
			undefined,
			undefined, 
			[UserDto.CourseRoleEnum.LECTURER, UserDto.CourseRoleEnum.TUTOR]
		).subscribe(
			result => {
				this.evaluatorsFacade.setEvaluators(result);
				this.evaluators = result;
			},
			error => {
				console.log(error);
				this.snackbar.openErrorMessage();
			}
		);


		this.groupnameFilterSubscription = this.groupnameFilterChangedSubject
			.pipe(debounceTime(500)).subscribe(() => 
				this._updateGroupnameFilter()
			);
	}

	/** Updates the filter and informs subscribers about the change. */
	updateEvaluatorFilter(evaluator: UserDto | undefined): void {
		this.filterSubject.next({...this.filter, assignedEvaluatorId: evaluator.id });
	}

	updateExcludeAlreadyReviewedFilter(excludeAlreadyReviewed: boolean): void {
		this.filterSubject.next({...this.filter, excludeAlreadyReviewed: excludeAlreadyReviewed });
	}

	updateGroupnameFilter(): void {
		this.groupnameFilterChangedSubject.next();
	}

	private _updateGroupnameFilter(): void {
		this.filterSubject.next({...this.filter }); // Groupname property is bound to input field
	}

	ngOnDestroy(): void {
		this.filterSubject.complete();
		this.groupnameFilterChangedSubject.complete();
		this.evaluatorsFacade.clear();
	}


}
