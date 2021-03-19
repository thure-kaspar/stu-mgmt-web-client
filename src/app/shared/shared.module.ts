import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { TranslateModule } from "@ngx-translate/core";
import { AuthModule } from "../auth/auth.module";
import { ChartsModule } from "../charts/charts.module";
import { MaterialModule } from "../material/material.module";
import { ConfirmDialog } from "./components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { ExtendedConfirmDialog } from "./components/dialogs/extended-confirm-dialog/extended-confirm-dialog.dialog";
import { SearchParticipantDialog } from "./components/dialogs/search-participant/search-participant.dialog";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { Paginator } from "./paginator/paginator.component";
import { SemesterPipe } from "./pipes/semester.pipe";

@NgModule({
	declarations: [
		PageNotFoundComponent,
		ConfirmDialog,
		Paginator,
		SemesterPipe,
		SearchParticipantDialog,
		ExtendedConfirmDialog
	],
	imports: [CommonModule, AuthModule, MaterialModule, TranslateModule, FormsModule, ChartsModule],
	exports: [
		CommonModule,
		AuthModule,
		MaterialModule,
		TranslateModule,
		FormsModule,
		ReactiveFormsModule,
		MatNativeDateModule,
		ChartsModule,
		Paginator,
		SemesterPipe
	],
	providers: []
})
export class SharedModule {}
