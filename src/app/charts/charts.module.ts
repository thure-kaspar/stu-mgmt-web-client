import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { VerticalBarChartComponent } from "./components/vertical-bar-chart/vertical-bar-chart.component";
import { StatCardComponent } from "./components/stat-card/stat-card.component";

@NgModule({
	declarations: [VerticalBarChartComponent, StatCardComponent],
	imports: [CommonModule, NgxChartsModule],
	exports: [VerticalBarChartComponent, StatCardComponent]
})
export class ChartsModule {}
