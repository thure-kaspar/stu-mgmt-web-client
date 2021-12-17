import { CourseDto, IndividualPercentWithAllowedFailuresRuleDto } from "@student-mgmt/api-client";

export const COURSE_JAVA_WISE1920: CourseDto = {
	id: "java-wise1920",
	shortname: "java",
	semester: "wise1920",
	title: "Programmierpraktikum I: Java",
	isClosed: false,
	links: [
		{
			name: "Example URL",
			url: "http://example-url.com"
		}
	],
	groupSettings: {
		allowGroups: true,
		sizeMin: 2,
		sizeMax: 3,
		selfmanaged: true,
		autoJoinGroupOnCourseJoined: true,
		mergeGroupsOnAssignmentStarted: true
	},
	admissionCriteria: {
		rules: [
			{
				type: "REQUIRED_PERCENT_OVERALL",
				assignmentType: "HOMEWORK",
				requiredPercent: 50,
				achievedPercentRounding: {
					type: "UP_NEAREST_INTEGER"
				}
			},
			{
				type: "REQUIRED_PERCENT_OVERALL",
				assignmentType: "TESTAT",
				requiredPercent: 50,
				achievedPercentRounding: {
					type: "DECIMALS",
					decimals: 0
				}
			},
			{
				type: "INDIVIDUAL_PERCENT_WITH_ALLOWED_FAILURES",
				assignmentType: "HOMEWORK",
				requiredPercent: 50,
				achievedPercentRounding: {
					type: "NONE"
				},
				allowedFailures: 2
			} as IndividualPercentWithAllowedFailuresRuleDto
		]
	}
};
