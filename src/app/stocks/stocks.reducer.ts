import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

import {
  stockActions,
  SEARCH,
  FOLLOW,
  UNFOLLOW_AVAILABLE_STOCK} from './stocks.actions';
import { Company } from './company.model';
import * as fromRoot from '../app.reducer';
import { Stock } from './stock.model';

export interface StocksState {
  availableStocks: Company[];
  followedStocks: Stock[];
  unfollowedStocks: Company;
}



export interface State extends fromRoot.State {
  stocks: StocksState;
}

const initialState: StocksState = {
  availableStocks: [],
  followedStocks: [],
  unfollowedStocks: null
};

export function stocksReducer(state = initialState, action: stockActions) {
  switch (action.type) {
    case SEARCH:
      return {
        ...state,
        availableStocks: action.payload
      };
    case FOLLOW:
      return {
        ...state,
        followedStocks: action.payload
      };
    case UNFOLLOW_AVAILABLE_STOCK:
      return {
        ...state,
        followedStocks: action.payload
      };

    default: {
      return state;
    }
  }
}

export const getStocksState = createFeatureSelector<StocksState>('tradingStocks');
export const getFoundStocks = createSelector(getStocksState, (state: StocksState) => state.availableStocks);
export const getIsFollowingStocks = createSelector(getStocksState, (state: StocksState) => state.followedStocks != null);
export const getFollowedStocks = createSelector(getStocksState, (state: StocksState) => state.followedStocks);
