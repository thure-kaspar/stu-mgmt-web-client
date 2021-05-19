import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { CourseAboutDto, CourseService } from "../../../../../api";
import { getRouteParam } from "../../../../../utils/helper";

@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
	about$: Observable<CourseAboutDto>;

	courseId: string;

	constructor(private courseService: CourseService, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.about$ = this.courseService.getCourseAbout(this.courseId);
	}
}
