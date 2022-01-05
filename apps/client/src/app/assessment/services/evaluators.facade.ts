import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, take, tap } from "rxjs/operators";
import {
	AssessmentAllocationApi,
	CourseParticipantsApi,
	ParticipantDto,
	UserDto
} from "@student-mgmt/api-client";

@Injectable()
export class EvaluatorsFacade {
	private evaluatorsSubject = new BehaviorSubject<ParticipantDto[]>(undefined);
	private evaluatorMap = new Map<string, ParticipantDto>();

	/**
	 * Evaluators (course participants with permission to create assessments) of an assignment.
	 * Emits `undefined`, if no evaluators are loaded.
	 */
	evaluators$ = this.evaluatorsSubject.asObservable();

	constructor(
		private allocationService: AssessmentAllocationApi,
		private courseParticipantsApi: CourseParticipantsApi
	) {}

	/**
	 * Removes all data that is stored by this service.
	 * Should be called once the parent component that is managing an assessment gets destroyed.
	 */
	clear(): void {
		this.evaluatorMap.clear();
		this.evaluatorsSubject.next(undefined);
	}

	/** Returns the evaluator with the specified id. Requires that `loadEvaluators` has been called and finished. */
	getEvaluatorById(id: string): ParticipantDto {
		return this.evaluatorMap.get(id);
	}

	/**
	 * Requests the evaluators of the given course from the API.
	 * Results will be stored by the service and are available via ```evaluators$``` to allow other components
	 * to access the evaluators.
	 */
	loadEvaluators(courseId: string): Observable<ParticipantDto[]> {
		return this.courseParticipantsApi
			.getUsersOfCourse(courseId, undefined, undefined, [
				ParticipantDto.RoleEnum.LECTURER,
				ParticipantDto.RoleEnum.TUTOR
			])
			.pipe(
				take(1),
				tap(evaluators => this.setEvaluators(evaluators)),
				catchError(error => {
					console.log(error);
					return throwError(error);
				})
			);
	}

	/** Sets the evaluators of an assignment */
	private setEvaluators(users: ParticipantDto[]): void {
		this.evaluatorMap = new Map<string, ParticipantDto>();
		users.forEach(e => this.evaluatorMap.set(e.userId, e));
		this.evaluatorsSubject.next(users);
	}
}
