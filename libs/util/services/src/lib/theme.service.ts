import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ThemeService {
	availableThemes = [
		{
			cssClass: "dark",
			name: "Dark"
		},
		{
			cssClass: "light",
			name: "Light"
		}
	] as const;

	private _theme$: BehaviorSubject<string>;
	theme$: Observable<string>;

	constructor() {
		const storedTheme = localStorage.getItem("theme");
		let theme: string;

		if (storedTheme && this.availableThemes.find(t => t.cssClass === storedTheme)) {
			theme = storedTheme;
		} else {
			theme = "light";
		}

		this._theme$ = new BehaviorSubject(theme);
		this.theme$ = this._theme$;
	}

	/**
	 * Emits the new theme via `theme$` and stores it in the storage.
	 * Theme must be included in `availableThemes`.
	 */
	setTheme(cssClass: string): void {
		if (this.availableThemes.find(t => t.cssClass === cssClass)) {
			localStorage.setItem("theme", cssClass);
			this._theme$.next(cssClass);
		} else {
			console.error(`Theme '${cssClass}' is not a registered theme.`);
		}
	}
}
