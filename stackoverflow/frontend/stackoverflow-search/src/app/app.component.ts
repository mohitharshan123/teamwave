import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from "@angular/core";
import { StackSearchService } from "./service/stack-search.service";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { Observable } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, AfterViewInit {
  sortOptions = ["activity", "votes", "creation", "relevance"];
  filterForm: FormGroup = null;
  length = Infinity;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  obs: Observable<any>;

  constructor(
    private searchService: StackSearchService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.search();
  }

  ngOnInit() {
    this.setUpForm();
  }

  setUpForm() {
    this.filterForm = this.formBuilder.group({
      fromdate: new FormControl(null),
      todate: new FormControl(""),
      order: new FormControl("desc"),
      min: new FormControl(null),
      max: new FormControl(null),
      sort: new FormControl("activity"),
      q: new FormControl(""),
      accepted: new FormControl(false),
      answers: new FormControl(null),
      body: new FormControl(""),
      closed: new FormControl(false),
      migrated: new FormControl(false),
      notice: new FormControl(false),
      nottagged: new FormControl(""),
      tagged: new FormControl(""),
      title: new FormControl(""),
      user: new FormControl(""),
      url: new FormControl(""),
      views: new FormControl(""),
      wiki: new FormControl(false),
    });
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.search();
  }

  search() {
    this.searchService
      .search({
        ...this.filterForm.value,
        pagesize: this.paginator?.pageSize,
        page: this.paginator?.pageIndex,
      })
      .subscribe(
        (searchResults: any) => {
          this.dataSource = new MatTableDataSource(searchResults.items);
          this.obs = this.dataSource.connect();
            setTimeout(() => {
              this.length = Infinity;
            }, 100);
          this.changeDetectorRef.detectChanges();
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
