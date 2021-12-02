import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RegisteredGroupsComponent } from "./registered-groups.component";

describe("RegisteredGroupsComponent", () => {
	let component: RegisteredGroupsComponent;
	let fixture: ComponentFixture<RegisteredGroupsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RegisteredGroupsComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RegisteredGroupsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
