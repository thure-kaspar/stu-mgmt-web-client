import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { AssessmentAllocationService, AssignmentDto } from "../../../../api";
import { getRouteParam } from "../../../../utils/helper";
import { EvaluatorsFacade } from "../../assessment/services/evaluators.facade";
import { SearchAssignmentDialog } from "../../assignment/dialogs/search-assignment/search-assignment.dialog";
import { SnackbarService } from "../../shared/services/snackbar.service";

@Component({
	selector: "app-assessment-allocation-overview",
	templateUrl: "./assessment-allocation-overview.component.html",
	styleUrls: ["./assessment-allocation-overview.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentAllocationOverviewComponent implements OnInit {
	courseId: string;
	assignmentId: string;

	constructor(
		private route: ActivatedRoute,
		private allocationService: AssessmentAllocationService,
		private evaluatorsFacade: EvaluatorsFacade,
		private dialog: MatDialog,
		private snackbar: SnackbarService
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
					this.allocationService
						.addAllocationsFromExistingAssignment(
							this.courseId,
							this.assignmentId,
							selected.id
						)
						.subscribe(
							result => {
								this.snackbar.openSuccessMessage();
								this.evaluatorsFacade.loadEvaluators(this.courseId).subscribe();
							},
							error => {
								console.log(error);
								this.snackbar.openErrorMessage();
							}
						);
				}
			});
	}
}
