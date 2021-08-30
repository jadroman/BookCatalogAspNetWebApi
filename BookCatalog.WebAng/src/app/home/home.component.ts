import { HttpClient } from '@angular/common/http';
import { Component, isDevMode, OnInit } from '@angular/core';
import { DialogInfoService } from '../shared/dialog-info/dialog-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public homeText: string | undefined;
  constructor(private http: HttpClient,
    private errorDialogService: DialogInfoService) { }

  ngOnInit(): void {
    this.homeText = "welcome to book catalog app";
  }

  localError() {
    //this.errorDialogService.openDialog('asd', 200);
    throw Error("The app component has thrown an error!");
  }

  failingRequest() {
    this.http.get("https://httpstat.us/404?sleep=2000").toPromise();
  }

  successfulRequest() {
    this.http.get("https://httpstat.us/200?sleep=2000").toPromise();
  }
}
