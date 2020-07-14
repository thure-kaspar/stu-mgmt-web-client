import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AssessmentForm } from "./assessment-form.component";

describe("AssessmentFormComponent", () => {
	let component: AssessmentForm;
	let fixture: ComponentFixture<AssessmentForm>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AssessmentForm ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssessmentForm);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
