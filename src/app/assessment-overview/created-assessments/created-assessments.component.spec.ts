import { AssessmentDto } from "../../../../api";
import { VerticalBarChartData } from "../../charts/components/vertical-bar-chart/vertical-bar-chart.component";
import { CreatedAssessmentsComponent } from "./created-assessments.component";

describe("CreatedAssessmentsComponent", () => {
	let component: CreatedAssessmentsComponent;

	beforeEach(() => {
		component = new CreatedAssessmentsComponent(null, null, null, null, null, null);
	});

	describe("createChartData", () => {
		let achievedPoints: number[];
		let expected: VerticalBarChartData;

		it("test", () => {
			achievedPoints = [0, 0, 1, 2.5, 2.5, 3, 4, 4, 4.5, 5];
			expected = [
				{
					name: "0",
					value: 2
				},
				{
					name: "1",
					value: 1
				},
				{
					name: "2",
					value: 0
				},
				{
					name: "2.5",
					value: 2
				},
				{
					name: "3",
					value: 1
				},
				{
					name: "4",
					value: 2
				},
				{
					name: "4.5",
					value: 1
				},
				{
					name: "5",
					value: 1
				},
				{
					name: "6",
					value: 0
				}
			];
			const assessments: Partial<AssessmentDto>[] = achievedPoints.map(points => ({
				achievedPoints: points
			}));

			const result = component._createChartData(assessments as AssessmentDto[], 6);
			console.log(result);
			expect(result).toEqual(expected);
		});
	});
});
