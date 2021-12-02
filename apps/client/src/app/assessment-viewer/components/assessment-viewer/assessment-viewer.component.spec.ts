import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AssessmentViewerComponent } from "./assessment-viewer.component";

describe("AssessmentViewerComponent", () => {
	let component: AssessmentViewerComponent;
	let fixture: ComponentFixture<AssessmentViewerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssessmentViewerComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssessmentViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
