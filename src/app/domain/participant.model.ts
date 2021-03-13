import { GroupDto, ParticipantDto } from "../../../api";

export class Participant implements ParticipantDto {
	readonly userId: string;
	readonly username: string;
	readonly displayName: string;
	readonly email?: string;
	readonly role: ParticipantDto.RoleEnum;
	readonly groupId?: string;
	readonly group?: GroupDto;

	readonly isStudent: boolean;
	readonly isTeachingStaffMember: boolean;

	constructor(dto: ParticipantDto) {
		this.userId = dto.userId;
		this.username = dto.username;
		this.displayName = dto.displayName;
		this.email = dto.email;
		this.role = dto.role;
		this.groupId = dto.groupId;
		this.group = dto.group;

		this.isStudent = this.role === "STUDENT";
		this.isTeachingStaffMember = this.role === "LECTURER" || this.role === "TUTOR";
	}
}
