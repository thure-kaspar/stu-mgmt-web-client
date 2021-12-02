import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AssessmentTargetComponent } from "./assessment-target.component";

describe("AssessmentTargetComponent", () => {
	let component: AssessmentTargetComponent;
	let fixture: ComponentFixture<AssessmentTargetComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssessmentTargetComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssessmentTargetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
