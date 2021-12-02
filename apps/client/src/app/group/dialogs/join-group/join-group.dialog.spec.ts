import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { JoinGroupDialog } from "./join-group.dialog";

describe("JoinGroupDialog", () => {
	let component: JoinGroupDialog;
	let fixture: ComponentFixture<JoinGroupDialog>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [JoinGroupDialog]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JoinGroupDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
