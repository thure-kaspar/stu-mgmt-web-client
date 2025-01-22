import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SimpleChipComponentModule } from "../simple-chip/simple-chip.component";

/**
 * Component that uses the `app-chip` component to display a chip with a `thumb_up` or `thumb_down`
 * icon and green/red background color depending on the given `condition`.
 * @input condition `boolean`
 */
@Component({
    selector: "student-mgmt-thumb-chip",
    templateUrl: "./thumb-chip.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ThumbChipComponent {
	@Input() condition!: boolean;
}

@NgModule({
	declarations: [ThumbChipComponent],
	exports: [ThumbChipComponent],
	imports: [CommonModule, SimpleChipComponentModule, TranslateModule]
})
export class ThumbChipComponentModule {}
