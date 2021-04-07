import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable,forkJoin,zip } from 'rxjs';
import { Company } from '../company.model';
import { StocksService } from '../stocks.service';

import * as tradingStocks from '../stocks.reducer';

import * as fromRoot from '../../app.reducer';
import { Companies } from '../companies.model';
import { filter,mergeMap,combineAll} from 'rxjs/operators';
import { HttpResponseBase } from '@angular/common/http';
import { Quote } from '../quote.model';
import { Stock } from '../stock.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { StockChartComponent } from './charts/stock-chart.component';


@Component({
  selector: 'follow-stocks',
  templateUrl: './follow-stocks.component.html',
  styleUrls: ['./follow-stocks.component.css']
})
export class FollowStocksComponent implements OnInit, AfterViewInit {

  
 
  displayedColumns = ['symbol', 'company','followed_stock'];
  expandedElement: Stock;
  dataSource = new MatTableDataSource<Stock>();
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(StockChartComponent, { static: false }) chart: StockChartComponent;

  constructor(
    private stocksService: StocksService,
    private store: Store<tradingStocks.State>
  ) {}

  ngOnInit() {
    this.dataSource.data = [];
   
    
    this.store.select(tradingStocks.getFollowedStocks).subscribe(
      (stocks: Stock[]) => {
        this.dataSource.data = stocks;
        if(!this.expandedElement && stocks.length > 0) {
          this.expandedElement=stocks[0];
          this.expandedElement.expanded = true;
        }
      }
    );
    this.fetchFollowedStocks();
  }

  expandElement(element: Stock){
    console.log(element);
    if(!element){
       return;
    }
    if(this.expandedElement){
      this.expandedElement.expanded = false;
    }
    this.expandedElement = element;
    this.expandedElement.expanded = true;
    this.chart.symbol= this.expandedElement.symbol;
    this.chart.fetchTimeSeriesInfo();
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  unfollow(stock: Stock) {
    if (this.expandedElement && stock.symbol === this.expandedElement.symbol) {
        this.expandedElement = null;
    }
    this.stocksService.unfollowStock(stock);
  }
  fetchFollowedStocks(){
    this.stocksService.fetchFollowedStocks();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
