import { Component, OnInit, ViewChild } from "@angular/core";
import { AssessmentsService, AssignmentsService, GroupsService, AssessmentDto, AssignmentDto, GroupDto, UserDto, AssessmentUpdateDto, AssessmentEventDto, PartialAssessmentDto } from "../../../../api";
import { ActivatedRoute, Router } from "@angular/router";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { AssessmentForm } from "../forms/assessment-form/assessment-form.component";
import { DialogService } from "../../shared/services/dialog.service";
import { Location } from "@angular/common";

@Component({
	selector: "app-edit-assessment",
	templateUrl: "./edit-assessment.component.html",
	styleUrls: ["./edit-assessment.component.scss"]
})
export class EditAssessmentComponent implements OnInit {

	@ViewChild(AssessmentForm, { static: true }) form: AssessmentForm;
	assessment: AssessmentDto;

	events: AssessmentEventDto[];
	showEvents = false;

	assignment: AssignmentDto;
	group: GroupDto;
	user: UserDto;

	courseId: string;
	assignmentId: string;
	assessmentId: string;

	stateEnum = AssignmentDto.StateEnum;

	/** Stores PartialAssessment that will be removed when the user saves. */
	private removedPartialAssessments: PartialAssessmentDto[] = [];
	private routeToAssessmentsCmds: string[];

	constructor(private assessmentService: AssessmentsService,
				private assignmentService: AssignmentsService,
				private groupService: GroupsService,
				private route: ActivatedRoute,
				private router: Router,
				private location: Location,
				private snackbar: SnackbarService,
				private dialog: DialogService) { }

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.assignmentId = this.route.snapshot.params.assignmentId;
		this.assessmentId = this.route.snapshot.params.assessmentId;
		this.routeToAssessmentsCmds = ["courses", this.courseId, "assignments", this.assignmentId, "assessments"];
		this.loadAssessment();
	}

	private assignLoadAssessmentResult(result: AssessmentDto): void {
		this.assessment = result;
		this.assignment = this.assessment.assignment;
		this.group = this.assessment.group;
		this.user = this.assessment.user;
		
		// Empty the form
		this.form.form.reset(); 
		this.form.getPartialAssessments().clear();

		// Apply update to form
		this.form.patchModel(this.assessment);
		this.assessment.partialAssessments?.forEach(partial => {
			this.form.addPartialAssessment(partial);
		});
	}

	/** Loads the assessment. Uses the current route params to determine courseId, assignmentId and assessmentId. */
	loadAssessment(): void {
		this.assessmentService.getAssessmentById(this.courseId, this.assignmentId, this.assessmentId)
			.subscribe(
				result => {
					this.assignLoadAssessmentResult(result);
				},
				error => {
					console.log(error);
					this.snackbar.openErrorMessage("Error.FailedToLoadRequiredData");
				}
			);
	}

	loadAssessmentEvents(): void {
		this.assessmentService.getEventsOfAssessment(this.courseId, this.assessmentId, this.assessmentId)
			.subscribe(
				result => {
					this.events = result;
					this.showEvents = true;
				},
				error => {
					console.log(error);
					this.snackbar.openErrorMessage("Error.FailedToLoadRequiredData");
				}
			);
	}

	onSave(): void {
		const model = this.form.getModel();
		const update: AssessmentUpdateDto = {
			achievedPoints: model.achievedPoints,
			comment: model.comment?.length > 0 ? model.comment : null,
			addPartialAssessments: model.partialAssessments?.filter(p => !p.id), // To add = partials without id, because they haven't been created yet
			updatePartialAssignments: model.partialAssessments?.filter(p => !!p.id),
			removePartialAssignments: this.removedPartialAssessments
		};

		// Ensure that assessmentId of partial assessments is set
		update.addPartialAssessments?.forEach(p => p.assessmentId = this.assessmentId);
		update.updatePartialAssignments?.forEach(p => p.assessmentId = this.assessmentId);

		this.assessmentService.updateAssessment(update, this.courseId, this.assignmentId, this.assessmentId).subscribe(
			result => {
				this.assignLoadAssessmentResult(result);
				this.snackbar.openSuccessMessage();
			},
			error => {
				console.log(error);
				this.snackbar.openErrorMessage();
			}
		);
	}

	addToRemovedPartials(partialAssessmentId: number): void {
		const partial = this.assessment.partialAssessments.find(p => p.id == partialAssessmentId);
		if (partial) {
			this.removedPartialAssessments = [...this.removedPartialAssessments, partial];
		}
	}

	/** Sets the selected group and loads its members. Removes the selected user, if it exists. */
	groupSelectedHandler(group: GroupDto): void {
		this.router.navigate(
			[...this.routeToAssessmentsCmds, "editor", "create"],
			{ fragment: "group" + group.id }
		);
	}

	/** Sets the selected user and removes the selected group, it it exists. */
	userSelectedHandler(user: UserDto): void {
		this.router.navigate(
			[...this.routeToAssessmentsCmds, "editor", "create"],
			{ fragment: "user" + user.id }
		);
	}

	/**
	 * Navigates to the edit component of the specified assessment.
	 * If the user has unsaved changes in the form, the user will be asked to confirm this action.
	 */
	switchToEdit(assessmentId: string): void {
		// If user has inserted data in the form
		if (this.form.form.dirty) {
			// Ask user, if he wants to discard his unsaved changes
			this.dialog.openUnsavedChangesDialog().subscribe(
				confirmed => {
					if (confirmed) {
						this.navigateToAssessment(assessmentId);
					}
				}
			);
		} else {
			this.navigateToAssessment(assessmentId);
		}
	}

	/** Navigates to another assessment. */
	private navigateToAssessment(assessmentId: string): void {
		// Construct new url
		const routeCmds = [...this.routeToAssessmentsCmds, "editor", assessmentId, "edit"];
		const url = this.router.createUrlTree(routeCmds).toString();
		console.log(url);
		this.assessmentId = assessmentId;

		// Change url (without reloading )
		this.location.go(url);

		// Reset form and relevant component data
		this.resetComponentData();
		this.loadAssessment();
	}

	/** Resets the form and component data. Should be used before loading a different assessment. */
	private resetComponentData(): void {
		this.form.form.reset();
		this.assignment = undefined;
		this.assessment = undefined;
		this.removedPartialAssessments = [];
		this.group = undefined;
		this.user = undefined;
		this.events = undefined;
		this.showEvents = false;
	}

}
