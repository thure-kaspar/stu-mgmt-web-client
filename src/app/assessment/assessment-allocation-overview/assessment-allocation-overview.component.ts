import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { getRouteParam } from "../../../../utils/helper";

@Component({
	selector: "app-assessment-allocation-overview",
	templateUrl: "./assessment-allocation-overview.component.html",
	styleUrls: ["./assessment-allocation-overview.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentAllocationOverviewComponent implements OnInit {

	courseId: string;
	assignmentId: string;

	constructor(private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.assignmentId = getRouteParam("assignmentId", this.route);
	}

}
