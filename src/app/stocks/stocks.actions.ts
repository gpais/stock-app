import { Action } from '@ngrx/store';

import { Company } from './company.model';
import { Stock } from './stock.model';

export const SEARCH = 'Search Available Stocks';
export const FOLLOW = 'Follow available stocks';
export const UNFOLLOW_AVAILABLE_STOCK = 'Unfollow Available Stocks';


export class setSearchAvailableStocks implements Action {
  readonly type = SEARCH;

  constructor(public payload: Company[]) {}
}

export class SetFollowAvailableStocks implements Action {
  readonly type = FOLLOW;

  constructor(public payload: Stock[]) {}
}

export class UnfollowAvailableStocks implements Action {
  readonly type = UNFOLLOW_AVAILABLE_STOCK;

  constructor(public payload: string) {}
}


export type stockActions =
  | setSearchAvailableStocks
  | SetFollowAvailableStocks
  | UnfollowAvailableStocks;
