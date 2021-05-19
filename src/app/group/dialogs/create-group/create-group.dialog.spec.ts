import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { GroupDto, GroupService } from "../../../../../../api";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { of } from "rxjs";
import { copy } from "../../../../../../utils/object-helper";
import { CreateGroupDialog } from "./create-group.dialog";

const group: GroupDto = {
	id: "aee1ee84-d5db-40ab-a948-eb82fdd2a6a5",
	courseId: "java-wise1920",
	name: "Test Group 01",
	isClosed: false
};

const mock_GroupService = () => ({
	createGroup: jest.fn().mockImplementation(() => of(group))
});

const mock_MatDialogRef = () => ({
	close: jest.fn()
});

const mock_MatSnackBar = () => ({
	open: jest.fn()
});

const groupTemplate: Partial<GroupDto> = {
	courseId: group.courseId
};

describe("", () => {
	let component: CreateGroupDialog;
	let fixture: ComponentFixture<CreateGroupDialog>;
	let dialogRef: MatDialogRef<CreateGroupDialog>;
	let groupService: GroupService;
	let snackbar: MatSnackBar;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CreateGroupDialog],
			providers: [
				{ provide: GroupService, useFactory: mock_GroupService },
				{ provide: MatDialogRef, useFactory: mock_MatDialogRef },
				{ provide: FormBuilder, useClass: FormBuilder },
				{ provide: MatSnackBar, useFactory: mock_MatSnackBar },
				{ provide: MAT_DIALOG_DATA, useValue: groupTemplate }
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateGroupDialog);
		component = fixture.componentInstance;
		dialogRef = fixture.debugElement.injector.get(MatDialogRef);
		groupService = fixture.debugElement.injector.get(GroupService);
		snackbar = fixture.debugElement.injector.get(MatSnackBar);

		fixture.detectChanges();
	});

	it("Should be defined", () => {
		expect(component).toBeDefined();
	});

	describe("Constructor", () => {
		it("Form values get initialized with values groupTemplate", () => {
			expect(component.form.get("courseId").value).toEqual(groupTemplate.courseId);
			// Add more values when they're implemented
		});
	});

	describe("onCancel", () => {
		it("Closes the dialog", () => {
			component.onCancel();
			expect(dialogRef.close).toHaveBeenCalled();
		});
	});

	describe("onSaveSingle", () => {
		it("Calls the GroupService for creation", async () => {
			const expected = copy(group);
			expected.id = undefined;

			component.onSaveSingle();

			expect(groupService.createGroup).toHaveBeenCalled();
		});

		it("Success -> Closes the dialog and returns created group", async () => {
			component.onSaveSingle();
			expect(dialogRef.close).toHaveBeenCalledWith(group);
		});

		it("Success -> Shows snackbar to indicate success", async () => {
			component.onSaveSingle();
			expect(snackbar.open).toHaveBeenCalled();
		});
	});
});
