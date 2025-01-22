import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ParticipantDto } from "@student-mgmt/api-client";
import { SimpleChipComponentModule } from "../simple-chip/simple-chip.component";

@Component({
    selector: "student-mgmt-course-role-chip",
    templateUrl: "./course-role-chip.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CourseRoleChipComponent {
	@Input() role!: ParticipantDto.RoleEnum;
	_enum = ParticipantDto.RoleEnum;
}

@NgModule({
	imports: [CommonModule, TranslateModule, SimpleChipComponentModule],
	declarations: [CourseRoleChipComponent],
	exports: [CourseRoleChipComponent]
})
export class CourseRoleChipComponentModule {}
