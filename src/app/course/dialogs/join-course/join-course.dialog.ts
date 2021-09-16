import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CanJoinCourseDto, CourseParticipantsService } from "../../../../../api";
import { AuthService } from "../../../auth/services/auth.service";
import { CourseMembershipsFacade } from "../../../shared/services/course-memberships.facade";

/**
 * Dialog that allows a user to join a course.
 * Returns a boolean, indicating, wether the user has joined the course.
 */
@Component({
	selector: "app-join-course",
	templateUrl: "./join-course.dialog.html",
	styleUrls: ["./join-course.dialog.scss"]
})
export class JoinCourseDialog implements OnInit {
	password: string;
	error: string;

	canJoinDto: CanJoinCourseDto;

	constructor(
		private dialogRef: MatDialogRef<JoinCourseDialog, boolean>,
		@Inject(MAT_DIALOG_DATA) public courseId: string,
		private courseParticipantsService: CourseParticipantsService,
		private courseMemberships: CourseMembershipsFacade
	) {}

	ngOnInit(): void {
		const userId = AuthService.getUser().id;
		this.courseParticipantsService
			.canUserJoinCourse(this.courseId, userId)
			.subscribe(result => {
				this.canJoinDto = result;
				this.error = this.canJoinDto.reason;
			});
	}

	onCancel(): void {
		return this.dialogRef.close(false);
	}

	onJoin(): void {
		this.courseMemberships.joinCourse(this.courseId, this.password).subscribe(
			success => this.dialogRef.close(true),
			error => {
				this.error = `Error.${error.error?.error ?? "SomethingWentWrong"}`;
			}
		);
	}
}
