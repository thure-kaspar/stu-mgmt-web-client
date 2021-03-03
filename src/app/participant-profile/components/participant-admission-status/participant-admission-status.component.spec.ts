import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ParticipantAdmissionStatusComponent } from "./participant-admission-status.component";

describe("ParticipantAdmissionStatusComponent", () => {
	let component: ParticipantAdmissionStatusComponent;
	let fixture: ComponentFixture<ParticipantAdmissionStatusComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ParticipantAdmissionStatusComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ParticipantAdmissionStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
