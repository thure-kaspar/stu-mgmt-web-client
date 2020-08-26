import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchGroupDialog } from "./search-group.dialog";

describe("SearchGroupDialog", () => {
	let component: SearchGroupDialog;
	let fixture: ComponentFixture<SearchGroupDialog>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SearchGroupDialog ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchGroupDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
