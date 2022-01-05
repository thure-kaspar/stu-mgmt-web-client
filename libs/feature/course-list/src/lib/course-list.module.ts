import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { TranslateModule } from "@ngx-translate/core";
import { SemesterPipeModule } from "@student-mgmt-client/pipes";
import {
	IconComponentModule,
	PaginatorModule,
	TitleComponentModule
} from "@student-mgmt-client/shared-ui";
import { CourseListRoutingModule } from "./course-list-routing.module";
import { CourseListComponent } from "./course-list.component";

@NgModule({
	declarations: [CourseListComponent],
	exports: [CourseListComponent],
	imports: [
		CourseListRoutingModule,
		CommonModule,
		FormsModule,
		TranslateModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatTableModule,
		MatSelectModule,
		TitleComponentModule,
		PaginatorModule,
		IconComponentModule,
		SemesterPipeModule
	]
})
export class CourseListComponentModule {}
