import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { UserListComponent } from "./user-list.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";

describe("UserListComponent", () => {

	let component: UserListComponent;
	let fixture: ComponentFixture<UserListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UserListComponent],
			imports: [SharedModule],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
