import { ParticipantDto, PointsOverviewDto } from "@student-mgmt/api-client";

export type StudentResult = {
	student: ParticipantDto;
	total: number;
	assignmentResults: {
		[assignmentId: string]: {
			achievedPoints: number;
			achievedPointsPercent: number;
			assessmentId: string;
		};
	};
};

export function createTableData(overview: PointsOverviewDto): StudentResult[] {
	return overview.results.map(result => {
		const studentResult: StudentResult = {
			student: result.student,
			total: 0,
			assignmentResults: {}
		};

		overview.assignments.forEach((assignment, index) => {
			studentResult.assignmentResults[assignment.id] = {
				achievedPoints: result.achievedPoints[index],
				achievedPointsPercent: (result.achievedPoints[index] / assignment.points) * 100,
				assessmentId: result.assessmentIds[index]
			};
			studentResult.total += result.achievedPoints[index];
		});

		return studentResult;
	});
}
