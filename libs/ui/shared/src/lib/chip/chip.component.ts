import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { IconComponentModule } from "../icon.component";

@Component({
	selector: "app-chip",
	templateUrl: "./chip.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipComponent {
	@Input() icon?: string;
	@Input() text!: string;
	@Input() color?: "primary" | "accent" | "warn" | string;

	constructor() {}
}

@NgModule({
	declarations: [ChipComponent],
	exports: [ChipComponent],
	imports: [CommonModule, IconComponentModule]
})
export class ChipComponentModule {}
