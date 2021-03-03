import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AssessmentAllocationComponent } from "./assessment-allocation.component";

describe("AssessmentAllocationComponent", () => {
	let component: AssessmentAllocationComponent;
	let fixture: ComponentFixture<AssessmentAllocationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssessmentAllocationComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssessmentAllocationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
