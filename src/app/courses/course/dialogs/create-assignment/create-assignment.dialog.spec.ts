import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { CreateAssignmentDialog } from "./create-assignment.dialog";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AssignmentsService, AssignmentDto } from "../../../../../../api";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { of } from "rxjs";
import { copy } from "../../../../../../utils/object-helper";

const assignment: AssignmentDto = {
	id: "assignment_id",
	courseId: "course_id",
	collaborationType: "GROUP",
	points: 100,
	name: "Assignment 01",
	type: "HOMEWORK",
	state: "IN_PROGRESS",
	startDate: null,
	endDate: null,
	comment: null,
	link: null
};

const mock_AssignmentService = () => ({
	createAssignment: jest.fn().mockImplementation(() => of(assignment))
});

const mock_MatDialogRef = () => ({
	close: jest.fn()
});

const mock_MatSnackBar = () => ({
	open: jest.fn()
});

const assignmentTemplate: Partial<AssignmentDto> = {
	courseId: assignment.courseId,
	name: assignment.name,
	state: assignment.state,
	type: assignment.type,
	points: assignment.points,
	collaborationType: assignment.collaborationType
};

describe("", () => {

	let component: CreateAssignmentDialog;
	let fixture: ComponentFixture<CreateAssignmentDialog>;
	let dialogRef: MatDialogRef<CreateAssignmentDialog>;
	let assignmentService: AssignmentsService;
	let snackbar: MatSnackBar;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CreateAssignmentDialog],
			providers: [
				{ provide: AssignmentsService, useFactory: mock_AssignmentService },
				{ provide: MatDialogRef, useFactory: mock_MatDialogRef },
				{ provide: FormBuilder, useClass: FormBuilder },
				{ provide: MatSnackBar, useFactory: mock_MatSnackBar },
				{ provide: MAT_DIALOG_DATA, useValue: assignmentTemplate }
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateAssignmentDialog);
		component = fixture.componentInstance;
		dialogRef = fixture.debugElement.injector.get(MatDialogRef);
		assignmentService = fixture.debugElement.injector.get(AssignmentsService);
		snackbar = fixture.debugElement.injector.get(MatSnackBar);

		fixture.detectChanges();
	});

	it("Should be defined", () => {
		expect(component).toBeDefined();
	});

	describe("Constructor", () => {
	
		it("Form values get initialized with values assignmentTemplate", () => {
			expect(component.form.get("courseId").value).toEqual(assignmentTemplate.courseId);
			expect(component.form.get("state").value).toEqual(assignmentTemplate.state);
			// Add more values when they're implemented
		});
	
	});

	describe("onCancel", () => {
	
		it("Closes the dialog", () => {
			component.onCancel();
			expect(dialogRef.close).toHaveBeenCalled();
		});
	
	});

	describe("onSave", () => {
	
		it("Calls the assignmentService for creation", async () => {
			const expected = copy(assignment);
			expected.id = undefined;

			component.onSave();

			expect(assignmentService.createAssignment).toHaveBeenCalledWith(expected, expected.courseId);
		});

		it("Success -> Closes the dialog and returns created assignment", async () => {
			component.onSave();
			expect(dialogRef.close).toHaveBeenCalledWith(assignment);
		});

		it("Success -> Shows snackbar to indicate success", async () => {
			component.onSave();
			expect(snackbar.open).toHaveBeenCalled();
		});
	
	});

});
