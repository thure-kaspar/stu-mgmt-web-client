import { StudentMgmtException } from "../../../api";

/**
 * Given an `error` received from a failed http request to the Student-Management-System's API, 
 * determines wether the error is a `NotACourseMemberException`.
 * @returns True, if the thrown error is a `NotACourseMemberException`.
 */
export function isNotACourseMember(error: any): boolean {
	return error.error?.error === StudentMgmtException.NameEnum.NotACourseMemberException;
}
