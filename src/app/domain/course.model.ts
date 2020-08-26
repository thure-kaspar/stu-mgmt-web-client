import { CourseDto, GroupSettingsDto } from "../../../api";

export class Course implements CourseDto {

	id?: string;
	shortname: string;
	semester: string;
	title: string;
	isClosed: boolean;
	link?: string;

	groupSettings: GroupSettingsDto;

	constructor(dto: CourseDto) {
		this.id = dto.id;
		this.shortname = dto.shortname;
		this.semester = dto.semester;
		this.title = dto.title;
		this.isClosed = dto.isClosed;
		this.link = dto.link;
	}

	setGroupSettings(dto: GroupSettingsDto): void {
		this.groupSettings = dto;
	}

	hasGroupNamingRule(): boolean {
		return !!this.groupSettings.nameSchema;
	}

	hasMinGroupSizeRequirement(): boolean {
		return !!this.groupSettings.sizeMin;
	}

	getMinGroupSizeRequirement(): number {
		return this.groupSettings.sizeMin;
	}

	getMaxAllowedGroupSize(): number {
		return this.groupSettings.sizeMax;
	}

}
