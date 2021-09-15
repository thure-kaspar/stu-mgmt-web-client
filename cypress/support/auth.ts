import { UserDto } from "../../api";

type AuthInfo = {
	user: UserDto;
	accessToken: string;
};

const mgmtAdmin: AuthInfo = {
	user: {
		id: "c17b67ea-d0b7-46bc-a2e0-ea2ec18f441d",
		matrNr: 333333,
		email: "mgtm.admin@test.com",
		username: "mAdmin",
		displayName: "Mgtm Admin",
		role: "MGMT_ADMIN",
		courses: [
			{
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
				]
			},
			{
				id: "info2-sose2020",
				shortname: "info2",
				semester: "sose2020",
				title: "Informatik II: Algorithmen und Datenstrukturen",
				isClosed: false,
				links: [
					{
						name: "Example URL",
						url: "http://example-url.com"
					}
				]
			}
		]
	},
	accessToken: "mAdmin"
};

const student: AuthInfo = {
	user: {
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
				links: [
					{
						name: "Example URL",
						url: "http://example-url.com"
					}
				]
			}
		]
	},
	accessToken: "mmustermann"
};

const notInCourse: AuthInfo = {
	user: {
		id: "57951d37-df30-4133-990f-fd12cee5f1bd",
		matrNr: 999999,
		email: "not.in.course@test.com",
		username: "notInCourse",
		displayName: "notInCourse",
		role: "USER",
		courses: []
	},
	accessToken: "notInCourse"
};

export const account = {
	/** Account with `MGMT_ADMIN` role that is `LECTURER` in java-wise1920. */
	mgmtAdmin,
	/** Account with `USER` role that is `STUDENT` in java-wise1920. */
	student,
	/** Account with `USER` role that is not a member of any course. */
	notInCourse
};

/**
 * Writes the given `account` information to the browser's `localStorage`, so it is used for
 * authenticated requests to the backend.
 *
 * @param account Object that would be returned from the API's `/auth/whoAmI` route.
 */
export function useAccount(account: AuthInfo): void {
	window.localStorage.setItem("studentMgmtToken", JSON.stringify(account));
}
