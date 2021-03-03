import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { HttpResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

@Component({
	selector: "app-paginator",
	templateUrl: "./paginator.component.html",
	styleUrls: ["./paginator.component.scss"]
})
export class Paginator implements OnInit {
	/** The total number of items. (Default: 0) */
	@Input() totalCount = 0;
	/** The number of items that should be displayed on a single page. (Default: 15) */
	@Input() pageSize = 15;
	/** Set of provided page size options. */
	@Input() pageSizeOptions = [5, 15, 25, 50, 500];

	/** Zero-based index of the current page. (Default: 0) */
	_currentPage = 0;

	@Output() onPageChanged = new EventEmitter<void>();
	@ViewChild(MatPaginator, { static: true }) private matPaginator: MatPaginator;

	constructor(private translate: TranslateService) {}

	ngOnInit(): void {
		this.matPaginator._intl.itemsPerPageLabel = this.translate.instant(
			"Misc.Paginator.ItemsPerPageLabel"
		);
		this.matPaginator._intl.nextPageLabel = this.translate.instant(
			"Misc.Paginator.NextPageLabel"
		);
		this.matPaginator._intl.previousPageLabel = this.translate.instant(
			"Misc.Paginator.PreviousPageLabel"
		);
		this.matPaginator._intl.firstPageLabel = this.translate.instant(
			"Misc.Paginator.FirstPageLabel"
		);
		this.matPaginator._intl.lastPageLabel = this.translate.instant(
			"Misc.Paginator.LastPageLabel"
		);
		this.matPaginator._intl.getRangeLabel = (a, b, c) =>
			this.translate.instant("Misc.Paginator.RangeLabel", {
				currentPage: this._currentPage + 1,
				numberOfPages: this.matPaginator.getNumberOfPages()
			});
	}

	/** Move to first page, if not already there. */
	goToFirstPage(): void {
		this.matPaginator.firstPage();
	}

	/** Move to last page, if not already there. */
	goToLastPage(): void {
		this.matPaginator.lastPage();
	}

	/** Calculates the amount of records that should be skipped based on the current pagination settings. */
	getSkip(): number {
		return this._currentPage * this.pageSize;
	}

	/**
	 * Returns a tuple containing the `skip` and `take` values corresponding to the current pagination settings.
	 * @example const [skip, take] = this.paginator.getSkipAndTake();
	 */
	getSkipAndTake(): [number, number] {
		return [this._currentPage * this.pageSize, this.pageSize];
	}

	/** Sets the totalCount-property by accessing the X-TOTAL-COUNT header of the given HttpResponse.  */
	setTotalCountFromHttp<T>(response: HttpResponse<T>): void {
		this.totalCount = parseInt(response.headers.get("x-total-count"));
	}

	/** Internal method that updates the current page and informs the parent component about the change. */
	_onPageChanged(page: number): void {
		this._currentPage = page;
		this.pageSize = this.matPaginator.pageSize;
		this.onPageChanged.emit();
	}
}
