import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	OnInit,
	Output,
	ViewChild
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { IconComponentModule } from "@student-mgmt-client/shared-ui";
import { UserDto } from "@student-mgmt/api-client";
import { environment } from "apps/client/src/environments/environment";
import { Observable } from "rxjs";

@Component({
    selector: "student-mgmt-navigation-ui",
    templateUrl: "./navigation-ui.component.html",
    styleUrls: ["./navigation.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NavigationUiComponent {
	@Input() user?: UserDto | null;
	/** If `true`, the sidenav will be closed. */
	@Input() isHandset = false;
	/** Closes the sidenav when triggered. */
	@Input() triggerClose$!: Observable<void>;

	@Output() themeChanged = new EventEmitter<"dark" | "light">();
	@Output() languageChanged = new EventEmitter<"en" | "de">();
	@Output() loginClicked = new EventEmitter<void>();
	@Output() logoutClicked = new EventEmitter<void>();

	@ViewChild("drawer") drawer!: MatSidenav;

	_isDevelopmentEnv = !environment.production;
}

@NgModule({
	declarations: [NavigationUiComponent],
	exports: [NavigationUiComponent],
	imports: [
		CommonModule,
		MatToolbarModule,
		MatMenuModule,
		TranslateModule,
		IconComponentModule,
		MatSidenavModule,
		RouterModule,
		MatDividerModule,
		MatListModule,
		MatButtonModule
	]
})
export class NavigationUiComponentModule {}
