import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	NgModule,
	OnInit
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ToastService } from "@student-mgmt-client/services";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import { CourseConfigApi, ParticipantDto } from "@student-mgmt/api-client";

type AdmissionFromPreviousResponse = { matrNrs: number[]; participants: ParticipantDto[] };

@Component({
    selector: "student-mgmt-admission-from-previous-semester-form",
    templateUrl: "./admission-from-previous-semester-form.component.html",
    styleUrls: ["./admission-from-previous-semester-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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
		private configService: CourseConfigApi,
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

@NgModule({
	declarations: [AdmissionFromPreviousSemesterFormComponent],
	exports: [AdmissionFromPreviousSemesterFormComponent],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatTableModule,
		TranslateModule
	]
})
export class AdmissionFromPreviousSemesterFormComponentModule {}
