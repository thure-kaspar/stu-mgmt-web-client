import { AssignmentDto, PointsOverviewDto } from "@student-mgmt/api-client";

const baseAssignment = {
	collaboration: AssignmentDto.CollaborationEnum.GROUP,
	state: AssignmentDto.StateEnum.EVALUATED,
	type: AssignmentDto.TypeEnum.HOMEWORK
};

const assignments: AssignmentDto[] = [];

for (let i = 1; i <= 12; i++) {
	assignments.push({
		...baseAssignment,
		id: `assignment-${i}`,
		name: `Hausaufgabe ${i}`,
		points: i * 4
	});
}

export const POINTS_OVERVIEW: PointsOverviewDto = {
	assignments: assignments,
	results: [
		{
			student: {
				userId: "a019ea22-5194-4b83-8d31-0de0dc9bca53",
				role: "STUDENT",
				username: "mmustermann",
				displayName: "Max Mustermann",
				matrNr: 123456,
				email: "max.mustermann@test.com"
			},
			achievedPoints: assignments.map((a, index) => a.points - index),
			assessmentIds: assignments.map(() => "assessmentId")
		},
		{
			student: {
				userId: "40f59aad-7473-4455-a3ea-1214f19b2565",
				role: "STUDENT",
				username: "hpeter",
				displayName: "Hans Peter",
				matrNr: 111111,
				email: "hans.peter@test.com"
			},
			achievedPoints: assignments.map((a, index) => a.points - index),
			assessmentIds: assignments.map(() => "assessmentId")
		}
	]
};
