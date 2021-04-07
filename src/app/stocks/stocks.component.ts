import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { StocksService } from './stocks.service';
import * as tradingStocks from './stocks.reducer';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  ongoingFollowingStocks$: Observable<boolean>;

  constructor(private stocksService: StocksService, private store: Store<tradingStocks.State>) {}

  ngOnInit() {
    this.ongoingFollowingStocks$ = this.store.select(tradingStocks.getIsFollowingStocks);
  }
}
