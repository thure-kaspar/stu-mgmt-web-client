import { CourseDto, GroupSettingsDto, LinkDto } from "../../../api";

export class Course implements CourseDto {
	id?: string;
	shortname: string;
	semester: string;
	title: string;
	isClosed: boolean;
	links?: LinkDto[];

	groupSettings: GroupSettingsDto;

	constructor(dto: CourseDto, groupSettings: GroupSettingsDto) {
		this.id = dto.id;
		this.shortname = dto.shortname;
		this.semester = dto.semester;
		this.title = dto.title;
		this.isClosed = dto.isClosed;
		this.links = dto.links;
		this.groupSettings = groupSettings;
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
