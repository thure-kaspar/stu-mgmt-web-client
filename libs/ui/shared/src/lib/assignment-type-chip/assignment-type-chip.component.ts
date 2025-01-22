import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentDto } from "@student-mgmt/api-client";
import { SimpleChipComponentModule } from "../simple-chip/simple-chip.component";
import { ChipComponentModule } from "../chip/chip.component";

@Component({
    selector: "student-mgmt-assignment-type-chip",
    templateUrl: "./assignment-type-chip.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AssignmentTypeChipComponent {
	@Input() type!: AssignmentDto.TypeEnum;
	typeEnum = AssignmentDto.TypeEnum;
}

@NgModule({
	declarations: [AssignmentTypeChipComponent],
	exports: [AssignmentTypeChipComponent],
	imports: [CommonModule, ChipComponentModule, SimpleChipComponentModule, TranslateModule]
})
export class AssignmentTypeChipComponentModule {}
