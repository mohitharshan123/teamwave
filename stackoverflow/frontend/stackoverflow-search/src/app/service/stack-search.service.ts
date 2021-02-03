import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StackSearchService {
  baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = "http://localhost:8000/search/";
  }

  search(queryParamDict) {
    let params = new HttpParams();
    Object.keys(queryParamDict).forEach((p) => {
      if (queryParamDict[p]) {
        params = params.append(p.toString(), queryParamDict[p].toString());
      }
    });
    params = params.append("site", "stackoverflow");
    const observable = this.http
      .get(this.baseUrl, { params: params })
      .pipe(catchError(this.errorHandler));
    return observable;
  }

  errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError("An Error occurred");
  }
}
