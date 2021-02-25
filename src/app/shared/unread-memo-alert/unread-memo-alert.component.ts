import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-unread-memo-alert',
  templateUrl: './unread-memo-alert.component.html',
  styleUrls: ['./unread-memo-alert.component.scss']
})
export class UnreadMemoAlertComponent implements OnInit {
  @Input() showAlert: boolean;
  
  constructor() { }

  ngOnInit() {
  }

}