import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { CourseConfigService, ParticipantDto } from "../../../../../api";
import { getRouteParam } from "../../../../../utils/helper";
import { ToastService } from "../../../shared/services/toast.service";

type AdmissionFromPreviousResponse = { matrNrs: number[]; participants: ParticipantDto[] };

@Component({
	selector: "app-admission-from-previous-semester-form",
	templateUrl: "./admission-from-previous-semester-form.component.html",
	styleUrls: ["./admission-from-previous-semester-form.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdmissionFromPreviousSemesterFormComponent implements OnInit {
	courseId: string;
	dataSource = new MatTableDataSource<{
		matrNr: number;
		participant: ParticipantDto | undefined;
	}>([]);
	displayedColumns = ["matrNr", "participant.displayName", "participant.email", "spacer"];
	matrNrs = "";

	constructor(
		private configService: CourseConfigService,
		private route: ActivatedRoute,
		private toast: ToastService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.loadAdmissionFromPreviousSemester(this.courseId);
	}

	loadAdmissionFromPreviousSemester(courseId: string): void {
		this.configService
			.getAdmissionFromPreviousSemester(courseId)
			.subscribe((admission: AdmissionFromPreviousResponse) => {
				this.mapAdmissionData(admission);
			});
	}

	save(): void {
		const matrNrList = this.matrNrs
			?.split("\n")
			.filter(s => s.length > 0)
			.map(nr => Number(nr.trim()));

		this.configService.setAdmissionFromPreviousSemester(matrNrList, this.courseId).subscribe({
			next: admission => {
				this.mapAdmissionData(admission);
				this.toast.success("Domain.AdmissionFromPreviousSemester", "Message.Saved");
			},
			error: error => {
				this.toast.apiError(error);
			}
		});
	}

	private mapAdmissionData(admission: any): void {
		this.mapToDataSource(admission);
		this.mapToString(admission);
		this.cdRef.detectChanges();
	}

	private mapToString(admission: AdmissionFromPreviousResponse): void {
		let str = "";
		admission.matrNrs.forEach(n => (str += n + "\n"));
		this.matrNrs = str;
	}

	private mapToDataSource(admission: AdmissionFromPreviousResponse): void {
		const data: { matrNr: number; participant: ParticipantDto | undefined }[] = [];

		admission.matrNrs.forEach(matrNr => {
			const participant = admission.participants.find(p => p.matrNr == matrNr);
			data.push({ matrNr, participant });
		});

		this.dataSource.data = data;
	}
}
