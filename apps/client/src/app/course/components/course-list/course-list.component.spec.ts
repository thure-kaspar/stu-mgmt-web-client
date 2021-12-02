import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseListComponent } from "./course-list.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";

describe("CourseListComponent", () => {
	let component: CourseListComponent;
	let fixture: ComponentFixture<CourseListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CourseListComponent],
			imports: [SharedModule],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CourseListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
