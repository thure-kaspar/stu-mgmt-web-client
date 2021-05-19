import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { AssignmentService } from "../../../../api";
import * as AssignmentActions from "./assignment.actions";

@Injectable({
	providedIn: "root"
})
export class AssignmentEffects {
	loadAssignments$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AssignmentActions.loadAssignments),
			switchMap(({ courseId }) => this.assignmentService.getAssignmentsOfCourse(courseId)),
			map(assignments => AssignmentActions.loadAssignmentsSuccess({ assignments })),
			catchError(({ error }) => of(AssignmentActions.loadAssignmentsFailure({ error })))
		)
	);

	loadAssignmentById$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AssignmentActions.loadAssignmentById),
			switchMap(({ courseId, assignmentId }) =>
				this.assignmentService.getAssignmentById(courseId, assignmentId)
			),
			map(assignment => AssignmentActions.loadAssignmentByIdSuccess({ assignment })),
			catchError(({ error }) => of(AssignmentActions.loadAssignmentByIdFailure({ error })))
		)
	);

	constructor(private actions$: Actions, private assignmentService: AssignmentService) {}
}
