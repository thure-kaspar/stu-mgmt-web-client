import { GroupDto, ParticipantDto } from "../../../api";

export class Participant implements ParticipantDto {
	readonly userId: string;
	readonly username: string;
	readonly displayName: string;
	readonly email: string;
	readonly role: ParticipantDto.RoleEnum;
	readonly groupId?: string;
	readonly group?: GroupDto;
	constructor(dto: ParticipantDto) {
		this.userId = dto.userId;
		this.username = dto.username;
		this.displayName = dto.displayName;
		this.email = dto.email;
		this.role = dto.role;
		this.groupId = dto.groupId;
		this.group = dto.group;
	}

	canCreateAssessment(): boolean {
		return this.isLecturerOrTutor();
	}

	canCreateAssignments(): boolean {
		return this.isLecturerOrTutor();
	}
	
	canCreateGroup(): boolean {
		if (this.isLecturerOrTutor()) return true;

		if (this.groupId) {
			return false; // Student can only have one group
		}

		return true;
	}

	isStudent(): boolean {
		return this.role === "STUDENT";
	}

	isTutor(): boolean {
		return this.role === "TUTOR";
	}

	isLecturer(): boolean {
		return this.role === "LECTURER";
	}

	isLecturerOrTutor(): boolean {
		return this.role === "LECTURER" || this.role === "TUTOR";
	}

}
