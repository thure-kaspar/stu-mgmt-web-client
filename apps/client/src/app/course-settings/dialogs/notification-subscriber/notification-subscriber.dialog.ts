import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TranslateModule } from "@ngx-translate/core";
import { StudentMgmtEvent, SubscriberDto } from "@student-mgmt/api-client";

@Component({
	selector: "student-mgmt-notification-subscriber",
	templateUrl: "./notification-subscriber.dialog.html",
	styleUrls: ["./notification-subscriber.dialog.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class NotificationSubscriberDialog implements OnInit {
	form: UntypedFormGroup;
	events = Object.values(StudentMgmtEvent.EventEnum);
	allSelected = false;

	constructor(
		private fb: UntypedFormBuilder,
		private dialogRef: MatDialogRef<NotificationSubscriberDialog>,
		@Inject(MAT_DIALOG_DATA) private data?: SubscriberDto
	) {}

	ngOnInit(): void {
		this.form = this.fb.group({
			name: [this.data?.name, [Validators.required]],
			url: [this.data?.url, [Validators.required]],
			events: this.fb.group({
				ALL: [this.data?.events?.["ALL"]]
			})
		});

		for (const event of this.events) {
			this.getEventsFromGroup().addControl(event, this.fb.control(this.data?.events[event]));
		}

		if (this.data?.events?.["ALL"]) {
			this.toggleAll();
		}
	}

	toggleAll(): void {
		this.allSelected = !this.allSelected;

		if (this.allSelected) {
			this.setAllEvents(true);
			this.getEventsFromGroup().get("ALL").setValue(true);
			this.getEventsFromGroup().disable();
		} else {
			this.getEventsFromGroup().get("ALL").setValue(false);
			this.getEventsFromGroup().enable();
		}
	}

	setAllEvents(value: boolean): void {
		for (const event of this.events) {
			this.getEventsFromGroup().get(event).setValue(value);
		}
	}

	getEventsFromGroup(): UntypedFormGroup {
		return this.form.get("events") as UntypedFormGroup;
	}

	reset(): void {
		this.setAllEvents(false);
		this.allSelected = false;
	}

	onSave(): void {
		this.form.enable(); // Required, otherwise events won't be included when ALL selected
		const subscriber = this.form.value as SubscriberDto;

		if (subscriber.events["ALL"]) {
			subscriber.events = { ALL: true };
		} else {
			this.onlyIncludeSelectedEvents(subscriber);
		}

		this.dialogRef.close(subscriber);
	}

	private onlyIncludeSelectedEvents(subscriber: SubscriberDto): void {
		const selectedEvents = Object.keys(subscriber.events).filter(key => subscriber.events[key]);

		const events = {};
		for (const selectedEvent of selectedEvents) {
			events[selectedEvent] = true;
		}

		subscriber.events = events;
	}
}

@NgModule({
	declarations: [NotificationSubscriberDialog],
	exports: [NotificationSubscriberDialog],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatButtonModule,
		MatSlideToggleModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatInputModule,
		TranslateModule
	]
})
export class NotificationSubscriberDialogModule {}
