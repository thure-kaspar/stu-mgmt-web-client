import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchAssignmentDialog } from "./search-assignment.dialog";

describe("SearchAssignmentDialog", () => {
	let component: SearchAssignmentDialog;
	let fixture: ComponentFixture<SearchAssignmentDialog>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SearchAssignmentDialog]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchAssignmentDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
