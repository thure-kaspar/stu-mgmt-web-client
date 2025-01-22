import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	Output
} from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ParticipantDto } from "@student-mgmt/api-client";
import { PersonIconComponentModule } from "../person-icon/person-icon.component";

@Component({
    selector: "student-mgmt-person-list",
    templateUrl: "./person-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PersonListComponent {
	@Input() participants!: ParticipantDto[];
	@Input() displayRemoveButton = false;
	@Output() removeClicked = new EventEmitter<ParticipantDto>();
}

@NgModule({
	imports: [CommonModule, TranslateModule, PersonIconComponentModule],
	declarations: [PersonListComponent],
	exports: [PersonListComponent]
})
export class PersonListComponentModule {}
