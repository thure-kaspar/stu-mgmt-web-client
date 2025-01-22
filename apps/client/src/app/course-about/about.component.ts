import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { CardComponentModule, CourseRoleChipComponentModule } from "@student-mgmt-client/shared-ui";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import { CourseAboutDto, CourseApi } from "@student-mgmt/api-client";
import { Observable } from "rxjs";

@Component({
    selector: "student-mgmt-about",
    templateUrl: "./about.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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

@NgModule({
	declarations: [AboutComponent],
	exports: [AboutComponent],
	imports: [CommonModule, TranslateModule, CardComponentModule, CourseRoleChipComponentModule]
})
export class AboutComponentModule {}
