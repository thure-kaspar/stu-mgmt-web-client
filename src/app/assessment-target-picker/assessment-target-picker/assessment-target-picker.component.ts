import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { AssignmentsService, GroupDto, CoursesService, UserDto } from "../../../../api";
import { SnackbarService } from "../../shared/services/snackbar.service";

import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { EvaluatorsFacade } from "../../assessment/services/evaluators.facade";

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

	/** Emits the selected group. */
	@Output() onGroupSelected = new EventEmitter<GroupDto>();
	/** Emits the selected user. */
	@Output() onUserSelected = new EventEmitter<UserDto>();
	/** Emits the ```assessmentId``` of the assessment that should be switched to for editing. */
	@Output() onSwitchToEdit = new EventEmitter<string>();

	evaluators: UserDto[];

	// Expose the filter as an observable, so other components can react to changes in the filter
	filter = new AssessmentTargetFilter();
	private filterSubject = new BehaviorSubject<AssessmentTargetFilter>(undefined);
	filter$ = this.filterSubject.asObservable();

	private nameFilterChangedSubject = new Subject<void>();
	private nameFilterSubscription: Subscription;

	constructor(private assigmentService: AssignmentsService,
				private courseService: CoursesService,
				private evaluatorsFacade: EvaluatorsFacade,
				private snackbar: SnackbarService) { }

	ngOnInit(): void {
		this.evaluatorsFacade.loadEvaluators(this.courseId).subscribe({
			error: error => {
				this.snackbar.openErrorMessage();
			}
		});

		this.evaluatorsFacade.evaluators$.subscribe(
			evaluators => {
				this.evaluators = evaluators;
				this.filterSubject.next({...this.filter});
			}
		);

		this.subscribeToChangesOfNameFilter();
	}

	/**
	 * Subscribes to changes in the name filter.
	 * If the name changes and the user has stopped typing for 0.5s, inform other components about the change (prevents request for every keystroke).
	 */
	private subscribeToChangesOfNameFilter(): void {
		this.nameFilterSubscription = this.nameFilterChangedSubject
			.pipe(debounceTime(500)).subscribe(() => 
				this._updateNameFilter()
			);
	}

	/** Updates the filter and informs subscribers about the change. */
	updateEvaluatorFilter(evaluator: UserDto | undefined): void {
		this.filter.assignedEvaluatorId = evaluator?.id;
		this.filterSubject.next({...this.filter });
	}

	updateExcludeAlreadyReviewedFilter(excludeAlreadyReviewed: boolean): void {
		this.filterSubject.next({...this.filter, excludeAlreadyReviewed: excludeAlreadyReviewed });
	}

	updateNameFilter(): void {
		this.nameFilterChangedSubject.next();
	}

	private _updateNameFilter(): void {
		this.filterSubject.next({...this.filter }); // nameOfGroupOrUser property is bound to input field
	}

	ngOnDestroy(): void {
		this.filterSubject.complete();
		this.nameFilterChangedSubject.complete();
		this.evaluatorsFacade.clear();
	}


}
