import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PartialAssessmentComponent } from "./partial-assessment.component";

describe("PartialAssessmentComponent", () => {
	let component: PartialAssessmentComponent;
	let fixture: ComponentFixture<PartialAssessmentComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PartialAssessmentComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PartialAssessmentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
