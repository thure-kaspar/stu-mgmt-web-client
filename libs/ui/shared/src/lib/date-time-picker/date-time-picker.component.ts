import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";

@Component({
    selector: "student-mgmt-date-time-picker",
    templateUrl: "./date-time-picker.component.html",
    styleUrls: ["./date-time-picker.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DateTimePickerComponent extends UnsubscribeOnDestroy implements OnInit {
	@Input() control!: UntypedFormControl;
	@Input() label!: string;
	time?: string | null;

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.control.valueChanges.subscribe(dateAsIso => {
			if (dateAsIso) {
				const current = new Date(dateAsIso);
				const hours = this.withLeadingZero(current.getHours());
				const minutes = this.withLeadingZero(current.getMinutes());
				this.time = hours + ":" + minutes;
			} else {
				this.time = null;
			}
		});
	}

	onTimeChanged(time: string): void {
		const timeRegex = /^(\d\d):(\d\d)$/;

		if (timeRegex.test(time)) {
			const [, hours, minutes] = timeRegex.exec(time);
			this.updateDate(new Date(this.control.value), Number(hours), Number(minutes));
		} else {
			this.updateDate(new Date(this.control.value), 0, 0);
		}
	}

	withLeadingZero(num: number): string {
		if (num < 10) {
			return "0" + num;
		}

		return num.toString();
	}

	updateDate(current: Date, hours: number, minutes: number): void {
		const year = current.getFullYear();
		const month = current.getMonth();
		const date = current.getDate();
		const newDate = new Date(year, month, date, hours, minutes);
		this.control.setValue(newDate.toISOString());
	}
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [DateTimePickerComponent],
	exports: [DateTimePickerComponent],
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		ReactiveFormsModule,
		FormsModule,
		TranslateModule
	]
})
export class DateTimePickerComponentModule {}
