import { Component, OnInit } from "@angular/core";
import { GroupsService, GroupDto } from "../../../../../api";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../auth/services/auth.service";

@Component({
	selector: "app-group-detail",
	templateUrl: "./group-detail.component.html",
	styleUrls: ["./group-detail.component.scss"]
})
export class GroupDetailComponent implements OnInit {

	group: GroupDto;

	constructor(private groupService: GroupsService,
				private authService: AuthService,
				private route: ActivatedRoute,) { }

	ngOnInit(): void {
		const groupId = this.route.snapshot.paramMap.get("groupId");
		this.groupService.getGroup("java-wise1920", groupId).subscribe(
			result => { this.group = result; },
			error => console.log(error)
		);
	}

}
