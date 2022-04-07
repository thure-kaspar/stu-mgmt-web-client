import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	NgModule,
	OnInit
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TranslateModule } from "@ngx-translate/core";
import { AuthService } from "@student-mgmt-client/auth";
import { ToastService } from "@student-mgmt-client/services";
import { CardComponentModule, TitleComponentModule } from "@student-mgmt-client/shared-ui";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import { UserApi, UserSettingsDto } from "@student-mgmt/api-client";
import { Subject } from "rxjs";
import { MatrNrDialog } from "../matr-nr/matr-nr.dialog";

type BlacklistableEvents = {
	ASSIGNMENT_STARTED: boolean;
	ASSIGNMENT_EVALUATED: boolean;
	ASSESSMENT_SCORE_CHANGED: boolean;
	PARTICIPANT_JOINED_GROUP: boolean;
	PARTICIPANT_LEFT_GROUP: boolean;
};

@Component({
	selector: "student-mgmt-user-settings",
	templateUrl: "./user-settings.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsComponent extends UnsubscribeOnDestroy implements OnInit {
	userSettings: UserSettingsDto;
	triggerUpdate$ = new Subject<UserSettingsDto>();

	readonly languageEnum = UserSettingsDto.LanguageEnum;
	readonly blacklistableEventList = [
		"ASSIGNMENT_STARTED",
		"ASSIGNMENT_EVALUATED",
		"ASSESSMENT_SCORE_CHANGED",
		"PARTICIPANT_JOINED_GROUP",
		"PARTICIPANT_LEFT_GROUP"
	];

	constructor(
		private userApi: UserApi,
		private dialog: MatDialog,
		private toast: ToastService,
		private cdRef: ChangeDetectorRef
	) {
		super();
	}

	ngOnInit(): void {
		const userId = AuthService.getUser().id;
		this.subs.sink = this.userApi.getSettings(userId).subscribe(userSettings => {
			this.setUserSettings(userSettings);
		});
		this.subs.sink = this.triggerUpdate$.subscribe(userSettings => {
			const blacklistedEvents = this.switchBooleansAndTrim(
				userSettings.blacklistedEvents as any
			);
			const settings = { ...userSettings, blacklistedEvents };
			this.updateUserSettings(settings);
		});
	}

	updateUserSettings(userSettings: UserSettingsDto): void {
		const settings = { ...userSettings };

		this.subs.sink = this.userApi.updateSettings(settings, AuthService.getUser().id).subscribe({
			next: userSettings => {
				this.toast.success();
				this.setUserSettings(userSettings);
			},
			error: error => {
				this.toast.apiError(error);
			}
		});
	}

	private switchBooleansAndTrim(selectedEvents: BlacklistableEvents): BlacklistableEvents | null {
		let blacklistedEvents: BlacklistableEvents = null;

		Object.keys(selectedEvents).forEach(key => {
			if (!selectedEvents[key]) {
				blacklistedEvents = { ...blacklistedEvents, [key]: true };
			}
		});

		return blacklistedEvents;
	}

	private setUserSettings(userSettings: UserSettingsDto): void {
		this.userSettings = this.mapUserSettings(userSettings);
		this.cdRef.detectChanges();
	}

	mapUserSettings(userSettings: UserSettingsDto): UserSettingsDto {
		const settings = { ...userSettings };
		settings.blacklistedEvents = this.createBlacklistedEventsMap(
			userSettings.blacklistedEvents
		);
		return settings;
	}

	createBlacklistedEventsMap(eventsFromDto: Partial<BlacklistableEvents>): BlacklistableEvents {
		const blacklistedEvents: BlacklistableEvents = {
			ASSIGNMENT_STARTED: true,
			ASSIGNMENT_EVALUATED: true,
			ASSESSMENT_SCORE_CHANGED: true,
			PARTICIPANT_JOINED_GROUP: true,
			PARTICIPANT_LEFT_GROUP: true
		};

		if (eventsFromDto) {
			Object.keys(blacklistedEvents).forEach(key => {
				if (eventsFromDto[key]) {
					blacklistedEvents[key] = false;
				}
			});
		}

		return blacklistedEvents;
	}

	selectLanguage(language: UserSettingsDto.LanguageEnum): void {
		this.userSettings.language = language;
		this.triggerUpdate$.next(this.userSettings);
	}

	toggleEmailEvent(event: keyof BlacklistableEvents): void {
		this.userSettings.blacklistedEvents[event] = !this.userSettings.blacklistedEvents[event];
		this.triggerUpdate$.next(this.userSettings);
	}

	toggleAllowEmails(): void {
		this.userSettings.allowEmails = !this.userSettings.allowEmails;
		this.triggerUpdate$.next(this.userSettings);
	}

	openMatrNrDialog(): void {
		this.dialog.open(MatrNrDialog);
	}
}

@NgModule({
	declarations: [UserSettingsComponent],
	exports: [UserSettingsComponent],
	imports: [
		CommonModule,
		MatButtonModule,
		MatSlideToggleModule,
		MatDividerModule,
		TranslateModule,
		CardComponentModule,
		TitleComponentModule
	]
})
export class UserSettingsComponentModule {}
