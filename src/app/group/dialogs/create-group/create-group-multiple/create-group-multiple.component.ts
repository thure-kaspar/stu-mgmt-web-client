import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { GroupDto, GroupsService, GroupCreateBulkDto } from "../../../../../../api";
import { SnackbarService } from "../../../../shared/services/snackbar.service";

@Component({
	selector: "app-create-group-multiple",
	templateUrl: "./create-group-multiple.component.html",
	styleUrls: ["./create-group-multiple.component.scss"]
})
export class CreateGroupMultipleComponent implements OnInit {

	@Input() courseId: string;
	@Output() onGroupsCreated = new EventEmitter<GroupDto[]>();

	/** Form with the structure of a GroupCreateBulkDto. */
	form: FormGroup
	/** Determines, wether the user wants to specify group names explicitly or use a naming schema. */
	useNamingSchema: boolean;

	constructor(private fb: FormBuilder,
				private groupService: GroupsService,
				private snackbar: SnackbarService) {
		this.form = this.fb.group({
			names: [null],
			nameSchema: [null],
			count: [null, Validators.min(1)]
		});
	}

	ngOnInit(): void {
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

		this.groupService.createMultipleGroups(groupCreateBulk, this.courseId).subscribe(
			groups => this.onGroupsCreated.emit(groups),
			error => {
				console.log(error);
				this.snackbar.openErrorMessage();
			}
		);
	}

}
