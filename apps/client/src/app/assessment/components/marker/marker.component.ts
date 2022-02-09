import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { ChipComponentModule } from "@student-mgmt-client/shared-ui";
import { MarkerDto } from "@student-mgmt/api-client";

@Component({
	selector: "student-mgmt-marker",
	templateUrl: "./marker.component.html",
	styleUrls: ["./marker.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkerComponent {
	@Input() marker: MarkerDto;
	severityEnum = MarkerDto.SeverityEnum;
}

@NgModule({
	declarations: [MarkerComponent],
	exports: [MarkerComponent],
	imports: [CommonModule, ChipComponentModule]
})
export class MarkerComponentModule {}
