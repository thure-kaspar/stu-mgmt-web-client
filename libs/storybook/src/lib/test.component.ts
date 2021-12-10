import { CommonModule } from "@angular/common";
import { Component, Input, NgModule, OnInit } from "@angular/core";

@Component({
	selector: "app-test",
	template: `<div class="bg-green-500 p-4">{{ text }}</div>`
})
export class TestComponent implements OnInit {
	@Input() text: string;

	constructor() {}

	ngOnInit(): void {}
}

@NgModule({
	declarations: [TestComponent],
	exports: [TestComponent],
	imports: [CommonModule]
})
export class TestComponentModule {}
