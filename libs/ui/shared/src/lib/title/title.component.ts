import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

@Component({
    selector: "student-mgmt-title",
    templateUrl: "./title.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TitleComponent {
	@Input() title!: string;
}

@NgModule({
	imports: [CommonModule, MatCardModule],
	declarations: [TitleComponent],
	exports: [TitleComponent]
})
export class TitleComponentModule {}
