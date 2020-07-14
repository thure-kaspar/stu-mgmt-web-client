import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AssessmentAllocationOverviewComponent } from "./assessment-allocation-overview.component";

describe("AssessmentAllocationOverviewComponent", () => {
	let component: AssessmentAllocationOverviewComponent;
	let fixture: ComponentFixture<AssessmentAllocationOverviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssessmentAllocationOverviewComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssessmentAllocationOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
