import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';
import { Company } from './company.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as stockActions from './stocks.actions';
import * as tradingStocks from './stocks.reducer';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { filter,mergeMap,combineAll} from 'rxjs/operators';
import { Quote } from './quote.model';
import { Stock } from './stock.model';
import { AuthService } from '../auth/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class StocksService {
  private fbSubs: Subscription[] = [];
  private mapper = {
    '1. symbol': 'symbol',
    '2. name': 'name',
    '3. type': 'type',
    '4. region': 'region',
    '5. marketOpen': 'marketOpen',
    '6. marketClose': 'marketClose',
    '7. timezone': 'timezone',
    '8. currency': 'currency',
    '9. matchScore': 'matchScore',
    '01. symbol': 'symbol',
    '02. open': 'open',
    '03. high': 'high',
    '04. low':  'low',
    '05. price':  'price',
    '06. volume': 'volume',
    '07. latest trading day':  'latest_trading_day',
    '08. previous close':  'close',
    '09. change':  'change',
    '10. change percent':  'change_percent' 
  };
  constructor(
    private http: HttpClient,
    private db: AngularFirestore,
    private uiService: UIService,
    private afAuth: AngularFireAuth,
    private store: Store<tradingStocks.State>

  ) {}

  queryCompanies(symbol: string): Observable<Company[]> {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=`+symbol+`&apikey=`+ environment.alpha_advantage_api_key;
    return   this.http.get(url)
    .pipe(filter(companies => companies['bestMatches'] && companies['bestMatches'].length > 0))
    .map((res: Response)=>res['bestMatches'])
    .map((companies: Company[]) =>{
      for(let i=0; i<companies.length ; i++){
        const keys=Object.keys(companies[i])
        for(let j=0; j<keys.length ; j++){
          if(this.mapper[keys[j]]) {
            companies[i][this.mapper[keys[j]]] =companies[i][keys[j]];
            delete companies[i][keys[j]];
          }
        }
      }
      return companies;
    });
  }

  queryStocks(company: Company): Observable<Quote> {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=`+company.symbol+`&apikey=`+ environment.alpha_advantage_api_key;
    return   this.http.get(url)
    .map(res=>{
              if(res && res['Global Quote'] ) {
                return  res['Global Quote'];
              }
              return {};})
    .map((res: Quote)=> {
      res['name'] =  company.name;
      res['companyType'] =  company.type;
      res['symbol'] =  company.symbol;
      res['followed_stock'] = false;
      res['open'] = 0;
      res['high'] = 0;
      res['low'] = 0;
      res['price'] = 0;
      res['volume'] = 0;
      res['close'] = 0;
      res['change_percent'] =' 0';

      const keys=Object.keys(res)
      for(let j=0; j<keys.length ; j++) {
        if(this.mapper[keys[j]]) {
          if(res[keys[j]]){
            res[this.mapper[keys[j]]] =res[keys[j]];
          }
          delete res[keys[j]];
        }
      }
      return res;
    });
  }

  fetchTimesSeriesInfo(symbol: string) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=`+symbol+`&interval=1min&apikey=`+ environment.alpha_advantage_api_key;
     return   this.http.get(url)
     .pipe(filter(a=>a && a["Time Series (1min)"]))
     .map(a=>{
       const val = {};
       val['categories'] = Object.keys(a["Time Series (1min)"]);
       val['categories'].reverse()
       const close = [];
       const open =[];
       const high = [];
       const low = [];
       const volume = [];
       for (var i =0; i<val['categories'].length; i++) {
         const info =val['categories'][i];
         open.push(Number(a["Time Series (1min)"][info]['1. open']))
         high.push(Number(a["Time Series (1min)"][info]['2. high']))
         low.push(Number(a["Time Series (1min)"][info]['3. low']))
         close.push(Number(a["Time Series (1min)"][info]['4. close']));
         volume.push(Number(a["Time Series (1min)"][info]['5. volume']));
       }
       val['open']  = open;
       val['high']  = high;
       val['low']  = low;
       val['close']  = close;
       val['volume']  = volume;
       
       return val;
     });
    }
  searchForStocks(stocks: string) {
    environment.alpha_advantage_api_key
  
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=I&apikey=`+ environment.alpha_advantage_api_key;
    this.store.dispatch(new UI.StartLoading());
    return   this.fbSubs.push(this.http.get(url)
    .subscribe((data: Company[]) => {
             this.store.dispatch(new UI.StopLoading());
              this.store.dispatch(new stockActions.setSearchAvailableStocks(data));
    }, 
    error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(
              'Fail Searching for Stocks',
              null,
              3000 );
    }));
  
  }


    cancelSubscriptions() {
       this.fbSubs.forEach(sub => sub.unsubscribe());
    }


    fetchFollowedStocks() {
    this.fbSubs.push(
      this.db
        .collection('followedStocks', ref => ref.where('userId', '==', this.afAuth.auth.currentUser.uid))
        .valueChanges()
        .subscribe((stocks: Stock[]) => {
          this.store.dispatch(new stockActions.SetFollowAvailableStocks(stocks));
        })
    );
  }
  unfollow(quote: Quote) {
    this.db.collection('followedStocks').doc(this.afAuth.auth.currentUser.uid+"-"+quote.symbol).delete().then(() => {
      console.log("Document successfully deleted!");
  }).catch((error) => {
      console.error("Error removing document: ", error);
  });
  }

  unfollowStock(stock: Stock) {
    this.db.collection('followedStocks').doc(this.afAuth.auth.currentUser.uid+"-"+stock.symbol).delete().then(() => {
      console.log("Document successfully deleted!");
  }).catch((error) => {
      console.error("Error removing document: ", error);
  });
  }
  follow(quote: Quote) {
    var stock: Stock = { symbol: quote.symbol, company: quote.name,purchased: false, followed: quote.followed_stock, followedDate: new Date(), userId: this.afAuth.auth.currentUser.uid, expanded: false};
    this.db.collection('followedStocks').doc(stock.userId+"-"+stock.symbol).set(stock);
  }
}
