import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchCourseDialog } from "./search-course.dialog";

describe("SearchCourseDialog", () => {
	let component: SearchCourseDialog;
	let fixture: ComponentFixture<SearchCourseDialog>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SearchCourseDialog ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchCourseDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
