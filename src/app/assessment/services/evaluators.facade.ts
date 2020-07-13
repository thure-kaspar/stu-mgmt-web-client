import { Injectable } from "@angular/core";
import { AssessmentAllocationService, UserDto, CoursesService } from "../../../../api";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { tap, catchError, take } from "rxjs/operators";

@Injectable()
export class EvaluatorsFacade {

	private evaluatorsSubject = new BehaviorSubject<UserDto[]>(undefined);
	private evaluatorMap = new Map<string, UserDto>();

	
	/**
	 * Evaluators (course participants with permission to create assessments) of an assignment.
	 * Emits `undefined`, if no evaluators are loaded.
	 */
	evaluators$ = this.evaluatorsSubject.asObservable();

	constructor(private allocationService: AssessmentAllocationService,
				private courseService: CoursesService) { }

	/**
	 * Removes all data that is stored by this service. 
	 * Should be called once the parent component that is managing an assessment gets destroyed.
	 */
	clear(): void {
		this.evaluatorMap.clear();
		this.evaluatorsSubject.next(undefined);
	}

	/** Returns the evaluator with the specified id. Requires that `loadEvaluators` has been called and finished. */
	getEvaluatorById(id: string): UserDto {
		return this.evaluatorMap.get(id);
	}

	/**
	 * Requests the evaluators of the given course from the API.
	 * Results will be stored by the service and are available via ```evaluators$``` to allow other components
	 * to access the evaluators.
	 */
	loadEvaluators(courseId: string): Observable<UserDto[]> {
		return this.courseService.getUsersOfCourse(
			courseId,
			undefined,
			undefined, 
			[UserDto.CourseRoleEnum.LECTURER, UserDto.CourseRoleEnum.TUTOR]
		).pipe(
			take(1),
			tap((evaluators) => this.setEvaluators(evaluators)),
			catchError((error) => {
				console.log(error);
				return throwError(error);
			})
		);
	}

	/** Sets the evaluators of an assignment */
	private setEvaluators(users: UserDto[]): void {
		this.evaluatorMap = new Map<string, UserDto>();
		users.forEach(e => this.evaluatorMap.set(e.id, e));
		this.evaluatorsSubject.next(users);
	}

}
