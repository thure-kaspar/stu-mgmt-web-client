import { Component, OnInit, ChangeDetectionStrategy, NgModule, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxChange, MatCheckboxModule } from "@angular/material/checkbox";
import { AuthenticationApi, UserApi, UserDto } from "@student-mgmt/api-client";
import { RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { firstValueFrom } from "rxjs";
import { AuthActions, AuthSelectors } from "@student-mgmt-client/state";
import { ToastService } from "@student-mgmt-client/services";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "@student-mgmt-client/auth";

@Component({
	selector: "student-mgmt-matr-nr",
	templateUrl: "./matr-nr.dialog.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatrNrDialog implements OnInit {
	private storageKey = "ignoreMatrNrDialog";
	showDialogIgnoreOption = localStorage.getItem(this.storageKey) === "true";
	displayNoMatrNrMessage = true;
	matrNr: number | undefined | null;
	user: UserDto;

	constructor(
		private store: Store,
		private dialogRef: MatDialogRef<MatrNrDialog>,
		private toast: ToastService,
		private http: HttpClient
	) {}

	async ngOnInit(): Promise<void> {
		const user = await firstValueFrom(this.store.select(AuthSelectors.selectUser));

		this.user = user;

		if (user.matrNr) {
			this.matrNr = user.matrNr;
			this.displayNoMatrNrMessage = false;
		}
	}

	setDialogIgnoreOptionVisibility(visible: boolean): void {
		this.showDialogIgnoreOption = visible;
	}

	setDoNotShowDialogAgain(event: MatCheckboxChange): void {
		if (event.checked) {
			localStorage.setItem(this.storageKey, "true");
		} else {
			localStorage.removeItem(this.storageKey);
		}
	}

	async onConfirm(): Promise<void> {
		const matrNr = this.matrNr ?? null;

		try {
			const updatedUser = (await firstValueFrom(
				this.http.put(
					`${window["__env"]["API_BASE_PATH"]}/users/${this.user.id}/matrNr`,
					{ matrNr },
					{ headers: { Authorization: `Bearer ${AuthService.getAccessToken()}` } }
				)
			)) as UserDto;

			const { authResult } = await firstValueFrom(
				this.store.select(AuthSelectors.selectAuthState)
			);

			this.store.dispatch(
				AuthActions.login({
					authResult: {
						...authResult,
						user: updatedUser
					}
				})
			);

			this.toast.success();
			this.dialogRef.close(true);
		} catch (error) {
			this.toast.apiError(error);
		}
	}
}

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatButtonModule,
		TranslateModule
	],
	declarations: [MatrNrDialog],
	exports: [MatrNrDialog]
})
export class MatrNrDialogModule {}
