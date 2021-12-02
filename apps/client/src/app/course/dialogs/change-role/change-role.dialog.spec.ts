import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChangeRoleDialog } from "./change-role.dialog";

describe("ChangeRoleDialog", () => {
	let component: ChangeRoleDialog;
	let fixture: ComponentFixture<ChangeRoleDialog>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ChangeRoleDialog]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ChangeRoleDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
