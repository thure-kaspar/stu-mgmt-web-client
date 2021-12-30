import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { ParticipantDto } from "@student-mgmt/api-client";
import { PersonIconComponentModule } from "../person-icon/person-icon.component";

@Component({
	selector: "student-mgmt-person-list",
	templateUrl: "./person-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonListComponent {
	@Input() participants!: ParticipantDto[];
}

@NgModule({
	imports: [CommonModule, PersonIconComponentModule],
	declarations: [PersonListComponent],
	exports: [PersonListComponent]
})
export class PersonListComponentModule {}
