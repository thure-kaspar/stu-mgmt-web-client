import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { TranslateModule } from "@ngx-translate/core";
import { AuthModule } from "../auth/auth.module";
import { MaterialModule } from "../material/material.module";
import { CardComponent } from "./components/card/card.component";
import { ChipComponent } from "./components/chip/chip.component";
import { ConfirmDialog } from "./components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { ExtendedConfirmDialog } from "./components/dialogs/extended-confirm-dialog/extended-confirm-dialog.dialog";
import { SearchParticipantDialog } from "./components/dialogs/search-participant/search-participant.dialog";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { Paginator } from "./paginator/paginator.component";
import { SemesterPipe } from "./pipes/semester.pipe";
import { AssignmentTypeChipComponent } from "./components/assignment-type-chip/assignment-type-chip.component";
import { ThumbChipComponent } from "./components/thumb-chip/thumb-chip.component";

@NgModule({
	declarations: [
		PageNotFoundComponent,
		ConfirmDialog,
		Paginator,
		SemesterPipe,
		SearchParticipantDialog,
		ExtendedConfirmDialog,
		CardComponent,
		ChipComponent,
		AssignmentTypeChipComponent,
		ThumbChipComponent
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
		SemesterPipe,
		CardComponent,
		ChipComponent,
		AssignmentTypeChipComponent,
		ThumbChipComponent
	],
	providers: []
})
export class SharedModule {}
