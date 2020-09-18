import { Component, OnInit, Input } from '@angular/core';
import { Memo, MemoService } from 'src/app/services/memo.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
  @Input() memo: Memo;

  isConfirmed: boolean;

  constructor(private memoService: MemoService) {}

  ngOnInit() {
    this.memo.date = this.memoService.dateFromFirestore(this.memo.date);
    this.isConfirmed = this.memoService.isMemoConfirmed(this.memo);
  }
}
