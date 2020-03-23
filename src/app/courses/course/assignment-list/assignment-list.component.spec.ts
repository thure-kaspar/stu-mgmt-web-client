import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";
import { AssignmentDto } from "../../../../../api";
import { AssignmentListComponent } from "./assignment-list.component";

const assignment: AssignmentDto = {
	id: "assignment_id",
	courseId: "course_id",
	collaborationType: "GROUP",
	maxPoints: 100,
	name: "Assignment 01",
	type: "HOMEWORK",
	state: "IN_PROGRESS",
	startDate: null,
	endDate: null,
	comment: null,
	link: null
};

// Mock the MatDialogRef-class returned by MatDialog.open
class MockMatDialogRefClass {
	afterClosed(): any {
		return null;
	}
}

// Mock the implementation so it returns an observable of type AssignmentDto
const mock_MatDialogRef = new MockMatDialogRefClass();
mock_MatDialogRef.afterClosed = jest.fn().mockImplementation(() => of(assignment));

const mock_MatDialog = () => ({
	open: jest.fn().mockReturnValue(mock_MatDialogRef)
});

describe("AssignmentListComponent", () => {

	let component: AssignmentListComponent;
	let fixture: ComponentFixture<AssignmentListComponent>;
	let dialog: MatDialog;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssignmentListComponent],
			providers: [
				{ provide: MatDialog, useFactory: mock_MatDialog }
			],
			imports: [TranslateModule.forChild({ extend: true })],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssignmentListComponent);
		component = fixture.componentInstance;
		component.assignments = [];
		component.courseId = "course_id";
		dialog = fixture.debugElement.injector.get(MatDialog);

		fixture.detectChanges();
	});

	it("Should be defined", () => {
		expect(component).toBeDefined();
	});

	describe("openAddDialog", () => {
	
		it("Opens the CreateAssignmentDialog", () => {
			component.openAddDialog();
			expect(dialog.open).toHaveBeenCalled();
		});

		it("After Closed: Success -> Adds created assignment to assignments", () => {
			component.openAddDialog();
			expect(mock_MatDialogRef.afterClosed).toHaveBeenCalled();
			expect(component.assignments).toContain(assignment);
		});
	
	});

});
