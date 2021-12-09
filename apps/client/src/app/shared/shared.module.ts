import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import {
	AssignmentTypeChipComponentModule,
	CardComponentModule,
	ChipComponentModule,
	ConfirmDialogModule,
	DateTimePickerComponentModule,
	ExtendedConfirmDialogModule,
	IconComponentModule,
	PaginatorModule,
	ParticipantAdmissionStatusComponentModule,
	SearchParticipantDialogModule,
	ThumbChipComponentModule
} from "@student-mgmt-client/shared-ui";
import { AuthModule } from "../auth/auth.module";
import { MaterialModule } from "../material/material.module";
import { SemesterPipe } from "./pipes/semester.pipe";

const modules = [
	CommonModule,
	AuthModule,
	MaterialModule,
	TranslateModule,
	FormsModule,
	ReactiveFormsModule,
	SemesterPipe,
	AssignmentTypeChipComponentModule,
	CardComponentModule,
	ChipComponentModule,
	DateTimePickerComponentModule,
	ConfirmDialogModule,
	ExtendedConfirmDialogModule,
	SearchParticipantDialogModule,
	PaginatorModule,
	ParticipantAdmissionStatusComponentModule,
	ThumbChipComponentModule,
	IconComponentModule
];

@NgModule({
	declarations: [SemesterPipe],
	imports: modules,
	exports: modules
})
export class SharedModule {}
