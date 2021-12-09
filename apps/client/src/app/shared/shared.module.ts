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
import { SemesterPipeModule } from "@student-mgmt-client/util-helper";
import { AuthModule } from "@student-mgmt-client/auth";
import { MaterialModule } from "../material/material.module";

const modules = [
	CommonModule,
	AuthModule,
	MaterialModule,
	TranslateModule,
	FormsModule,
	ReactiveFormsModule,
	SemesterPipeModule,
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
	imports: modules,
	exports: modules
})
export class SharedModule {}
