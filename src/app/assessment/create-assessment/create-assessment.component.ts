import { Component, OnInit, ViewChild } from "@angular/core";
import { AssessmentsService, AssignmentsService, AssessmentCreateDto, AssignmentDto } from "../../../../api";
import { AssessmentForm } from "../forms/assessment-form/assessment-form.component";
import { ActivatedRoute, Router } from "@angular/router";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { AuthService } from "../../auth/services/auth.service";

@Component({
	selector: "app-create-assessment",
	templateUrl: "./create-assessment.component.html",
	styleUrls: ["./create-assessment.component.scss"]
})
export class CreateAssessmentComponent implements OnInit {

	@ViewChild(AssessmentForm, { static: true }) form: AssessmentForm;

	assignment: AssignmentDto;

	courseId: string;
	assignmentId: string;

	stateEnum = AssignmentDto.StateEnum;

	constructor(private assessmentService: AssessmentsService,
				private assignmentService: AssignmentsService,
				private authService: AuthService,
				private route: ActivatedRoute,
				private router: Router,
				private snackbar: SnackbarService) { }

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.assignmentId = this.route.snapshot.params.assignmentId;

		this.assignmentService.getAssignmentById(this.courseId, this.assignmentId).subscribe(
			result => this.assignment = result,
			error => {
				console.log(error);
				this.snackbar.openErrorMessage("Error.FailedToLoadRequiredData");
			}
		);
	}

	onSave(): void {
		const assessment: AssessmentCreateDto = this.form.getModel();
		assessment.assignmentId = this.assignmentId;
		assessment.creatorId = this.authService.getAuthToken().userId;

		this.assessmentService.createAssessment(assessment, this.courseId, this.assignmentId).subscribe(
			created => {
				// this.router.navigate(); TODO: Navigate to created assessment or go back to overview
				this.snackbar.openSuccessMessage();
			},
			error => {
				console.log(error);
				this.snackbar.openErrorMessage();
			}
		);
	}

}
