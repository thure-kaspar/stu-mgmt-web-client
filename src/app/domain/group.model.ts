import { GroupDto, GroupEventDto, ParticipantDto } from "../../../api";
import { Course } from "./course.model";
import { Participant } from "./participant.model";

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

	canBeClosed(participant: Participant, course: Course): boolean {
		if (participant.isTeachingStaffMember) {
			return true;
		}
		if (!course.hasMinGroupSizeRequirement()) {
			return true;
		}
		if (course.getMinGroupSizeRequirement() < this.members.length) {
			return true;
		}

		return false;
	}

	canBeRenamed(participant: Participant, course: Course): boolean {
		if (participant.isTeachingStaffMember) {
			return true;
		}
		if (!course.hasGroupNamingRule()) {
			return true;
		}

		return false;
	}

	isFull(course: Course): boolean {
		return this.members.length >= course.getMaxAllowedGroupSize();
	}
	
	hasNotEnoughMembers(course: Course): boolean {
		return this.members.length < course.getMinGroupSizeRequirement();
	}
	
}
