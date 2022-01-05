import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "@student-mgmt-client/services";
import { AssignmentFormComponent } from "../assignment/forms/assignment-form/assignment-form.component";
import { AssignmentManagementFacade } from "../assignment/services/assignment-management.facade";

@Component({
	selector: "student-mgmt-assignment-edit",
	templateUrl: "./assignment-edit.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentEditComponent implements OnInit {
	@ViewChild(AssignmentFormComponent, { static: true }) form: AssignmentFormComponent;
	private assignmentId: string;
	private courseId: string;

	constructor(
		private assignmentManagement: AssignmentManagementFacade,
		private toast: ToastService,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.assignmentId = this.route.snapshot.params.assignmentId;

		this.assignmentManagement.get(this.assignmentId, this.courseId).subscribe(
			result => {
				this.form.form.patchValue(result);
				if (result.links?.length > 0) {
					result.links.forEach(link => {
						this.form.addLink(link);
					});
				}
				if (result.configs?.length > 0) {
					result.configs.forEach(config => {
						this.form.addConfig(config);
					});
				}
			},
			error => console.log(error)
		);
	}

	onSave(): void {
		const assignment = this.form.form.value;
		assignment.id = this.assignmentId;

		this.assignmentManagement.update(assignment, this.assignmentId, this.courseId).subscribe({
			next: () => {
				this.toast.success(assignment.name, "Message.Saved");
			},
			error: error => {
				this.toast.apiError(error);
			}
		});
	}
}
