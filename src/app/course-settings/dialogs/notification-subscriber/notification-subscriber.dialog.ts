import { Component, OnInit, ChangeDetectionStrategy, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { StudentMgmtEvent, SubscriberDto } from "../../../../../api";

@Component({
	selector: "app-notification-subscriber",
	templateUrl: "./notification-subscriber.dialog.html",
	styleUrls: ["./notification-subscriber.dialog.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationSubscriberDialog implements OnInit {
	form: FormGroup;
	events = Object.values(StudentMgmtEvent.EventEnum);
	allSelected = false;

	constructor(
		private fb: FormBuilder,
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

	getEventsFromGroup(): FormGroup {
		return this.form.get("events") as FormGroup;
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
