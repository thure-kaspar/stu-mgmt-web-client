import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "@student-mgmt-client/auth";
import { Paginator } from "@student-mgmt-client/shared-ui";
import { getSemesterList, UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import { CourseApi, CourseDto, UserDto } from "@student-mgmt/api-client";
import { OAuthService } from "angular-oauth2-oidc";
import { BehaviorSubject, debounceTime, Subject } from "rxjs";

type CourseFilter = {
	title?: string;
	shortname?: string;
	selectedSemester?: string;
};

@Component({
    selector: "student-mgmt-course-list",
    templateUrl: "./course-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CourseListComponent extends UnsubscribeOnDestroy implements OnInit {
	displayedColumns: string[] = ["semester", "title"];
	dataSource$ = new BehaviorSubject(new MatTableDataSource<CourseDto>([]));

	filter: CourseFilter = {};
	nameFilterChanged = new Subject<void>();

	roles = UserDto.RoleEnum;
	semesters = getSemesterList();

	@ViewChild(Paginator, { static: true }) private paginator!: Paginator;

	constructor(private courseApi: CourseApi, public auth: AuthService,
		private readonly oauthService: OAuthService
	) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.nameFilterChanged
			.pipe(debounceTime(300))
			.subscribe(() => this.searchCourses());

		this.searchCourses();
		
		// Periodically checks if user is logged in. Then updates user data with accessToken.
		// The code below has to exist on the page the user is redirected to from the identity provider.
		const interval = setInterval(() => {
			if (this.oauthService.getAccessToken()) { // Stops interval if regular login (with Identity provider) is used
				clearInterval(interval);
				this.auth.updateUserData(this.oauthService.getAccessToken()).subscribe({
					error: error => {
						console.error(error);
					}
				});
			} else if (AuthService.getAccessToken()) { // Stops interval if developer login is used
				clearInterval(interval);
			} else {
				console.debug("Token not yet available");
			}
		}, 800)
	}

	searchCourses(triggeredByPaginator = false): void {
		const [skip, take] = this.paginator.getSkipAndTake();

		this.courseApi
			.getCourses(
				skip,
				take,
				this.filter.shortname,
				this.filter.selectedSemester,
				this.filter.title,
				"response"
			)
			.subscribe({
				next: response => {
					if (!triggeredByPaginator) this.paginator.goToFirstPage();
					this.paginator.setTotalCountFromHttp(response);
					this.dataSource$.next(new MatTableDataSource(response.body!));
				},
				error: error => {
					console.log(error);
				}
			});
	}
}
