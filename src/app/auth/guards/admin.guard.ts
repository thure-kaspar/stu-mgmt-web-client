import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { UserDto } from "../../../../api";

@Injectable({
	providedIn: "root"
})
export class AdminGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(): boolean {
		const role = AuthService.getUser().role;

		if (role === UserDto.RoleEnum.MGMT_ADMIN || role === UserDto.RoleEnum.SYSTEM_ADMIN) {
			return true;
		}

		this.router.navigateByUrl("/login");
		return false;
	}
}
