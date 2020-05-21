import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { CourseMembershipsFacade } from "../services/course-memberships.facade";
import { MatDialog } from "@angular/material/dialog";

@Injectable()
export class CourseMemberGuard implements CanActivate {

	constructor(private courseMemberships: CourseMembershipsFacade,
				private dialog: MatDialog) { }

	canActivate(route: ActivatedRouteSnapshot): boolean {
		let canActivate = false;
		const courseId = route.paramMap.get("courseId");

		this.courseMemberships.courses$.subscribe(courses => {
			const course = courses.find(c => c.id === courseId);
				
			// Check if user is a member of course
			if (course) {
				canActivate = true;
			} 
		});
		
		return canActivate;
	}

}
