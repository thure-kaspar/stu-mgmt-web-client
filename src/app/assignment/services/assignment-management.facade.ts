import { Injectable } from "@angular/core";
import { AssignmentsService, AssignmentDto } from "../../../../api";
import { BehaviorSubject, Observable, of } from "rxjs";
import { tap, switchMap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AssignmentManagementFacade {

	private assignmentsSubject = new BehaviorSubject<AssignmentDto[]>([]);
	assignments$ = this.assignmentsSubject.asObservable();

	constructor(private assigmentService: AssignmentsService) { }

	/**
	 * Calls the API to retrieve the assignments of the specified course.
	 * The assignments will be published via the assignments-Observable.
	 */
	loadAssignmentsOfCourse(courseId: string): void {
		this.assigmentService.getAssignmentsOfCourse(courseId).subscribe(
			result => {
				this.assignmentsSubject.next(result);
			}
		);
	}

	/**
	 * Calls the API to create the assignment.
	 * If successful, the change will be reflected in the assignment-Observable.
	 * Returns an obvervable of the created assignment.
	 */
	create(assignment: AssignmentDto, courseId: string): Observable<AssignmentDto> {
		assignment.courseId = courseId;
		return this.assigmentService.createAssignment(assignment, courseId)
			.pipe(
				tap({
					next: created => {
						if (created) {
							this.assignmentsSubject.next([...this.assignmentsSubject.getValue(), created]);
						}
					},
					error: (error) => console.log(error)
				})
			);
	}

	/** Retrieves the requested assignment. */
	get(assignmentId: string, courseId: string): Observable<AssignmentDto> {
		return this.assigmentService.getAssignmentById(courseId, assignmentId);
	}

	/**
	 * Calls the API to update the assignment.
	 * If successful, the change will be reflected in the assignment-Observable.
	 * Returns an obvervable of the updated assignment.
	 */
	update(changes: AssignmentDto, assignmentId: string, courseId: string): Observable<AssignmentDto> {
		return this.assigmentService.updateAssignment(changes, courseId, assignmentId)
			.pipe(
				tap({
					next: (updated) => {
						if (updated) {
							this.loadAssignmentsOfCourse(courseId);
						}
					},
					error: (error) => console.log(error)
				})
			);
	}

	/**
	 * Calls the API to remove the Assignment. 
	 * If successful, the change will be reflected in the assignment-Observable.
	 * Returns an observable of the deleted assignment.
	 */
	remove(assignment: AssignmentDto, courseId: string): Observable<AssignmentDto> {
		return this.assigmentService.deleteAssignment(courseId, assignment.id)
			.pipe(
				tap({
					next: (isDeleted) => {
						if (isDeleted) {
							const remaining = this.assignmentsSubject.getValue().filter(a => a.id !== assignment.id);
							this.assignmentsSubject.next(remaining);
						}
					},
					error: (error) => console.log(error)
				}),
				switchMap(value => of(assignment))
			);
	}

}
