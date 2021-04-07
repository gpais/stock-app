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


@Component({
  selector: 'search-stocks',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent
  implements OnInit, AfterViewInit {

  
 
  displayedColumns = ['symbol', 'name', 'companyType', 'close', 'volume','price','change','change_percent','latest_trading_day','followed_stock'];
  dataSource = new MatTableDataSource<Quote>();
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private stocksService: StocksService,
    private store: Store<tradingStocks.State>
  ) {}

  ngOnInit() {
    this.dataSource.data = [];
  }

 

  

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  follow(element: Quote){
     if(element.followed_stock) {
      this.stocksService.follow(element);
     }
     else {
      this.stocksService.unfollow(element);
     }
  }
  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (filterValue && filterValue.length > 0 )
    {
      this.stocksService.queryCompanies( this.dataSource.filter)
      .map(companies=> companies.map(a=>this.stocksService.queryStocks(a)))
      .pipe( mergeMap(queries=> forkJoin(queries)))
      // .map(quotes=>quotes.filter(quote=>quote && quote.close))
      .subscribe((quotes) =>{
          this.dataSource.data = quotes;
      });
    }
  
    else {
      this.dataSource.data = [];
    }
  }
}
