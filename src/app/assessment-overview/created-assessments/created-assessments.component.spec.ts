import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreatedAssessmentsComponent } from "./created-assessments.component";

describe("CreatedAssessmentsComponent", () => {
	let component: CreatedAssessmentsComponent;
	let fixture: ComponentFixture<CreatedAssessmentsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ CreatedAssessmentsComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CreatedAssessmentsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
