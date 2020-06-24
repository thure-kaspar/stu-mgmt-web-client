import { Injectable } from "@angular/core";
import { AssessmentAllocationService, UserDto } from "../../../../api";

@Injectable()
export class EvaluatorsFacade {

	private evaluators: UserDto[];
	private evaluatorMap: Map<string, UserDto>;

	constructor(private allocationService: AssessmentAllocationService) { }

	/**
	 * Removes all data that is stored by this service. 
	 * Should be called once the parent component that is managing an assessment gets destroyed.
	 */
	clear(): void {
		this.evaluators = [];
		this.evaluatorMap.clear();
	}

	/** Sets the evaluators of an assignment */
	setEvaluators(users: UserDto[]): void {
		this.evaluators = users;
		this.evaluatorMap = new Map<string, UserDto>();
		this.evaluators.forEach(e => this.evaluatorMap.set(e.id, e));
	}

	/** Returns all evaluators (course participants with permission to create assessments) of an assignment. */
	getEvaluators(): UserDto[] {
		return this.evaluators;
	}
	
	/** Returns the evaluator with the specified id. */
	getEvaluatorById(id: string): UserDto {
		return this.evaluatorMap.get(id);
	}

}
