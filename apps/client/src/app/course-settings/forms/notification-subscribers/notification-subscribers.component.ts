import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ToastService } from "@student-mgmt-client/services";
import {
	CardComponentModule,
	ConfirmDialog,
	ConfirmDialogData,
	IconComponentModule
} from "@student-mgmt-client/shared-ui";
import { NotificationApi, SubscriberDto } from "@student-mgmt/api-client";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import {
	NotificationSubscriberDialog,
	NotificationSubscriberDialogModule
} from "../../dialogs/notification-subscriber/notification-subscriber.dialog";

@Component({
    selector: "student-mgmt-notification-subscribers",
    templateUrl: "./notification-subscribers.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NotificationSubscribersComponent implements OnInit {
	subscribers$: Observable<SubscriberDto[]>;
	private reload$ = new BehaviorSubject(null);
	form: UntypedFormGroup;
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
							next: () => {
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
						next: () => {
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

@NgModule({
	declarations: [NotificationSubscribersComponent],
	exports: [NotificationSubscribersComponent],
	imports: [
		CommonModule,
		MatButtonModule,
		MatMenuModule,
		TranslateModule,
		IconComponentModule,
		CardComponentModule,
		NotificationSubscriberDialogModule
	]
})
export class NotificationSubscribersComponentModule {}
