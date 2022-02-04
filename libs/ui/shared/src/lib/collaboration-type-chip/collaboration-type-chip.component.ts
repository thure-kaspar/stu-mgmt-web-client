import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentDto } from "@student-mgmt/api-client";
import { SimpleChipComponentModule } from "../simple-chip/simple-chip.component";

@Component({
	selector: "student-mgmt-collaboration-type-chip",
	templateUrl: "./collaboration-type-chip.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollaborationTypeChipComponent {
	@Input() collaborationType!: AssignmentDto.CollaborationEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;
}

@NgModule({
	imports: [CommonModule, TranslateModule, SimpleChipComponentModule],
	declarations: [CollaborationTypeChipComponent],
	exports: [CollaborationTypeChipComponent]
})
export class CollaborationTypeChipComponentModule {}
