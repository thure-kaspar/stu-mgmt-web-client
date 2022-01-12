import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { StatCardComponentModule } from "./components/stat-card/stat-card.component";
import { VerticalBarChartComponent } from "./components/vertical-bar-chart/vertical-bar-chart.component";

@NgModule({
	declarations: [VerticalBarChartComponent],
	imports: [CommonModule, NgxChartsModule, StatCardComponentModule],
	exports: [VerticalBarChartComponent, StatCardComponentModule]
})
export class ChartsModule {}
