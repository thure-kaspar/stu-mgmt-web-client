import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { getRouteParam } from "@student-mgmt-client/util-helper";

@Component({
	selector: "app-participants-overview",
	templateUrl: "./participants-overview.component.html",
	styleUrls: ["./participants-overview.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantsOverviewComponent implements OnInit {
	courseId: string;

	constructor(private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
	}
}

@NgModule({
	declarations: [ParticipantsOverviewComponent],
	exports: [ParticipantsOverviewComponent],
	imports: [CommonModule, RouterModule, MatTabsModule, TranslateModule]
})
export class ParticipantsOverviewComponentModule {}
