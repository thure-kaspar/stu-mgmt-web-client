import { AssessmentDto } from "../../../api";

export type AssessmentDtoExtended = AssessmentDto & {
	roundedPoints?: number;
	hasPassed?: boolean;
};
