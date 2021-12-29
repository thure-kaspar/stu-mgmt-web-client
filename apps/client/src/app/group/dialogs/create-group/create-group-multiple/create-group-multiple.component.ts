import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	Output
} from "@angular/core";
import {
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators
} from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TranslateModule } from "@ngx-translate/core";
import { ToastService } from "@student-mgmt-client/services";
import { GroupApi, GroupCreateBulkDto, GroupDto } from "@student-mgmt/api-client";

@Component({
	selector: "student-mgmt-create-group-multiple",
	templateUrl: "./create-group-multiple.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateGroupMultipleComponent {
	@Input() courseId: string;
	@Output() groupsCreated = new EventEmitter<GroupDto[]>();

	/** Form with the structure of a GroupCreateBulkDto. */
	form: FormGroup;
	/** Determines, wether the user wants to specify group names explicitly or use a naming schema. */
	useNamingSchema: boolean;

	constructor(private fb: FormBuilder, private groupApi: GroupApi, private toast: ToastService) {
		this.form = this.fb.group({
			names: [null],
			nameSchema: [null],
			count: [null, Validators.min(1)]
		});
	}

	onChange(): void {
		this.form.reset();
	}

	onSave(): void {
		const groupCreateBulk: GroupCreateBulkDto = this.form.value;

		if (!this.useNamingSchema) {
			groupCreateBulk.names = (this.form.get("names").value as string)?.split("\n");
			groupCreateBulk.names = groupCreateBulk.names.filter(name => name.length > 1); // Remove empty lines
		}

		this.groupApi.createMultipleGroups(groupCreateBulk, this.courseId).subscribe(
			groups => this.groupsCreated.emit(groups),
			error => {
				this.toast.apiError(error);
			}
		);
	}
}

@NgModule({
	declarations: [CreateGroupMultipleComponent],
	exports: [CreateGroupMultipleComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatSlideToggleModule,
		TranslateModule
	]
})
export class CreateGroupMultipleComponentModule {}
