import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AssignmentDto } from "@student-mgmt/api-client";

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

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChipComponentModule } from "../..";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [AssignmentTypeChipComponent],
	exports: [AssignmentTypeChipComponent],
	imports: [CommonModule, ChipComponentModule, TranslateModule]
})
export class AssignmentTypeChipComponentModule {}
