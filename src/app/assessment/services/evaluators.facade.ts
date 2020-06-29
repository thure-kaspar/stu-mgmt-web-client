import { Injectable } from "@angular/core";
import { AssessmentAllocationService, UserDto, CoursesService } from "../../../../api";
import { Observable, throwError } from "rxjs";
import { tap, catchError, take } from "rxjs/operators";

@Injectable()
export class EvaluatorsFacade {

	private evaluators: UserDto[];
	private evaluatorMap: Map<string, UserDto>;

	constructor(private allocationService: AssessmentAllocationService,
				private courseService: CoursesService) { }

	/**
	 * Removes all data that is stored by this service. 
	 * Should be called once the parent component that is managing an assessment gets destroyed.
	 */
	clear(): void {
		this.evaluators = [];
		this.evaluatorMap.clear();
	}

	/** Returns all evaluators (course participants with permission to create assessments) of an assignment. */
	getEvaluators(): UserDto[] {
		return this.evaluators;
	}
	
	/** Returns the evaluator with the specified id. */
	getEvaluatorById(id: string): UserDto {
		return this.evaluatorMap.get(id);
	}

	/**
	 * Requests the evaluators of the given course from the API.
	 * Results will be stored by the service and are available via ```getEvaluators()``` to allow other components
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
		this.evaluators = users;
		this.evaluatorMap = new Map<string, UserDto>();
		this.evaluators.forEach(e => this.evaluatorMap.set(e.id, e));
	}

}
