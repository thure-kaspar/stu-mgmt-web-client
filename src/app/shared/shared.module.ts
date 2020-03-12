import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "../material/material.module";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { AuthModule } from "../auth/auth.module";

@NgModule({
	declarations: [PageNotFoundComponent],
	imports: [ 
		CommonModule,
		AuthModule,
		MaterialModule
	],
	exports: [
		CommonModule,
		AuthModule,
		TranslateModule
	],
	providers: [],
})
export class SharedModule {}
