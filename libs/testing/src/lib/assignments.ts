import { AssignmentDto } from "@student-mgmt/api-client";

export const ASSIGNMENTS: AssignmentDto[] = [
	{
		id: "b2f6c008-b9f7-477f-9e8b-ff34ce339077",
		name: "Test_Assignment 01 (Java)",
		state: "IN_PROGRESS",
		startDate: "2020-09-03T00:00:00.000Z",
		comment:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione ab, quaerat minus corrupti quia nostrum facere quibusdam, repellendus, reprehenderit officiis rerum nemo modi perspiciatis ex obcaecati consectetur nisi voluptatum veritatis.",
		links: [
			{
				name: "Example URL",
				url: "https://example-url.com"
			}
		],
		type: "HOMEWORK",
		points: 100,
		collaboration: "GROUP",
		configs: [
			{
				tool: "tool-1",
				config: "{hello: 'world'}"
			},
			{
				tool: "tool-2",
				config: "{lorem: 'ipsum'}"
			}
		]
	},
	{
		id: "8ffc9608-4c3d-4fca-b4fc-3768822d6c0d",
		name: "Test_Assignment 05 (Java) Invisible",
		state: "INVISIBLE",
		type: "HOMEWORK",
		points: 100,
		collaboration: "GROUP_OR_SINGLE"
	},
	{
		id: "5b69db81-edbd-4f73-8928-1450036a75cb",
		name: "Test_Assignment 06 (Java) Testat In Progress",
		state: "IN_PROGRESS",
		startDate: "2020-08-02T00:00:00.000Z",
		type: "TESTAT",
		points: 100,
		collaboration: "SINGLE"
	},
	{
		id: "f50b8474-1fb9-4d69-85a2-76648d0fd3f9",
		name: "Test_Assignment 08 (Java) - GROUP - IN_REVIEW",
		state: "IN_REVIEW",
		startDate: "2020-08-21T00:00:00.000Z",
		endDate: "2020-08-22T00:00:00.000Z",
		type: "HOMEWORK",
		points: 100,
		collaboration: "GROUP"
	},
	{
		id: "993b3cd0-6207-11ea-bc55-0242ac130003",
		name: "Test_Assignment 03 (Java) - SINGLE - IN_REVIEW",
		state: "IN_REVIEW",
		startDate: "2020-06-11T00:00:00.000Z",
		endDate: "2020-06-18T00:00:00.000Z",
		type: "HOMEWORK",
		points: 100,
		collaboration: "SINGLE"
	},
	{
		id: "c2bc4aa4-6207-11ea-bc55-0242ac130003",
		name: "Test_Assignment 04 (Java)",
		state: "EVALUATED",
		startDate: "2020-05-04T00:00:00.000Z",
		endDate: "2020-05-11T00:00:00.000Z",
		type: "HOMEWORK",
		points: 100,
		collaboration: "GROUP_OR_SINGLE"
	},
	{
		id: "75b799a1-a406-419b-a448-909aa3d34afa",
		name: "Test_Assignment 07 (Java) Testat Evaluated",
		state: "EVALUATED",
		startDate: "2020-04-20T00:00:00.000Z",
		endDate: "2020-04-27T00:00:00.000Z",
		type: "TESTAT",
		points: 100,
		collaboration: "SINGLE"
	},
	{
		id: "74aa124c-0753-467f-8f52-48d1901282f8",
		name: "Test_Assignment 02 (Java)",
		state: "CLOSED",
		startDate: "2020-02-09T00:00:00.000Z",
		endDate: "2020-02-16T00:00:00.000Z",
		type: "HOMEWORK",
		points: 100,
		collaboration: "GROUP"
	}
];
