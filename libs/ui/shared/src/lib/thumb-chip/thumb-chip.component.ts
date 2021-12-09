import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

/**
 * Component that uses the `app-chip` component to display a chip with a `thumb_up` or `thumb_down`
 * icon and green/red background color depending on the given `condition`.
 * @input condition `boolean`
 */
@Component({
	selector: "app-thumb-chip",
	templateUrl: "./thumb-chip.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThumbChipComponent {
	@Input() condition!: boolean;
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChipComponentModule } from "../chip/chip.component";

@NgModule({
	declarations: [ThumbChipComponent],
	exports: [ThumbChipComponent],
	imports: [CommonModule, ChipComponentModule]
})
export class ThumbChipComponentModule {}
