import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	Output
} from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "student-mgmt-addable-list-header",
    templateUrl: "./addable-list-header.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AddableListHeaderComponent {
	@Input() name!: string;
	@Output() addClicked = new EventEmitter<void>();
}

@NgModule({
	imports: [CommonModule, TranslateModule],
	declarations: [AddableListHeaderComponent],
	exports: [AddableListHeaderComponent]
})
export class AddableListHeaderComponentModule {}
