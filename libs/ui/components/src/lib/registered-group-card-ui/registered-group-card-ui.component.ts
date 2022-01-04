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
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import {
	CardComponentModule,
	IconComponentModule,
	PersonListComponentModule
} from "@student-mgmt-client/shared-ui";
import { GroupDto, ParticipantDto } from "@student-mgmt/api-client";

@Component({
	selector: "student-mgmt-registered-group-card-ui",
	templateUrl: "./registered-group-card-ui.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisteredGroupCardUiComponent {
	@Input() group!: GroupDto;
	@Input() courseId!: string;
	@Output() addMemberClicked = new EventEmitter<GroupDto>();
	@Output() removeMemberClicked = new EventEmitter<ParticipantDto>();
	@Output() removeRegistrationClicked = new EventEmitter<GroupDto>();
}

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MatMenuModule,
		MatButtonModule,
		TranslateModule,
		PersonListComponentModule,
		CardComponentModule,
		IconComponentModule
	],
	declarations: [RegisteredGroupCardUiComponent],
	exports: [RegisteredGroupCardUiComponent]
})
export class RegisteredGroupCardUiComponentModule {}
