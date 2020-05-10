import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { JoinCourseDialog } from "./join-course.dialog";

describe("JoinCourseDialog", () => {
	let component: JoinCourseDialog;
	let fixture: ComponentFixture<JoinCourseDialog>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ JoinCourseDialog ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JoinCourseDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
