import { AdmissionCriteriaDto, AssessmentDto, AssignmentDto } from "@student-mgmt/api-client";
import { RoundingMethod } from "@student-mgmt-client/util-helper";
import { AssessmentDtoExtended } from "./assessment.model";

export type AssignmentDtoExtended = AssignmentDto & { requiredPoints?: number };
export type AssignmentWithAssessment = AssignmentDtoExtended & {
	assessment: AssessmentDtoExtended;
};

export function mapToExtendedAssessmentDto(
	assessment: AssessmentDto,
	assignment: AssignmentDto,
	admissionCriteria?: AdmissionCriteriaDto
): [assessment: AssessmentDtoExtended, requiredPoints?: number] {
	const extendedAssessment: AssessmentDtoExtended = { ...assessment };
	let requiredPoints;

	const rule = admissionCriteria?.rules.find(
		r =>
			r.type === "INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES" &&
			r.assignmentType === assignment.type
	);

	if (rule) {
		requiredPoints = (assignment.points * rule.requiredPercent) / 100;

		const round = RoundingMethod(
			rule.achievedPercentRounding.type,
			rule.achievedPercentRounding.decimals
		);

		extendedAssessment.hasPassed = false;

		if (extendedAssessment.achievedPoints) {
			const roundedPoints = round(extendedAssessment.achievedPoints);
			extendedAssessment.roundedPoints = roundedPoints;
			extendedAssessment.hasPassed = roundedPoints >= requiredPoints;
		}
	}

	return [extendedAssessment, requiredPoints];
}

/**
 * Maps the given assessments to their corresponding assignment.
 * If `admissionCriteria` is defined, the assessments will contain additional properties:
 * - `hasPassed`
 * - `roundedPoints`
 */
export function mapAssessmentsToAssignment(
	assessments: AssessmentDto[],
	assignments: AssignmentDto[],
	admissionCriteria?: AdmissionCriteriaDto
): AssignmentWithAssessment[] {
	return assignments.map(a => {
		const assignment: AssignmentWithAssessment = {
			...a,
			assessment: assessments.find(assessment => assessment.assignmentId === a.id)
		};

		if (admissionCriteria?.rules.length > 0) {
			const [assessment, requiredPoints] = mapToExtendedAssessmentDto(
				assignment.assessment,
				assignment,
				admissionCriteria
			);

			assignment.assessment = assessment;
			assignment.requiredPoints = requiredPoints;
		}

		return assignment;
	});
}
