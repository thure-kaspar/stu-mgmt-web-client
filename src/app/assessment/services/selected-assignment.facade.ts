import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { AssignmentDto, AssignmentsService } from "../../../../api";

/**
 * Class that contains the currently selected assignment.
 */
@Injectable()
export class SelectedAssignmentFacade {
	
	/** Emits the currently selected assignment or `undefined`, if no assignment is selected. */
	private selectedAssignmentSubject = new BehaviorSubject<AssignmentDto | undefined>(undefined);
	selectedAssignment$ = this.selectedAssignmentSubject.asObservable();

	constructor(private assignmentService: AssignmentsService) { }

	/**
	 * Loads the assignment. Should be triggered by the parent component that renders the `/assignments`-view.
	 * Components that require the data can access it by subscribing to `selectedAssignment$`.
	 */
	loadAssignment(courseId: string, assignmentId: string): void {
		this.assignmentService.getAssignmentById(courseId, assignmentId).pipe(
			tap(
				assignment => this.selectedAssignmentSubject.next(assignment),
				error => console.log(error)
			)
		).subscribe();
	}

	/** Clears the data managed by this class. */
	clear(): void {
		this.selectedAssignmentSubject.next(undefined);
	}

} 
