import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageNotFoundComponent } from "./page-not-found.component";
import { MaterialModule } from "../../../material/material.module";

@NgModule({
	declarations: [PageNotFoundComponent],
	imports: [ 
		CommonModule,
		MaterialModule
	],
	exports: [],
	providers: [],
})
export class SharedModule {}
