import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ToastService } from "@student-mgmt-client/services";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import {
	AssessmentAllocationApi,
	AssessmentAllocationDto,
	ParticipantDto
} from "@student-mgmt/api-client";
import { EvaluatorsFacade } from "../../assessment/services/evaluators.facade";

/**
 * Component that provides a selection of users (evaluators), which can be assigned to a group or user.
 * Assigned evaluator is then be responsible for creating the assessment for the group or user.
 * Should be created for every group or user element in a list.
 * #### Input params
 * - ```evaluators``` - Users that can be assigned, i.e. lecturers and tutors
 * - ```assignedTo``` - The currently assigned tutor/lecturer. May be undefined.
 * - ```courseId``` & ```assignmentId``` - mandatory to determine the context of the request
 * - ```groupId``` OR ```userId``` - The targeted group or user of this component
 */
@Component({
    selector: "student-mgmt-assessment-allocation",
    templateUrl: "./assessment-allocation.component.html",
    styleUrls: ["./assessment-allocation.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AssessmentAllocationComponent extends UnsubscribeOnDestroy implements OnInit {
	/** Id of the group that should be assigned to the selected tutor/lecturer. */
	@Input() groupId: string;
	/** Id of the user that should be assigned to the selected tutor/lecturer. */
	@Input() userId: string;
	/** Id of the currently assigned tutor/lecturer. May be undefined. */
	@Input() assignedTo: string | undefined;
	@Input() courseId: string;
	@Input() assignmentId: string;

	evaluators: ParticipantDto[];
	evaluator: ParticipantDto;

	constructor(
		private allocationService: AssessmentAllocationApi,
		private evaluatorsFacade: EvaluatorsFacade,
		private toast: ToastService
	) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.evaluatorsFacade.evaluators$.subscribe(evaluators => {
			if (evaluators) {
				this.evaluators = evaluators;
				this.evaluator = this.evaluatorsFacade.getEvaluatorById(this.assignedTo);
			}
		});
	}

	/** Handles the (de)selection of an evaluator. */
	handleEvaluatorChange(evaluator: ParticipantDto | undefined): void {
		// If no evaluator was assigned previously and user selected nobody
		if (!this.assignedTo && !evaluator) {
			return;
		}

		if (!evaluator) {
			// If evaluator was removed
			this.removeAllocation();
		} else if (this.assignedTo !== evaluator?.userId) {
			// If evaluator wasn't already assigned to this group/user, assign evaluator
			this.assignEvaluator(evaluator);
		}
	}

	/** Assigns an evaluator to a group or user. */
	assignEvaluator(evaluator: ParticipantDto): void {
		const allocation: AssessmentAllocationDto = {
			assignmentId: this.assignmentId,
			assignedEvaluatorId: evaluator.userId
		};

		// Determine if we're assigning to a group or user
		if (this.groupId) {
			allocation.groupId = this.groupId;
		} else if (this.userId) {
			allocation.userId = this.userId;
		}

		this.allocationService
			.createAllocation(allocation, this.courseId, this.assignmentId)
			.subscribe({
				next: () => {
					this.evaluator = evaluator;
					this.assignedTo = evaluator.userId;
					this.toast.success();
				},
				error: error => {
					this.toast.apiError(error);
				}
			});
	}

	/** Removes the assigned evaluator from the group or user. */
	removeAllocation(): void {
		this.allocationService
			.removeAllocation(this.courseId, this.assignmentId, this.groupId, this.userId)
			.subscribe({
				next: () => {
					this.evaluator = undefined;
					this.assignedTo = undefined;
					this.toast.success();
				},
				error: error => {
					this.toast.apiError(error);
				}
			});
	}
}

@NgModule({
	declarations: [AssessmentAllocationComponent],
	exports: [AssessmentAllocationComponent],
	imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule]
})
export class AssessmentAllocationComponentModule {}
