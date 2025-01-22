import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, HostBinding, NgModule } from "@angular/core";

@Component({
    selector: "student-mgmt-simple-chip",
    templateUrl: "./simple-chip.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SimpleChipComponent {
	// Background color is set by parent component
	// This prevents background from overflowing the chip (thereby removing rounded border)
	@HostBinding("class.bg-clip-text") cssClass = true;
}

@NgModule({
	imports: [CommonModule],
	declarations: [SimpleChipComponent],
	exports: [SimpleChipComponent]
})
export class SimpleChipComponentModule {}
