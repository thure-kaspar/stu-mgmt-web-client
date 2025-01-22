import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	OnDestroy,
	OnInit,
	Output
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { TranslateModule } from "@ngx-translate/core";
import { SnackbarService } from "@student-mgmt-client/services";
import { GroupDto, ParticipantDto } from "@student-mgmt/api-client";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { EvaluatorsFacade } from "../assessment/services/evaluators.facade";
import { AssessmentGroupPickerComponentModule } from "./assessment-group-picker/assessment-group-picker.component";
import { AssessmentUserPickerComponentModule } from "./assessment-user-picker/assessment-user-picker.component";

export class AssessmentTargetFilter {
	assignedEvaluatorId?: string;
	excludeAlreadyReviewed = false;
	nameOfGroupOrUser?: string;
}

@Component({
    selector: "student-mgmt-assessment-target-picker",
    templateUrl: "./assessment-target-picker.component.html",
    styleUrls: ["./assessment-target-picker.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AssessmentTargetPickerComponent implements OnInit, OnDestroy {
	@Input() selectedId: string;

	@Input() courseId: string;
	@Input() assignmentId: string;

	/** Emits the selected group. */
	@Output() onGroupSelected = new EventEmitter<GroupDto>();
	/** Emits the selected user. */
	@Output() onUserSelected = new EventEmitter<ParticipantDto>();
	/** Emits the ```assessmentId``` of the assessment that should be switched to for editing. */
	@Output() onSwitchToEdit = new EventEmitter<string>();

	evaluators: ParticipantDto[];

	// Expose the filter as an observable, so other components can react to changes in the filter
	filter = new AssessmentTargetFilter();
	private filterSubject = new BehaviorSubject<AssessmentTargetFilter>(undefined);
	filter$ = this.filterSubject.asObservable();

	private nameFilterChangedSubject = new Subject<void>();
	private nameFilterSubscription: Subscription;

	constructor(private evaluatorsFacade: EvaluatorsFacade, private snackbar: SnackbarService) {}

	ngOnInit(): void {
		this.evaluatorsFacade.loadEvaluators(this.courseId).subscribe({
			error: error => {
				this.snackbar.openErrorMessage();
			}
		});

		this.evaluatorsFacade.evaluators$.subscribe(evaluators => {
			this.evaluators = evaluators;
			this.filterSubject.next({ ...this.filter });
		});

		this.subscribeToChangesOfNameFilter();
	}

	/**
	 * Subscribes to changes in the name filter.
	 * If the name changes and the user has stopped typing for 0.5s, inform other components about the change (prevents request for every keystroke).
	 */
	private subscribeToChangesOfNameFilter(): void {
		this.nameFilterSubscription = this.nameFilterChangedSubject
			.pipe(debounceTime(300))
			.subscribe(() => this._updateNameFilter());
	}

	/** Updates the filter and informs subscribers about the change. */
	updateEvaluatorFilter(evaluator: ParticipantDto | undefined): void {
		this.filter.assignedEvaluatorId = evaluator?.userId;
		this.filterSubject.next({ ...this.filter });
	}

	updateExcludeAlreadyReviewedFilter(excludeAlreadyReviewed: boolean): void {
		this.filter.excludeAlreadyReviewed = excludeAlreadyReviewed;
		this.filterSubject.next({ ...this.filter });
	}

	updateNameFilter(): void {
		this.nameFilterChangedSubject.next();
	}

	private _updateNameFilter(): void {
		this.filterSubject.next({ ...this.filter }); // nameOfGroupOrUser property is bound to input field
	}

	ngOnDestroy(): void {
		this.filterSubject.complete();
		this.nameFilterChangedSubject.complete();
		this.evaluatorsFacade.clear();
	}
}

@NgModule({
	declarations: [AssessmentTargetPickerComponent],
	exports: [AssessmentTargetPickerComponent],
	imports: [
		CommonModule,
		FormsModule,
		MatTabsModule,
		MatSelectModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatInputModule,
		TranslateModule,
		AssessmentGroupPickerComponentModule,
		AssessmentUserPickerComponentModule
	]
})
export class AssessmentTargetPickerComponentModule {}
