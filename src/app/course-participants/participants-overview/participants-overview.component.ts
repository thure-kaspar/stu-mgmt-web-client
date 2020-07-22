import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { getRouteParam } from "../../../../utils/helper";

@Component({
	selector: "app-participants-overview",
	templateUrl: "./participants-overview.component.html",
	styleUrls: ["./participants-overview.component.scss"]
})
export class ParticipantsOverviewComponent implements OnInit {

	courseId: string;

	constructor(private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
	}

}
