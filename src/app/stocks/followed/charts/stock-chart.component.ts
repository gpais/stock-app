import { Component,Input, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable,forkJoin,zip } from 'rxjs';
import { filter,mergeMap,combineAll} from 'rxjs/operators';
import { Stock } from '../../stock.model';
import { StocksService } from '../../stocks.service';
import {MessageService} from 'primeng/api';
import {Subscription} from 'rxjs';
import * as Highcharts from 'highcharts';
import { Chart } from 'highcharts';


@Component({
  selector: 'stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.css']
})
export class StockChartComponent implements OnInit, OnDestroy {
  highcharts = Highcharts;
  @Input()
  symbol: string;
  updateFlag = false;
  id: any;
  constructor(
    private stocksService: StocksService
  ) {}
  
  ngOnInit() {
    this.id = setInterval(() => {
       this.fetchTimeSeriesInfo(); 
    }, 60000);
    this.fetchTimeSeriesInfo(); 
  }
  fetchTimeSeriesInfo () {
    this.updateFlag =true;
    this.chartOptions.title.text ="Stock Prices(" + this.symbol + ")";
    this.stocksService.fetchTimesSeriesInfo(this.symbol)
    .subscribe(a=>{
      this.chartOptions['xAxis']['categories'] = a['categories'] ;
       this.chartOptions.series[0] = {
        name: 'open',
        data: a['open']
      }
  
      this.chartOptions.series[1] = {
        name: 'high',
        data: a['high']
      }

      this.chartOptions.series[2] = {
        name: 'low',
        data: a['low']
      }

      this.chartOptions.series[3] = {
        name: 'close',
        data: a['close']
      }
      this.updateFlag =true;
    });
  }
  chartOptions = {   
     chart:{
      type: "spline" 
    },
     title: {
        text: "Stock Prices"
     },
     subtitle: {
        text: "Stock Prices Variations"
     },
     xAxis:{
        categories:["Jan", "Feb", "Mar", "Apr", "May", "Jun",
           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
     },
     yAxis: {          
        title:{
           text:"Daily Prices"
        } 
     },
     tooltip: {
        valueSuffix:" "
     },
     series: [
        {
           name: 'open',
           data: []
        },
        {
           name: 'high',
           data: []
        },
        {
           name: 'low',
           data: []
        },
        {
           name: 'close',
           data: []
        }
     ]
  };


  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }
}