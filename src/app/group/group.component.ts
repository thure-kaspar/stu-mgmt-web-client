import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { getRouteParam } from "../../../utils/helper";
import { CourseFacade } from "../course/services/course.facade";

@Component({
	selector: "app-name",
	template: "<router-outlet></router-outlet>",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupComponent implements OnInit {

	constructor(private courseFacade: CourseFacade,
				private route: ActivatedRoute) { }

	ngOnInit(): void {
		const courseId = getRouteParam("courseId", this.route);
		this.courseFacade.loadGroupSettings(courseId);
	}

}
