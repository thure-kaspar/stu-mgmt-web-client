import { Component, OnInit, ViewChild } from "@angular/core";
import { AssessmentsService, AssignmentsService, AssessmentCreateDto, AssignmentDto, GroupDto, UserDto, GroupsService, UsersService } from "../../../../api";
import { AssessmentForm } from "../forms/assessment-form/assessment-form.component";
import { ActivatedRoute, Router } from "@angular/router";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { AuthService } from "../../auth/services/auth.service";
import { DialogService } from "../../shared/services/dialog.service";

@Component({
	selector: "app-create-assessment",
	templateUrl: "./create-assessment.component.html",
	styleUrls: ["./create-assessment.component.scss"]
})
export class CreateAssessmentComponent implements OnInit {

	@ViewChild(AssessmentForm, { static: true }) form: AssessmentForm;

	assignment: AssignmentDto;
	forUser: UserDto;
	forGroup: GroupDto;

	courseId: string;
	assignmentId: string;

	stateEnum = AssignmentDto.StateEnum;

	constructor(private assessmentService: AssessmentsService,
				private assignmentService: AssignmentsService,
				private groupService: GroupsService,
				private userService: UsersService,
				private authService: AuthService,
				private route: ActivatedRoute,
				private router: Router,
				private snackbar: SnackbarService,
				private dialog: DialogService) { }

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

		this.setPreselectedGroupOrUser();
	}

	/**
	 * If the URL-fragment contains `#group` or `#user` followed by the corresponding ID,
	 * i.e. `#groupb4f24e81-dfa4-4641-af80-8e34e02d9c4a`, then this will select the specfied group or user.
	 */
	private setPreselectedGroupOrUser(): void {
		const fragment = this.route.snapshot.fragment;
		const groupMatch = fragment?.match(/^group(.+)/);
		const userMatch = fragment?.match(/^user(.+)/);

		if (groupMatch) {
			// Only pass id to handler, because it will query for group data itself
			this.groupSelectedHandler({ id: groupMatch[1] } as any);
		}

		if (userMatch) {
			this.userService.getUserById(userMatch[1]).subscribe(
				user => this.userSelectedHandler(user),
				error => {
					console.log(error);
					this.snackbar.openErrorMessage();
				}
			);
		}
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

	/** Sets the selected group and loads its members. Removes the selected user, if it exists. */
	groupSelectedHandler(group: GroupDto): void {
		this.forUser = undefined;
		this.form.patchModel({ groupId: group.id, userId: null });
		this.forGroup = group;

		// Load members of the group
		this.groupService.getGroupFromAssignment(this.courseId, group.id, this.assignmentId).subscribe(
			result => {
				this.forGroup = result;
			},
			error => {
				console.log(error);
				this.snackbar.openErrorMessage("Failed to load information about the selected group.");
			}
		);
	}

	/** Sets the selected user and removes the selected group, it it exists. */
	userSelectedHandler(user: UserDto): void {
		this.forGroup = undefined;
		this.form.patchModel({ userId: user.id, groupId: null });
		this.forUser = user;
	}

	/**
	 * Navigates to the edit component of the specified assessment.
	 * If the user has unsaved changes in the form, the user will be asked to confirm this action.
	 */
	switchToEdit(assessmentId: string): void {
		// Route to the assessment
		const routeCmds = ["courses", this.courseId, "assignments", this.assignmentId, "assessments", "editor", assessmentId, "edit"];
		// If user has inserted data in the form
		if (this.form.form.dirty) {
			// Ask user, if he wants to discard his unsaved changes
			this.dialog.openUnsavedChangesDialog().subscribe(
				confirmed => {
					if (confirmed) {
						this.router.navigate(routeCmds);
					}
				}
			);
		} else {
			this.router.navigate(routeCmds);
		}
	}

}
