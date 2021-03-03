import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { UserListComponent } from "./user-list.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { of, Observable, throwError } from "rxjs";
import { UserDto, CoursesService, ParticipantDto } from "../../../../api";
import { SharedModule } from "../../shared/shared.module";
import { copy } from "../../../../utils/object-helper";

const mockUsers: UserDto[] = [];
const oldRole: ParticipantDto.RoleEnum = "STUDENT";
const newRole: ParticipantDto.RoleEnum = "TUTOR";

// Mock the MatDialogRef-class returned by MatDialog.open
class ConfirmDialog_Confirmed {
	afterClosed(): Observable<boolean> {
		return of(true); // The user confirmed the action
	}
}

class ConfirmDialog_Denied {
	afterClosed(): Observable<boolean> {
		return of(false); // The user canceled the action
	}
}

class ChangeRoleDialog_NewRole {
	afterClosed(): Observable<ParticipantDto.RoleEnum> {
		return of(newRole); // The user canceled the action
	}
}

class ChangeRoleDialog_Canceled {
	afterClosed(): Observable<any> {
		return of(null); // The user canceled the action
	}
}

const mock_CourseService = () => ({
	getUsersOfCourse: jest.fn().mockImplementation(() => of(mockUsers)),
	removeUser: jest.fn().mockImplementation(() => of(true))
});

const mock_MatDialog = () => ({
	open: jest.fn().mockReturnValue(new ConfirmDialog_Confirmed())
});

const mock_MatSnackbar = () => ({
	open: jest.fn()
});

describe("UserListComponent", () => {
	let component: UserListComponent;
	let fixture: ComponentFixture<UserListComponent>;
	let courseService: CoursesService;
	let dialog: MatDialog;
	let snackbar: MatSnackBar;
	let user: UserDto;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UserListComponent],
			imports: [SharedModule],
			providers: [
				{ provide: CoursesService, useFactory: mock_CourseService },
				{ provide: MatDialog, useFactory: mock_MatDialog },
				{ provide: MatSnackBar, useFactory: mock_MatSnackbar }
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserListComponent);
		component = fixture.componentInstance;
		courseService = fixture.debugElement.injector.get(CoursesService);
		dialog = fixture.debugElement.injector.get(MatDialog);
		snackbar = fixture.debugElement.injector.get(MatSnackBar);

		component.courseId = "course_id_1";
		user = {
			id: "user_id_1",
			email: "user.one@test.email",
			role: "USER",
			courseRole: oldRole,
			displayName: "mMustermann",
			username: "mustermann"
		};

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	describe("ngOnInit", () => {
		it("Calls CourseService to load users and assigns them", async () => {
			expect(courseService.getUsersOfCourse).toHaveBeenCalledWith(component.courseId);
			expect(component.participant).toEqual(mockUsers);
		});
	});

	describe("openChangeRoleDialog", () => {
		it("Opens the ChangeRoleDialog", async () => {
			component.openChangeRoleDialog(user);
			expect(dialog.open).toHaveBeenCalled();
		});

		it("User selects a role -> Role is assigned to user", async () => {
			console.assert(user.courseRole !== newRole, "User should have a different role");
			dialog.open = jest.fn().mockReturnValueOnce(new ChangeRoleDialog_NewRole());

			component.openChangeRoleDialog(user);

			expect(user.courseRole).toEqual(newRole);
		});

		it("User cancels -> No changes", async () => {
			const oldRole = copy(user.courseRole);
			dialog.open = jest.fn().mockReturnValueOnce(new ChangeRoleDialog_Canceled());

			component.openChangeRoleDialog(user);

			expect(user.courseRole).toEqual(oldRole);
		});
	});

	describe("openRemoveDialog", () => {
		it("User confirms -> Calls CourseService for removal", async () => {
			courseService.removeUser = jest.fn().mockImplementation(() => of(true)); // Successful removal
			dialog.open = jest.fn().mockReturnValueOnce(new ConfirmDialog_Confirmed());
			component.participant = [user]; // Course contains this user

			component.openRemoveDialog(user);

			expect(courseService.removeUser).toHaveBeenCalledWith(component.courseId, user.id);
		});

		it("User confirms -> User gets removed from user list", async () => {
			courseService.removeUser = jest.fn().mockImplementation(() => of(true)); // Successful removal
			dialog.open = jest.fn().mockReturnValueOnce(new ConfirmDialog_Confirmed());
			component.participant = [user]; // Course contains this user

			component.openRemoveDialog(user);

			expect(component.participant.length).toEqual(0); // User should be removed
		});

		it("User confirms + Server throws error -> Shows error (no changes)", async () => {
			courseService.removeUser = jest.fn().mockImplementation(() => {
				return throwError(new Error()); // Server throws error
			});
			dialog.open = jest.fn().mockReturnValueOnce(new ConfirmDialog_Confirmed());
			component.participant = [user]; // Course contains this user

			component.openRemoveDialog(user);

			expect(component.participant.length).toEqual(1); // User should remain in the course
			expect(snackbar.open).toHaveBeenCalled();
		});

		it("User cancels -> No changes", async () => {
			dialog.open = jest.fn().mockReturnValueOnce(new ConfirmDialog_Denied());
			component.participant = [user]; // Course contains this user

			component.openRemoveDialog(user);

			expect(component.participant.length).toEqual(1); // User should remain in the course
		});
	});
});
