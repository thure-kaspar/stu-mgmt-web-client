import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AssessmentTargetPickerComponent } from "./assessment-target-picker.component";

describe("AssessmentTargetPickerComponent", () => {
	let component: AssessmentTargetPickerComponent;
	let fixture: ComponentFixture<AssessmentTargetPickerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssessmentTargetPickerComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssessmentTargetPickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
