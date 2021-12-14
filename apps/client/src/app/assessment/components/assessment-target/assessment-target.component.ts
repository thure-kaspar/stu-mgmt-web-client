import { CommonModule } from "@angular/common";
import { Component, Input, NgModule, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { Participant } from "@student-mgmt-client/domain-types";
import { CardComponentModule } from "@student-mgmt-client/shared-ui";
import { GroupDto, ParticipantDto } from "@student-mgmt/api-client";

@Component({
	selector: "student-mgmt-assessment-target",
	templateUrl: "./assessment-target.component.html",
	styleUrls: ["./assessment-target.component.scss"]
	//changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentTargetComponent implements OnInit {
	/** The group that was targeted by this assessment. */
	@Input() group?: GroupDto;
	/** The participant that was targeted by this assessment. */
	@Input() targetedParticipant?: ParticipantDto;
	/** The currently logged in participant. */
	@Input() participant: Participant;
	/** CourseId */
	@Input() courseId: string;

	constructor() {}

	ngOnInit(): void {}
}

@NgModule({
	declarations: [AssessmentTargetComponent],
	exports: [AssessmentTargetComponent],
	imports: [CommonModule, RouterModule, MatButtonModule, CardComponentModule, TranslateModule]
})
export class AssessmentTargetComponentModule {}
