import {
	AdmissionCriteriaDto,
	CourseDto,
	GroupSettingsDto,
	LinkDto
} from "@student-mgmt/api-client";

export class Course implements CourseDto {
	id: string;
	shortname: string;
	semester: string;
	title: string;
	isClosed: boolean;
	links?: LinkDto[];
	groupSettings: GroupSettingsDto;
	admissionCriteria: AdmissionCriteriaDto;

	constructor(dto: CourseDto) {
		this.id = dto.id;
		this.shortname = dto.shortname;
		this.semester = dto.semester;
		this.title = dto.title;
		this.isClosed = dto.isClosed;
		this.links = dto.links;
		this.groupSettings = dto.groupSettings;
		this.admissionCriteria = dto.admissionCriteria;
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
