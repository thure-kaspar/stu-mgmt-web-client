import { UserDto } from "@student-mgmt/api-client";

export const USER: UserDto = {
	id: "a019ea22-5194-4b83-8d31-0de0dc9bca53",
	matrNr: 123456,
	email: "max.mustermann@test.com",
	username: "mmustermann",
	displayName: "Max Mustermann",
	role: "USER",
	courses: [
		{
			id: "java-wise1920",
			shortname: "java",
			semester: "wise1920",
			title: "Programmierpraktikum I: Java",
			isClosed: false,
			links: [{ name: "Example URL", url: "http://example-url.com" }]
		},
		{
			id: "java-wise2021",
			shortname: "java",
			semester: "wise2021",
			title: "Programmierpraktikum I: Java",
			isClosed: false,
			links: [{ name: "Example URL", url: "http://example-url.com" }]
		},
		{
			id: "java-wise2122",
			shortname: "java",
			semester: "wise2122",
			title: "Programmierpraktikum I: Java",
			isClosed: false,
			links: [{ name: "Example URL", url: "http://example-url.com" }]
		}
	]
};
