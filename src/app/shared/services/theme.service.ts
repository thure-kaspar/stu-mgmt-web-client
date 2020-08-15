import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class ThemeService {

	availableThemes = [
		"default-theme",
		"dark-theme"
	]

	private themeSubject: BehaviorSubject<string>;
	theme$: Observable<string>;

	constructor() {
		const storedTheme = localStorage.getItem("theme");
		let theme: string;

		if (!storedTheme && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			theme = "dark-theme";
		} else if(storedTheme) {
			theme = storedTheme;
		}

		this.themeSubject = new BehaviorSubject(theme);
		this.theme$ = this.themeSubject.asObservable()
			.pipe(distinctUntilChanged((x, y) => x === y));
	}

	/**
	 * Emits the new theme via `theme$` and stores it in the storage.
	 * Theme must be included in `availableThemes`.
	 */
	setTheme(theme: string): void {
		if (this.availableThemes.includes(theme)) {
			localStorage.setItem("theme", theme);
			this.themeSubject.next(theme);
		} else {
			console.error(`Theme '${theme}' is not a registered theme.`);
		}
	}

}
