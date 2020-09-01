import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ParticipantAssessmentsComponent } from "./participant-assessments.component";

describe("ParticipantAssessmentsComponent", () => {
	let component: ParticipantAssessmentsComponent;
	let fixture: ComponentFixture<ParticipantAssessmentsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ParticipantAssessmentsComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ParticipantAssessmentsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
