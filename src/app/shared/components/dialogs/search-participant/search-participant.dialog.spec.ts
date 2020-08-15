import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchParticipantDialog } from "./search-participant.dialog";

describe("SearchParticipantDialog", () => {
	let component: SearchParticipantDialog;
	let fixture: ComponentFixture<SearchParticipantDialog>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SearchParticipantDialog ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchParticipantDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
