import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AdmissionStatusComponent } from "./admission-status.component";

describe("AdmissionStatusComponent", () => {
	let component: AdmissionStatusComponent;
	let fixture: ComponentFixture<AdmissionStatusComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AdmissionStatusComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdmissionStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
