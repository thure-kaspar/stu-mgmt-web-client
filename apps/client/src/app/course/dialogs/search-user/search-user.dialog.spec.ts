import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchUserDialog } from "./search-user.dialog";

describe("SearchUserDialog", () => {
	let component: SearchUserDialog;
	let fixture: ComponentFixture<SearchUserDialog>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SearchUserDialog]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchUserDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
