import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { AssignmentsService } from "../../../../api";
import * as AssignmentActions from "./assignment.actions";

@Injectable({
	providedIn: "root"
})
export class AssignmentEffects {
	onLoadAssignments$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AssignmentActions.loadAssignments),
			switchMap(({ courseId }) => this.assignmentService.getAssignmentsOfCourse(courseId)),
			map(assignments => AssignmentActions.loadAssignmentsSuccess({ assignments })),
			catchError(({ error }) => of(AssignmentActions.loadAssignmentsFailure({ error })))
		)
	);

	constructor(private actions$: Actions, private assignmentService: AssignmentsService) {}
}
