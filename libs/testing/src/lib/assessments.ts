import { AssessmentDto } from "@student-mgmt/api-client";

export const ASSESSMENTS: AssessmentDto[] = [
	{
		id: "8f60f844-4129-48a4-a625-7a74c7defd0d",
		assignmentId: "c2bc4aa4-6207-11ea-bc55-0242ac130003",
		groupId: "b4f24e81-dfa4-4641-af80-8e34e02d9c4a",
		isDraft: false,
		achievedPoints: 75,
		comment: "ASSESSMENT_JAVA_EVALUATED_GROUP_1 for GROUP_1_JAVA (ASSIGNMENT_JAVA_EVALUATED)",
		creatorId: "8330300e-9be7-4a70-ba7d-8a0139311343",
		lastUpdatedById: "8330300e-9be7-4a70-ba7d-8a0139311343",
		creationDate: "2021-12-17T13:31:56.768Z",
		updateDate: "2021-12-17T13:31:56.768Z",
		partialAssessments: [],
		assignment: {
			id: "c2bc4aa4-6207-11ea-bc55-0242ac130003",
			name: "Test_Assignment 04 (Java)",
			state: "EVALUATED",
			startDate: "2020-05-04T00:00:00.000Z",
			endDate: "2020-05-11T00:00:00.000Z",
			type: "HOMEWORK",
			points: 100,
			collaboration: "GROUP_OR_SINGLE"
		},
		creator: {
			id: "8330300e-9be7-4a70-ba7d-8a0139311343",
			matrNr: 222222,
			username: "jdoe",
			displayName: "John Doe",
			role: "USER"
		},
		lastUpdatedBy: {
			id: "8330300e-9be7-4a70-ba7d-8a0139311343",
			matrNr: 222222,
			username: "jdoe",
			displayName: "John Doe",
			role: "USER"
		},
		group: {
			id: "b4f24e81-dfa4-4641-af80-8e34e02d9c4a",
			name: "Testgroup 1",
			isClosed: false,
			hasPassword: true
		}
	},
	{
		id: "932c7bd8-2338-4e60-955a-39da5f858212",
		assignmentId: "75b799a1-a406-419b-a448-909aa3d34afa",
		isDraft: false,
		achievedPoints: 25,
		comment: "ASSESSMENT_JAVA_TESTAT_USER_1",
		creatorId: "8330300e-9be7-4a70-ba7d-8a0139311343",
		creationDate: "2021-12-17T13:31:56.768Z",
		updateDate: "2021-12-17T13:31:56.768Z",
		partialAssessments: [],
		assignment: {
			id: "75b799a1-a406-419b-a448-909aa3d34afa",
			name: "Test_Assignment 07 (Java) Testat Evaluated",
			state: "EVALUATED",
			startDate: "2020-04-20T00:00:00.000Z",
			endDate: "2020-04-27T00:00:00.000Z",
			type: "TESTAT",
			points: 100,
			collaboration: "SINGLE"
		},
		creator: {
			id: "8330300e-9be7-4a70-ba7d-8a0139311343",
			matrNr: 222222,
			username: "jdoe",
			displayName: "John Doe",
			role: "USER"
		}
	}
];
