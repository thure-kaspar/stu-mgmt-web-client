import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	NgModule
} from "@angular/core";
import {
	AbstractControl,
	UntypedFormArray,
	UntypedFormBuilder,
	UntypedFormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
	Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { DialogService } from "@student-mgmt-client/services";
import {
	AddableListHeaderComponentModule,
	CardComponentModule,
	IconComponentModule
} from "@student-mgmt-client/shared-ui";
import { AssignmentDto, MarkerDto, PartialAssessmentDto } from "@student-mgmt/api-client";
import { firstValueFrom } from "rxjs";
import { MarkerComponentModule } from "../../../assessment/components/marker/marker.component";
import { EditMarkerDialog } from "../../dialogs/edit-marker/edit-marker.dialog";

/**
 * Custom validator that checks, whether a `groupId` or `userId` was specified.
 */
const groupOrUserValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	return control.get("groupId").value || control.get("userId").value
		? null
		: { noGroupOrUser: true };
};

@Component({
    selector: "student-mgmt-assessment-form",
    templateUrl: "./assessment-form.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AssessmentFormComponent {
	@Input() assignment: AssignmentDto;

	form: UntypedFormGroup;

	severityEnum = MarkerDto.SeverityEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;

	constructor(
		private fb: UntypedFormBuilder,
		private dialog: MatDialog,
		private dialogService: DialogService,
		private cdRef: ChangeDetectorRef
	) {
		this.form = this.fb.group(
			{
				achievedPoints: [0, [this.achievedPointsMaxValueValidator()]],
				userId: [null],
				groupId: [null],
				comment: [null],
				isDraft: [false],
				partialAssessments: this.fb.array([])
			},
			{ validators: [groupOrUserValidator] }
		);
	}

	/** Validates that the achieved points do not exceed the max. possible amount of points. */
	private achievedPointsMaxValueValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: unknown } | null => {
			let isTooBig = false;
			// Only validate, if assignment is loaded and has can awards points
			if (this.assignment?.points) {
				isTooBig =
					control.value > this.assignment.points + (this.assignment.bonusPoints ?? 0);
			}
			return isTooBig ? { achievedPointsMaxValue: { value: control.value } } : null;
		};
	}

	/** Returns translation strings of form errors, which can be used in the component. */
	getErrors(): string[] {
		const errors = [];
		if (this.form.hasError("required", ["achievedPoints"])) {
			errors.push("Error.ValueMissing");
		}
		if (this.form.hasError("achievedPointsMaxValue", ["achievedPoints"])) {
			errors.push("Error.Assessment.AchievedPointsMaxValueExceeded");
		}
		return errors;
	}

	/** Adds a partial assessment to the form. */
	addPartialAssessment(partialAssessment?: PartialAssessmentDto): void {
		const markerArray = this.fb.array([]);
		partialAssessment?.markers?.forEach(marker => {
			markerArray.push(
				this.fb.group({
					path: [marker.path, Validators.required],
					startLineNumber: [marker.startLineNumber, Validators.required],
					endLineNumber: [marker.endLineNumber, Validators.required],
					startColumn: [marker.startColumn],
					endColumn: [marker.endColumn],
					severity: [marker.severity],
					comment: [marker.comment, Validators.required],
					points: [marker.points]
				})
			);
		});

		const formGroup = this.fb.group({
			key: [partialAssessment?.key ?? null],
			title: [partialAssessment?.title ?? null, Validators.required],
			points: [partialAssessment?.points ?? null],
			comment: [partialAssessment?.comment ?? null],
			draftOnly: [partialAssessment?.draftOnly ?? false],
			markers: markerArray
		});

		this.getPartialAssessments().push(formGroup);
	}

	/** Removes a partial assessment from the form. */
	async removePartialAssessment(index: number): Promise<void> {
		const confirmed = await firstValueFrom(
			this.dialogService.openConfirmDialog({
				title: "Action.Remove"
			})
		);

		if (confirmed) {
			this.getPartialAssessments().removeAt(index);
			this.cdRef.detectChanges();
		}
	}

	getPartialAssessments(): UntypedFormArray {
		return this.form.get("partialAssessments") as UntypedFormArray;
	}

	getPartialAssessment(index: number): UntypedFormGroup {
		return this.getPartialAssessments().at(index) as UntypedFormGroup;
	}

	getMarkers(partialIndex: number): UntypedFormArray {
		return this.getPartialAssessments().at(partialIndex).get("markers") as UntypedFormArray;
	}

	addMarker(partialIndex: number, severity: MarkerDto.SeverityEnum): void {
		this.dialog
			.open(EditMarkerDialog, { data: { severity } })
			.afterClosed()
			.subscribe((marker: MarkerDto) => {
				if (marker) {
					this.getMarkers(partialIndex).push(
						this.fb.group({
							path: [marker.path, Validators.required],
							startLineNumber: [marker.startLineNumber, Validators.required],
							endLineNumber: [marker.endLineNumber, Validators.required],
							startColumn: [marker.startColumn],
							endColumn: [marker.endColumn],
							severity: [marker.severity],
							comment: [marker.comment, Validators.required],
							points: [marker.points]
						})
					);
					this.cdRef.detectChanges();
				}
			});
	}

	async removeMarker(partialIndex: number, markerIndex: number): Promise<void> {
		const confirmed = await firstValueFrom(
			this.dialogService.openConfirmDialog({
				title: "Action.Remove"
			})
		);

		if (confirmed) {
			this.getMarkers(partialIndex).removeAt(markerIndex);
			this.cdRef.detectChanges();
		}
	}

	editMarker(marker: MarkerDto, partialIndex: number, markerIndex: number): void {
		this.dialog
			.open(EditMarkerDialog, { data: marker })
			.afterClosed()
			.subscribe(changedMarker => {
				if (changedMarker) {
					this.getMarkers(partialIndex).at(markerIndex).patchValue(changedMarker);
				}
				this.cdRef.detectChanges();
			});
	}
}

@NgModule({
	declarations: [AssessmentFormComponent],
	exports: [AssessmentFormComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatSlideToggleModule,
		MatFormFieldModule,
		MatInputModule,
		MatTooltipModule,
		TranslateModule,
		CardComponentModule,
		IconComponentModule,
		MarkerComponentModule,
		AddableListHeaderComponentModule
	]
})
export class AssessmentFormComponentModule {}
