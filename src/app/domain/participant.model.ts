import { ParticipantDto } from "../../../api";

export type Participant = ParticipantDto & {
	readonly isStudent: boolean;
	readonly isTeachingStaffMember: boolean;
};

export function createParticipant(dto: ParticipantDto): Participant {
	return {
		...dto,
		isStudent: dto.role === "STUDENT",
		isTeachingStaffMember: dto.role !== "STUDENT"
	};
}
