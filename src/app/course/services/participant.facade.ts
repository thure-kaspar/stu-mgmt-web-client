import { Injectable } from "@angular/core";
import { CourseParticipantsService, GroupDto, ParticipantDto } from "../../../../api";
import { AuthService } from "../../auth/services/auth.service";
import { Participant } from "../../domain/participant.model";
import { CourseFacade } from "./course.facade";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class ParticipantFacade {

	private participantSubject = new BehaviorSubject<Participant>(undefined);
	p$ = this.participantSubject.asObservable();

	private userId: string;

	constructor(private courseParticipants: CourseParticipantsService,
				private courseFacade: CourseFacade,
				private authService: AuthService) {
		
		this.authService.userInfo$.subscribe(info => {
			//console.log("new UserId:", info?.userId);
			if (info) {
				this.userId = info.userId;
			} else {
				this.participantSubject.next(undefined);
				this.userId = undefined;
			}
		});

		this.loadParticipantWhenCourseLoaded();
	}

	/**
	 * Changes the participants group to the given group and emits
	 * the changed participant via `p$`.
	 */
	changeGroup(group: GroupDto): void {
		const participant = this.participantSubject.getValue();

		const dto: ParticipantDto = {
			...participant,
			group: group,
			groupId: group.id
		};

		this.participantSubject.next(new Participant(dto));
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
				this.participantSubject.next(new Participant(participant));
				//console.log("Current participant:", participant);
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
