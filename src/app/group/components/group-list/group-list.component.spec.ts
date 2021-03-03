import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GroupListComponent } from "./group-list.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { MatDialog } from "@angular/material/dialog";
import { GroupDto, GroupsService } from "../../../../../api";
import { of } from "rxjs";

const group: GroupDto = {
	id: "aee1ee84-d5db-40ab-a948-eb82fdd2a6a5",
	courseId: "java-wise1920",
	name: "Test Group 01",
	isClosed: false
};

const mock_GroupService = () => ({
	getGroupsOfCourse: jest.fn().mockImplementation(() => of([])) // Observable of empty group array
});

// Mock the MatDialogRef-class returned by MatDialog.open
class MockMatDialogRefClass {
	afterClosed(): any {
		return null;
	}
}

// Mock the implementation so it returns an observable of type GroupDto
const mock_MatDialogRef = new MockMatDialogRefClass();
mock_MatDialogRef.afterClosed = jest.fn().mockImplementation(() => of(group));

const mock_MatDialog = () => ({
	open: jest.fn().mockReturnValue(mock_MatDialogRef)
});

describe("GroupListComponent", () => {
	let component: GroupListComponent;
	let fixture: ComponentFixture<GroupListComponent>;
	let groupService: GroupsService;
	let dialog: MatDialog;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [GroupListComponent],
			providers: [
				{ provide: GroupsService, useFactory: mock_GroupService },
				{ provide: MatDialog, useFactory: mock_MatDialog }
			],
			imports: [SharedModule],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GroupListComponent);
		component = fixture.componentInstance;
		component.groups = [];
		component.courseId = group.courseId;
		groupService = fixture.debugElement.injector.get(GroupsService);
		dialog = fixture.debugElement.injector.get(MatDialog);

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	describe("ngOnInit", () => {
		it("Calls GroupService to load groups of course", async () => {
			expect(groupService.getGroupsOfCourse).toHaveBeenCalledWith(component.courseId);
		});
	});

	describe("openAddDialog", () => {
		it("Opens the CreateGroupDialog", () => {
			component.openAddDialog();
			expect(dialog.open).toHaveBeenCalled();
		});

		it("After Closed: Success -> Adds created group to groups", () => {
			component.openAddDialog();
			expect(mock_MatDialogRef.afterClosed).toHaveBeenCalled();
			expect(component.groups).toContain(group);
		});
	});
});
