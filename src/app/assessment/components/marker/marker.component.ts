import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { MarkerDto } from "../../../../../api";

@Component({
	selector: "app-marker",
	templateUrl: "./marker.component.html",
	styleUrls: ["./marker.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkerComponent implements OnInit {
	@Input() marker: MarkerDto;
	severityEnum = MarkerDto.SeverityEnum;

	constructor() {}

	ngOnInit(): void {}
}
