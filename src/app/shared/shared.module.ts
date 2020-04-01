import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "../material/material.module";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { AuthModule } from "../auth/auth.module";
import { ConfirmDialogComponent } from "./components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
	declarations: [
		PageNotFoundComponent, 
		ConfirmDialogComponent
	],
	imports: [ 
		CommonModule,
		BrowserAnimationsModule,
		AuthModule,
		MaterialModule,
		TranslateModule
	],
	exports: [
		CommonModule,
		BrowserAnimationsModule,
		AuthModule,
		MaterialModule,
		TranslateModule
	],
	providers: [],
})
export class SharedModule {}
