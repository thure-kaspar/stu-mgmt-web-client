import { Component, Input, OnInit } from "@angular/core";
import { GroupDto, ParticipantDto } from "@student-mgmt/api-client";
import { Participant } from "../../../domain/participant.model";

@Component({
	selector: "app-assessment-target",
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
