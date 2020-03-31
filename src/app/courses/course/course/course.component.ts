import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CourseDto, CoursesService } from "../../../../../api";

@Component({
	selector: "app-course",
	templateUrl: "./course.component.html",
	styleUrls: ["./course.component.scss"]
})
export class CourseComponent implements OnInit {

	course: CourseDto;

	navLinks = [
		{ label: "Groups", path: "groups"},
		{ label: "Users", path: "users"}
	];

	selectedTab = 0;
	tabIndexMap = new Map([
		["assignments", 0],
		["groups", 1],
		["users", 2]
	]);

	constructor(private route: ActivatedRoute,
				private router: Router,
				private courseService: CoursesService) { }

	ngOnInit(): void {
		const semester = this.route.snapshot.paramMap.get("semester");
		const name = this.route.snapshot.paramMap.get("name");
		this.courseService.getCourseByNameAndSemester(name, semester).subscribe(
			result => {
				this.course = result;
				this.route.fragment.subscribe(
					result => this.selectedTab = this.tabIndexMap.get(result),
					error => console.log(error)
				);
			},
			error => this.router.navigate(["/404"])
		);
	}

	handleTabChange(index: number): void {
		const tabName = this.getTabName(index);
		this.router.navigate([], { fragment: tabName });
	}

	private getTabName(index: number): string {
		switch (index) {
		case 0: return "assignments";
		case 1: return "groups";
		case 2: return "users";
		default: return null;
		}
	}

}
