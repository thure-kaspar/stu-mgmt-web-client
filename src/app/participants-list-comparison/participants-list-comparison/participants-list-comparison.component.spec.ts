import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ParticipantsListComparisonComponent } from "./participants-list-comparison.component";

describe("ParticipantsListComparisonComponent", () => {
	let component: ParticipantsListComparisonComponent;
	let fixture: ComponentFixture<ParticipantsListComparisonComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ParticipantsListComparisonComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ParticipantsListComparisonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
