import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateGroupMultipleComponent } from "./create-group-multiple.component";

describe("CreateGroupMultipleComponent", () => {
	let component: CreateGroupMultipleComponent;
	let fixture: ComponentFixture<CreateGroupMultipleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CreateGroupMultipleComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateGroupMultipleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
