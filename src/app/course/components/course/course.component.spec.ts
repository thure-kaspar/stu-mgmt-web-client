import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseComponent } from "./course.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";

describe("CourseComponent", () => {
	let component: CourseComponent;
	let fixture: ComponentFixture<CourseComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CourseComponent],
			imports: [SharedModule],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CourseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
