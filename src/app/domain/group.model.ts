import { GroupDto, GroupEventDto, ParticipantDto } from "../../../api";

export class Group implements GroupDto {
	readonly id?: string;
	readonly name: string;
	readonly password?: string;
	readonly isClosed?: boolean;
	readonly members?: ParticipantDto[];
	readonly history?: GroupEventDto[];

	constructor(dto: GroupDto) {
		this.id = dto.id;
		this.name = dto.name;
		this.password = dto.password;
		this.isClosed = dto.isClosed;
		this.members = dto.members;
		this.history = dto.history;
	}

	/**
	 * Returns `true` if the given userId belongs to a group member.
	 */
	hasMember(userId: string): boolean {
		return !!this.members.find(m => m.userId === userId);
	}
	
}
