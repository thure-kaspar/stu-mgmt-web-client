import { Injectable } from "@angular/core";
import { ToastrService, IndividualConfig } from "ngx-toastr";

@Injectable({ providedIn: "root" })
export class ToastService {

	constructor(private toast: ToastrService) { }

	success(message?: string, title?: string, override?: Partial<IndividualConfig>): void {
		this.toast.success(message, title, override);
	}

}
