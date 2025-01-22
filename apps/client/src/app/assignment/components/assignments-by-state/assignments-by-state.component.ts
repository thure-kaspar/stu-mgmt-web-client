import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { Course, Participant } from "@student-mgmt-client/domain-types";
import { AssignmentDto } from "@student-mgmt/api-client";
import { AssignmentCardComponentModule } from "../assignment-card/assignment-card.component";

@Component({
    selector: "student-mgmt-assignments-by-state",
    templateUrl: "./assignments-by-state.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AssignmentsByStateComponent {
	@Input() course!: Course;
	@Input() participant!: Participant;
	@Input() assignments!: AssignmentDto[];
	@Input() stateName!: string;
}

@NgModule({
	declarations: [AssignmentsByStateComponent],
	exports: [AssignmentsByStateComponent],
	imports: [CommonModule, AssignmentCardComponentModule]
})
export class AssignmentsByStateComponentModule {}
