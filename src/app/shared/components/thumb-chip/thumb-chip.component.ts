import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

/**
 * Component that uses the `app-chip` component to display a chip with a `thumb_up` or `thumb_down`
 * icon and green/red background color depending on the given `condition`.
 * @input condition `boolean`
 */
@Component({
	selector: "app-thumb-chip",
	templateUrl: "./thumb-chip.component.html",
	styleUrls: ["./thumb-chip.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThumbChipComponent {
	@Input() condition: boolean;
}
