import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AssignmentDto } from "@student-mgmt/api-client";

@Component({
	selector: "app-assignment-type-chip",
	templateUrl: "./assignment-type-chip.component.html",
	styleUrls: ["./assignment-type-chip.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentTypeChipComponent implements OnInit {
	@Input() type: AssignmentDto.TypeEnum;
	typeEnum = AssignmentDto.TypeEnum;

	constructor() {}

	ngOnInit(): void {}
}
