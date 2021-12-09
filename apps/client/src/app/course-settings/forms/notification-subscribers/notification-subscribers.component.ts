import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { NotificationApi, SubscriberDto } from "@student-mgmt/api-client";
import { ConfirmDialog, ConfirmDialogData } from "@student-mgmt-client/shared-ui";
import { ToastService } from "../../../shared/services/toast.service";
import { NotificationSubscriberDialog } from "../../dialogs/notification-subscriber/notification-subscriber.dialog";

@Component({
	selector: "app-notification-subscribers",
	templateUrl: "./notification-subscribers.component.html",
	styleUrls: ["./notification-subscribers.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationSubscribersComponent implements OnInit {
	subscribers$: Observable<SubscriberDto[]>;
	private reload$ = new BehaviorSubject(null);
	form: FormGroup;
	courseId: string;

	constructor(
		private notificationApi: NotificationApi,
		private dialog: MatDialog,
		private route: ActivatedRoute,
		private toast: ToastService
	) {}

	ngOnInit(): void {
		this.subscribers$ = combineLatest([this.route.params, this.reload$]).pipe(
			switchMap(([{ courseId }]) => {
				this.courseId = courseId;
				return this.notificationApi.getSubscribers(courseId);
			})
		);
	}

	/**
	 * Opens the `NotificationSubscriberDialog`, which allows users to create or edit a subscriber.
	 * If a `subscriber` is specified, it will be passed to the dialog.
	 * If a user saves their changes, the Notification-API `subscribe` endpoint will be called.
	 */
	addOrUpdate(subscriber?: SubscriberDto): void {
		this.dialog
			.open(NotificationSubscriberDialog, { data: subscriber })
			.afterClosed()
			.subscribe(changedSubscriber => {
				if (changedSubscriber) {
					this.notificationApi
						.subscribe(changedSubscriber, this.courseId, changedSubscriber.name)
						.subscribe({
							next: result => {
								this.toast.success();
								this.reload$.next(true);
							},
							error: error => {
								this.toast.apiError(error);
							}
						});
				}
			});
	}

	/**
	 * Opens the `ConfirmDialog`. If the user confirms, the Notification-API will be called
	 * to remove the subscriber.
	 */
	remove(subscriber: SubscriberDto): void {
		const data: ConfirmDialogData = {
			params: [subscriber.name, subscriber.url]
		};
		this.dialog
			.open(ConfirmDialog, { data })
			.afterClosed()
			.subscribe(confirmed => {
				if (confirmed) {
					this.notificationApi.unsubscribe(this.courseId, subscriber.name).subscribe({
						next: result => {
							this.toast.success();
							this.reload$.next(null);
						},
						error: error => {
							this.toast.apiError(error);
						}
					});
				}
			});
	}

	getSubscribedEventsAsArray(subscriber: SubscriberDto): string[] {
		return Object.keys(subscriber.events);
	}
}
