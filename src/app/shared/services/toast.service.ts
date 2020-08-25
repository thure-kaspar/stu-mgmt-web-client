import { Injectable } from "@angular/core";
import { ToastrService, IndividualConfig } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Injectable({ providedIn: "root" })
export class ToastService {

	constructor(private toast: ToastrService,
				private translate: TranslateService) { }
	
	/** Displays a success-themed toast message. */			
	success(message?: string, title?: string, override?: Partial<IndividualConfig>): void {
		console.log(this.tryGetTranslation(title));
		console.log(this.tryGetTranslation(message));
		this.toast.success(this.tryGetTranslation(message), this.tryGetTranslation(title), override);
	}

	/** Displays an error-themed toast message. */
	error(message?: string, title?: string, override?: Partial<IndividualConfig>): void {
		this.toast.error(this.tryGetTranslation(message), this.tryGetTranslation(title), override);;
	}

	/** Displays a warning-themed toast message. */
	warning(message?: string, title?: string, override?: Partial<IndividualConfig>): void {
		this.toast.warning(this.tryGetTranslation(message), this.tryGetTranslation(title), override);
	}

	/** Displays an info-themed toast message. */
	info(message?: string, title?: string, override?: Partial<IndividualConfig>): void {
		this.toast.info(this.tryGetTranslation(message), this.tryGetTranslation(title), override);
	}

	/**
	 * Tries to find the translation of the given `word`.
	 * Returns `undefined` if no translation found or word was undefined.
	 */
	private tryGetTranslation(word?: string): string {
		return word ? this.translate.instant(word): undefined;
	}

}
