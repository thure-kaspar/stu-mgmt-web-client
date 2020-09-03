import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UpdateUserDialog } from "./update-user.dialog";

describe("ChangeRoleDialog", () => {
	let component: UpdateUserDialog;
	let fixture: ComponentFixture<UpdateUserDialog>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ UpdateUserDialog ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UpdateUserDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
