import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateGroupStudentDialog } from "./create-group-student.dialog";

describe("CreateGroupStudentDialog", () => {
	let component: CreateGroupStudentDialog;
	let fixture: ComponentFixture<CreateGroupStudentDialog>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ CreateGroupStudentDialog ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateGroupStudentDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
