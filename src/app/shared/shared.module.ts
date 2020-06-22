import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "../material/material.module";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { AuthModule } from "../auth/auth.module";
import { ConfirmDialog } from "./components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { Paginator } from "./paginator/paginator.component";

@NgModule({
	declarations: [
		PageNotFoundComponent, 
		ConfirmDialog,
		Paginator
	],
	imports: [ 
		CommonModule,
		AuthModule,
		MaterialModule,
		TranslateModule
	],
	exports: [
		CommonModule,
		AuthModule,
		MaterialModule,
		TranslateModule,
		FormsModule,
		ReactiveFormsModule,
		MatNativeDateModule,
		Paginator
	],
	providers: [],
})
export class SharedModule {}
