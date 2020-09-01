import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AdmissionRuleComponent } from "./admission-rule.component";

describe("AdmissionRuleComponent", () => {
	let component: AdmissionRuleComponent;
	let fixture: ComponentFixture<AdmissionRuleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AdmissionRuleComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdmissionRuleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
