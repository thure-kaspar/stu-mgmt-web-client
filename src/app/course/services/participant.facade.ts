import { Injectable } from "@angular/core";
import { CourseParticipantsService } from "../../../../api";
import { AuthService } from "../../auth/services/auth.service";
import { Participant } from "../../domain/participant.model";
import { CourseFacade } from "./course.facade";

@Injectable()
export class ParticipantFacade {

	p: Participant;
	private userId: string;

	constructor(private courseParticipants: CourseParticipantsService,
				private courseFacade: CourseFacade,
				private authService: AuthService) {
		
		this.authService.userInfo$.subscribe(info => {
			console.log("new UserId:", info?.userId);
			if (info) {
				this.userId = info.userId;
			} else {
				this.p = undefined;
				this.userId = undefined;
			}
		});

		this.loadParticipantWhenCourseLoaded();
	}

	/**
	 * Loads the `ParticipantDto` and stores it in `participant` to allow other component
	 * to lookup information about the user's account in the context of a specific course
	 * (i.e. role in course).
	 * Should be invoked whenever a course is loaded.
	 */
	private loadParticipant(courseId: string, userId: string): void {
		this.courseParticipants.getParticipant(courseId, userId).subscribe(
			participant => {
				this.p = new Participant(participant);
				console.log("Current participant:", participant);
			}
		);
	}

	private loadParticipantWhenCourseLoaded(): void {
		this.courseFacade.course$.subscribe(
			course => {
				if (course && this.userId) {
					this.loadParticipant(course.id, this.userId);	
				}
			}
		);
	}

}
