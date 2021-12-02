import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { AssignmentDto, AssignmentApi } from "@student-mgmt/api-client";
import { AssignmentActions, AssignmentSelectors } from "../../state/assignment";

@Injectable({ providedIn: "root" })
export class AssignmentManagementFacade {
	assignments$ = this.store.select(AssignmentSelectors.selectAssignments);

	constructor(private assignmentApi: AssignmentApi, private store: Store) {}

	/**
	 * Calls the API to retrieve the assignments of the specified course.
	 * The assignments will be published via the assignments-Observable.
	 */
	loadAssignmentsOfCourse(courseId: string): void {
		this.store.dispatch(AssignmentActions.loadAssignments({ courseId }));
	}

	/**
	 * Calls the API to create the assignment.
	 * If successful, the change will be reflected in the assignment-Observable.
	 * Returns an obvervable of the created assignment.
	 */
	create(assignment: AssignmentDto, courseId: string): Observable<AssignmentDto> {
		return this.assignmentApi.createAssignment(assignment, courseId).pipe(
			tap({
				next: created => {
					if (created) {
						this.loadAssignmentsOfCourse(courseId);
					}
				},
				error: error => console.log(error)
			})
		);
	}

	/** Retrieves the requested assignment. */
	get(assignmentId: string, courseId: string): Observable<AssignmentDto> {
		return this.assignmentApi.getAssignmentById(courseId, assignmentId);
	}

	/**
	 * Calls the API to update the assignment.
	 * If successful, the change will be reflected in the assignment-Observable.
	 * Returns an obvervable of the updated assignment.
	 */
	update(
		changes: AssignmentDto,
		assignmentId: string,
		courseId: string
	): Observable<AssignmentDto> {
		return this.assignmentApi.updateAssignment(changes, courseId, assignmentId).pipe(
			tap({
				next: updated => {
					if (updated) {
						this.loadAssignmentsOfCourse(courseId);
					}
				},
				error: error => console.log(error)
			})
		);
	}

	/**
	 * Calls the API to remove the Assignment.
	 * If successful, the change will be reflected in the assignment-Observable.
	 * Returns an observable of the deleted assignment.
	 */
	remove(assignment: AssignmentDto, courseId: string): Observable<AssignmentDto> {
		return this.assignmentApi.deleteAssignment(courseId, assignment.id).pipe(
			tap({
				next: () => {
					this.loadAssignmentsOfCourse(courseId);
				},
				error: error => console.log(error)
			}),
			switchMap(value => of(assignment))
		);
	}
}
