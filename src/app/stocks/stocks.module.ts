import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';
import { StocksComponent } from './stocks.component';
import { SharedModule } from '../shared/shared.module';
import { StocksRoutingModule } from './stocks-routing.module';
import { stocksReducer } from './stocks.reducer';

import { SearchComponent } from './search/search.component';
import { FollowStocksComponent } from './followed/follow-stocks.component';
import { StockChartComponent } from './followed/charts/stock-chart.component';
import { HighchartsChartModule  } from 'highcharts-angular';
@NgModule({
  declarations: [
    StocksComponent,
    SearchComponent,
    FollowStocksComponent,
    StockChartComponent
  ],
  imports: [
    SharedModule,
    StocksRoutingModule,
    HighchartsChartModule, 
    StoreModule.forFeature('tradingStocks', stocksReducer)
  ],
  entryComponents: []
})
export class StocksModule {}
