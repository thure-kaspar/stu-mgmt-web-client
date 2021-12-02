import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { CourseAboutDto, CourseApi } from "@student-mgmt/api-client";
import { getRouteParam } from "@student-mgmt-client/util-helper";

@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
	about$: Observable<CourseAboutDto>;

	courseId: string;

	constructor(private courseApi: CourseApi, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.about$ = this.courseApi.getCourseAbout(this.courseId);
	}
}
