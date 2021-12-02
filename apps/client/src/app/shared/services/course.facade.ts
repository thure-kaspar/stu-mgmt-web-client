import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { CourseSelectors } from "../../state/course";

@Injectable({ providedIn: "root" })
export class CourseFacade {
	course$ = this.store.select(CourseSelectors.selectCourse);

	constructor(private store: Store) {}
}
