import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PointsOverviewComponent } from "./points-overview.component";

describe("PointsOverviewComponent", () => {
	let component: PointsOverviewComponent;
	let fixture: ComponentFixture<PointsOverviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ PointsOverviewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PointsOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
