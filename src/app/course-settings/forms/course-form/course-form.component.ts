import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	selector: "app-course-form",
	templateUrl: "./course-form.component.html",
	styleUrls: ["./course-form.component.scss"]
})
export class CourseForm implements OnInit {

	@Input() form: FormGroup;
	@Input() isEditMode = false;

	constructor() { }

	ngOnInit(): void {
	}

}
