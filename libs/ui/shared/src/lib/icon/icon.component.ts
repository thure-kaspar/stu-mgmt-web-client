import { CommonModule } from "@angular/common";
import { Component, Input, NgModule, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "student-mgmt-icon",
    template: `<svg
		class="fill-current"
		[ngStyle]="{ height: size + 'px', width: size + 'px' }"
		style="display: inline-block; margin-top: -2px; vertical-align: middle; position: relative;"
	>
		<use [attr.href]="'assets/icons/sprites.svg#' + name"></use>
	</svg>`,
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class IconComponent {
	@Input() name!: string;
	@Input() size = "24";
}

@NgModule({
	declarations: [IconComponent],
	exports: [IconComponent],
	imports: [CommonModule]
})
export class IconComponentModule {}
