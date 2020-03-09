import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageNotFoundComponent } from "./page-not-found.component";
import { MaterialModule } from "../../../material/material.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [PageNotFoundComponent],
	imports: [ 
		CommonModule,
		MaterialModule
	],
	exports: [
		CommonModule,
		TranslateModule
	],
	providers: [],
})
export class SharedModule {}
