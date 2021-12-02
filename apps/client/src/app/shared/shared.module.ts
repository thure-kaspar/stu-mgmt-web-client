import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { TranslateModule } from "@ngx-translate/core";
import { AuthModule } from "../auth/auth.module";
import { MaterialModule } from "../material/material.module";
import { AssignmentTypeChipComponent } from "./components/assignment-type-chip/assignment-type-chip.component";
import { CardComponent } from "./components/card/card.component";
import { ChipComponent } from "./components/chip/chip.component";
import { ConfirmDialog } from "./components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { ExtendedConfirmDialog } from "./components/dialogs/extended-confirm-dialog/extended-confirm-dialog.dialog";
import { SearchParticipantDialog } from "./components/dialogs/search-participant/search-participant.dialog";
import { IconComponent } from "./components/icon.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { ParticipantAdmissionStatusComponent } from "./components/participant-admission-status/participant-admission-status.component";
import { ThumbChipComponent } from "./components/thumb-chip/thumb-chip.component";
import { Paginator } from "./paginator/paginator.component";
import { SemesterPipe } from "./pipes/semester.pipe";
import { DateTimePickerComponent } from "./components/date-time-picker/date-time-picker.component";

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
		IconComponent,
		AssignmentTypeChipComponent,
		ThumbChipComponent,
		ParticipantAdmissionStatusComponent,
		DateTimePickerComponent
	],
	imports: [
		CommonModule,
		AuthModule,
		MaterialModule,
		TranslateModule,
		FormsModule,
		ReactiveFormsModule
	],
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
		IconComponent,
		AssignmentTypeChipComponent,
		ThumbChipComponent,
		ParticipantAdmissionStatusComponent,
		DateTimePickerComponent
	],
	providers: []
})
export class SharedModule {}
