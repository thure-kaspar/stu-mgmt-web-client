import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ToastService } from "@student-mgmt-client/services";
import { IconComponentModule, TitleComponentModule } from "@student-mgmt-client/shared-ui";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import { AssessmentAllocationApi, AssignmentDto } from "@student-mgmt/api-client";
import { AssessmentTargetPickerComponentModule } from "../../assessment-target-picker/assessment-target-picker.component";
import { EvaluatorsFacade } from "../../assessment/services/evaluators.facade";
import { SearchAssignmentDialog } from "../../assignment/dialogs/search-assignment/search-assignment.dialog";

@Component({
	selector: "student-mgmt-assessment-allocation-overview",
	templateUrl: "./assessment-allocation-overview.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentAllocationOverviewComponent implements OnInit {
	courseId: string;
	assignmentId: string;

	constructor(
		private route: ActivatedRoute,
		private allocationApi: AssessmentAllocationApi,
		private evaluatorsFacade: EvaluatorsFacade,
		private dialog: MatDialog,
		private toast: ToastService
	) {}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.assignmentId = getRouteParam("assignmentId", this.route);
	}

	openCopyFromPreviousDialog(): void {
		const data = this.courseId;
		this.dialog
			.open<SearchAssignmentDialog, string, AssignmentDto[]>(SearchAssignmentDialog, { data })
			.afterClosed()
			.subscribe(selection => {
				const selected = selection?.length > 0 ? selection[0] : undefined;
				if (selected) {
					this.allocationApi
						.addAllocationsFromExistingAssignment(
							this.courseId,
							this.assignmentId,
							selected.id
						)
						.subscribe({
							next: () => {
								this.toast.success();
								this.evaluatorsFacade.loadEvaluators(this.courseId).subscribe();
							},
							error: error => {
								this.toast.apiError(error);
							}
						});
				}
			});
	}
}

@NgModule({
	declarations: [AssessmentAllocationOverviewComponent],
	exports: [AssessmentAllocationOverviewComponent],
	imports: [
		CommonModule,
		MatButtonModule,
		TranslateModule,
		IconComponentModule,
		AssessmentTargetPickerComponentModule,
		TitleComponentModule
	]
})
export class AssessmentAllocationOverviewComponentModule {}
