import { CommonModule } from "@angular/common";
import { Component, Input, NgModule } from "@angular/core";
import { UntypedFormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";

@Component({
	selector: "student-mgmt-group-settings-form",
	templateUrl: "./group-settings-form.component.html",
	styleUrls: ["./group-settings-form.component.scss"]
})
export class GroupSettingsFormComponent {
	@Input() form: UntypedFormGroup;
}

@NgModule({
	declarations: [GroupSettingsFormComponent],
	exports: [GroupSettingsFormComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		TranslateModule
	]
})
export class GroupSettingsFormComponentModule {}
