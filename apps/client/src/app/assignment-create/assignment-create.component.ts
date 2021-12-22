import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from "@student-mgmt-client/services";
import { AssignmentDto } from "@student-mgmt/api-client";
import { AssignmentFormComponent } from "../assignment/forms/assignment-form/assignment-form.component";
import { AssignmentManagementFacade } from "../assignment/services/assignment-management.facade";

/**
 * Dialog that allows the creation of new assignments. Expects the courseId. Returns the created assignment.
 */
@Component({
	selector: "student-mgmt-create-assignment",
	templateUrl: "./assignment-create.component.html"
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class AssignmentCreateComponent implements OnInit {
	@ViewChild(AssignmentFormComponent, { static: true }) form: AssignmentFormComponent;

	courseId: string;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private assignmentManagement: AssignmentManagementFacade,
		private toast: ToastService
	) {}

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.form.form.patchValue({
			type: AssignmentDto.TypeEnum.HOMEWORK,
			collaboration: AssignmentDto.CollaborationEnum.GROUP
		});
	}

	create(): void {
		const assignment = this.form.form.value;
		this.assignmentManagement.create(assignment, this.courseId).subscribe({
			next: createdAssignment => {
				this.toast.success(createdAssignment.name, "Message.Created");
				this.router.navigate(["/courses", this.courseId, "assignments"]);
			},
			error: error => {
				this.toast.apiError(error);
			}
		});
	}
}
