import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditGroupDialog } from "./edit-group.dialog";

describe("EditGroupDialog", () => {
	let component: EditGroupDialog;
	let fixture: ComponentFixture<EditGroupDialog>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EditGroupDialog]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EditGroupDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
