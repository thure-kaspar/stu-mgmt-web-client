import { ParticipantDto } from "@student-mgmt/api-client";

export const PARTICIPANT_LECTURER: ParticipantDto = {
	userId: "c17b67ea-d0b7-46bc-a2e0-ea2ec18f441d",
	role: "LECTURER",
	username: "mAdmin",
	displayName: "Mgtm Admin",
	matrNr: 333333,
	email: "mgtm.admin@test.com"
};

export const PARTICIPANT_STUDENT: ParticipantDto = {
	userId: "a019ea22-5194-4b83-8d31-0de0dc9bca53",
	role: "STUDENT",
	username: "mmustermann",
	displayName: "Max Mustermann",
	matrNr: 123456,
	email: "max.mustermann@test.com",
	groupId: "b4f24e81-dfa4-4641-af80-8e34e02d9c4a",
	group: {
		id: "b4f24e81-dfa4-4641-af80-8e34e02d9c4a",
		name: "Testgroup 1",
		isClosed: false,
		hasPassword: true,
		size: 2,
		members: [
			{
				userId: "40f59aad-7473-4455-a3ea-1214f19b2565",
				role: "STUDENT",
				username: "hpeter",
				displayName: "Hans Peter",
				matrNr: 111111,
				email: "hans.peter@test.com"
			},
			{
				userId: "a019ea22-5194-4b83-8d31-0de0dc9bca53",
				role: "STUDENT",
				username: "mmustermann",
				displayName: "Max Mustermann",
				matrNr: 123456,
				email: "max.mustermann@test.com"
			}
		]
	}
};
