import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { TranslateModule } from "@ngx-translate/core";
import { IconComponentModule, PaginatorModule } from "@student-mgmt-client/shared-ui";
import { SemesterPipeModule } from "@student-mgmt-client/pipes";
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
		MatCardModule,
		PaginatorModule,
		IconComponentModule,
		SemesterPipeModule
	]
})
export class CourseListComponentModule {}
