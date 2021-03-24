import { Component, ChangeDetectionStrategy } from "@angular/core";

/**
 * A generic card with the following slots (Content Projection):
 * - title
 * - subtitle
 * - menu (should contain a mat-icon-button with icon more_vert)
 * - footer
 * @example 
 * <app-card>
		<ng-container title>Assignment 01</ng-container>
		<ng-container subtitle>Hello World</ng-container>
		<ng-container menu>
			<button mat-icon-button><mat-icon>more_vert</mat-icon></button>
		</ng-container>
		<ng-container content>Lorem ipsum...</ng-container>
		<ng-container footer>
			<button mat-stroked-button>Submit</button>
		</ng-container>
	</app-card>
 */
@Component({
	selector: "app-card",
	templateUrl: "./card.component.html",
	styleUrls: ["./card.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
	constructor() {}
}
