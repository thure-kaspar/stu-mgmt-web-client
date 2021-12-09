import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentDto } from "@student-mgmt/api-client";
import { ChipComponentModule } from "../chip/chip.component";

@Component({
	selector: "app-assignment-type-chip",
	templateUrl: "./assignment-type-chip.component.html",
	styleUrls: ["./assignment-type-chip.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentTypeChipComponent {
	@Input() type!: AssignmentDto.TypeEnum;
	typeEnum = AssignmentDto.TypeEnum;
}

@NgModule({
	declarations: [AssignmentTypeChipComponent],
	exports: [AssignmentTypeChipComponent],
	imports: [CommonModule, ChipComponentModule, TranslateModule]
})
export class AssignmentTypeChipComponentModule {}
