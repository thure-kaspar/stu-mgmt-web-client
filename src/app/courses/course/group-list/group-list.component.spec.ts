import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupListComponent } from "./group-list.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";

describe("GroupListComponent", () => {
	let component: GroupListComponent;
	let fixture: ComponentFixture<GroupListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [GroupListComponent],
			imports: [SharedModule],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GroupListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
