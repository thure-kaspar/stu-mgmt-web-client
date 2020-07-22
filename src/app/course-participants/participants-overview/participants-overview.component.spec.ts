import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ParticipantsOverviewComponent } from "./participants-overview.component";

describe("ParticipantsOverviewComponent", () => {
	let component: ParticipantsOverviewComponent;
	let fixture: ComponentFixture<ParticipantsOverviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ParticipantsOverviewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ParticipantsOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
