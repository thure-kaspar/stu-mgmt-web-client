import { Component, ChangeDetectionStrategy } from "@angular/core";

/**
 * A generic card with the following slots (Content Projection):
 * - title
 * - subtitle
 * - menu (should contain a mat-icon-button with icon more_vert)
 * - content
 * - footer
 * @example 
 * <student-mgmt-card>
		<ng-container title>Assignment 01</ng-container>
		<ng-container subtitle>Hello World</ng-container>
		<ng-container menu>
			<button mat-icon-button><student-mgmt-icon name="more_vert"></student-mgmt-icon></button>
		</ng-container>
		<ng-container content>Lorem ipsum...</ng-container>
		<ng-container footer>
			<button mat-stroked-button>Submit</button>
		</ng-container>
	</student-mgmt-card>
 */
@Component({
	selector: "student-mgmt-card",
	templateUrl: "./card.component.html",
	styleUrls: ["./card.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@NgModule({
	declarations: [CardComponent],
	exports: [CardComponent],
	imports: [CommonModule]
})
export class CardComponentModule {}
