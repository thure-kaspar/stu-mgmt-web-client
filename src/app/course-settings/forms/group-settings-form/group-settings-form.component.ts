import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	selector: "app-group-settings-form",
	templateUrl: "./group-settings-form.component.html",
	styleUrls: ["./group-settings-form.component.scss"]
})
export class GroupSettingsForm implements OnInit {
	@Input() form: FormGroup;

	constructor() {}

	ngOnInit(): void {}
}
