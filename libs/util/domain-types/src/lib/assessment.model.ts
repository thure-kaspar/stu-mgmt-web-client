import { AssessmentDto } from "@student-mgmt/api-client";

export type AssessmentDtoExtended = AssessmentDto & {
	roundedPoints?: number;
	hasPassed?: boolean;
};
