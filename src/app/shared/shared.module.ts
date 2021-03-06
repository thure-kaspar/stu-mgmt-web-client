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
import { SemesterPipe } from "./pipes/semester.pipe";
import { SearchParticipantDialog } from "./components/dialogs/search-participant/search-participant.dialog";
import { ExtendedConfirmDialog } from "./components/dialogs/extended-confirm-dialog/extended-confirm-dialog.dialog";

@NgModule({
	declarations: [
		PageNotFoundComponent,
		ConfirmDialog,
		Paginator,
		SemesterPipe,
		SearchParticipantDialog,
		ExtendedConfirmDialog
	],
	imports: [CommonModule, AuthModule, MaterialModule, TranslateModule, FormsModule],
	exports: [
		CommonModule,
		AuthModule,
		MaterialModule,
		TranslateModule,
		FormsModule,
		ReactiveFormsModule,
		MatNativeDateModule,
		Paginator,
		SemesterPipe
	],
	providers: []
})
export class SharedModule {}
