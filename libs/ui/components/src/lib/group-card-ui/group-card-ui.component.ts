import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	Output
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { Participant } from "@student-mgmt-client/domain-types";
import {
	CardComponentModule,
	IconComponentModule,
	PersonListComponentModule,
	SimpleChipComponentModule
} from "@student-mgmt-client/shared-ui";
import { CourseDto, GroupDto } from "@student-mgmt/api-client";

export type GroupCardUiComponentProps = {
	group: GroupDto;
	course: CourseDto;
	participant: Participant;
	isJoinable: boolean;
};

@Component({
    selector: "student-mgmt-group-card-ui",
    templateUrl: "./group-card-ui.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class GroupCardUiComponent {
	@Input() props!: GroupCardUiComponentProps;

	@Output() joinClicked = new EventEmitter<void>();
	@Output() addParticipantClicked = new EventEmitter<void>();
	@Output() removeGroupClicked = new EventEmitter<void>();
}

@NgModule({
	declarations: [GroupCardUiComponent],
	exports: [GroupCardUiComponent],
	imports: [
		CommonModule,
		RouterModule,
		MatCardModule,
		MatButtonModule,
		MatMenuModule,
		TranslateModule,
		CardComponentModule,
		SimpleChipComponentModule,
		IconComponentModule,
		PersonListComponentModule
	]
})
export class GroupCardUiComponentModule {}
