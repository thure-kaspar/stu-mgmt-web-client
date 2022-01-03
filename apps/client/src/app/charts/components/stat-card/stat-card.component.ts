import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
	selector: "student-mgmt-stat-card",
	templateUrl: "./stat-card.component.html",
	styleUrls: ["./stat-card.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
	@Input() title: string;
	@Input() value: string | number;
}
