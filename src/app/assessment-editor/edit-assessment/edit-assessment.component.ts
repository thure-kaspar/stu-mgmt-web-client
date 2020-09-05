import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { AssessmentDto, AssessmentEventDto, AssessmentsService, AssessmentUpdateDto, AssignmentDto, AssignmentsService, GroupDto, GroupsService, PartialAssessmentDto, ParticipantDto } from "../../../../api";
import { DialogService } from "../../shared/services/dialog.service";
import { ParticipantFacade } from "../../shared/services/participant.facade";
import { ToastService } from "../../shared/services/toast.service";
import { AssessmentForm } from "../forms/assessment-form/assessment-form.component";

@Component({
	selector: "app-edit-assessment",
	templateUrl: "./edit-assessment.component.html",
	styleUrls: ["./edit-assessment.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditAssessmentComponent implements OnInit {

	@ViewChild(AssessmentForm, { static: true }) form: AssessmentForm;

	assessment$ = new Subject<AssessmentDto>();
	private assessment: AssessmentDto;

	events: AssessmentEventDto[];
	showEvents = false;

	assignment: AssignmentDto;
	group: GroupDto;
	targetedParticipant: ParticipantDto;

	courseId: string;
	assignmentId: string;
	assessmentId: string;

	stateEnum = AssignmentDto.StateEnum;

	/** Stores PartialAssessment that will be removed when the user saves. */
	private removedPartialAssessments: PartialAssessmentDto[] = [];
	private routeToAssessmentsCmds: string[];

	constructor(
		public participantFacade: ParticipantFacade,
		private assessmentService: AssessmentsService,
		private assignmentService: AssignmentsService,
		private groupService: GroupsService,
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private dialog: DialogService,
		private toast: ToastService
	) { }

	ngOnInit(): void {
		this.courseId = this.route.snapshot.params.courseId;
		this.assignmentId = this.route.snapshot.params.assignmentId;
		this.assessmentId = this.route.snapshot.params.assessmentId;
		this.routeToAssessmentsCmds = ["courses", this.courseId, "assignments", this.assignmentId, "assessments"];
		this.loadAssessment();
	}

	private assignLoadAssessmentResult(assessment: AssessmentDto): void {
		this.assessment = assessment;
		this.assignment = assessment.assignment;
		this.group = assessment.group;
		this.targetedParticipant = assessment.participant;
		
		// Empty the form
		this.form.form.reset(); 
		this.form.getPartialAssessments().clear();

		// Apply update to form
		this.form.patchModel(assessment);
		assessment.partialAssessments?.forEach(partial => {
			this.form.addPartialAssessment(partial);
		});

		this.assessment$.next(assessment);
	}

	/** Loads the assessment. Uses the current route params to determine courseId, assignmentId and assessmentId. */
	loadAssessment(): void {
		this.assessmentService.getAssessmentById(this.courseId, this.assignmentId, this.assessmentId)
			.subscribe(
				result => {
					this.assignLoadAssessmentResult(result);
				},
				error => {
					this.toast.apiError(error);
				}
			);
	}

	loadAssessmentEvents(): void {
		if (!this.showEvents) {
			this.assessmentService.getEventsOfAssessment(this.courseId, this.assessmentId, this.assessmentId)
				.subscribe(
					result => {
						this.events = result;
						this.showEvents = true;
					},
					error => {
						this.toast.apiError(error);
					}
				);
		}
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
				this.toast.success("Message.Saved");
			},
			error => {
				this.toast.apiError(error);
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
	userSelectedHandler(participant: ParticipantDto): void {
		this.router.navigate(
			[...this.routeToAssessmentsCmds, "editor", "create"],
			{ fragment: "user" + participant.userId }
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
		const routeCmds = [...this.routeToAssessmentsCmds, "editor", "edit", assessmentId];
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
		this.removedPartialAssessments = [];
		this.group = undefined;
		this.targetedParticipant = undefined;
		this.events = undefined;
		this.showEvents = false;
	}

}
