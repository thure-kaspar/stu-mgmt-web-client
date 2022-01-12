import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
	selector: "student-mgmt-stat-card",
	templateUrl: "./stat-card.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
	@Input() title: string;
	@Input() value: string | number;
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@NgModule({
	declarations: [StatCardComponent],
	exports: [StatCardComponent],
	imports: [CommonModule]
})
export class StatCardComponentModule {}
