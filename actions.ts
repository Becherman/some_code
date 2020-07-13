import { ThunkAction } from 'redux-thunk';
import { ActionCreator } from 'redux';
import { AppState } from 'types/AppState';
import * as actionTypes from './actionTypes';
import {
  CalendarSearchParams,
  CalendarActionCreators,
  SaveData,
  LoadingFailed,
  SetIsLoadingFlagTo,
  SavePossibleDepartureDays,
} from './types';
import { CalendarData, PossibleDepartureDay } from 'types/CalendarData';
import {
  httpService,
  API_URL_PACKAGE,
  calculateCalendarDateRange,
} from 'util/index';
import { getMarket, getLanguage } from 'selectors/user';
import { calculateTravellers } from 'helpers/travellers';
import { getOdpSearchParams } from 'selectors/searchParams';

export const saveData: ActionCreator<SaveData> = (
  data: CalendarData,
): SaveData => ({
  type: actionTypes.SAVE_DATA,
  payload: data,
});

export const setIsLoadingFlagTo: ActionCreator<SetIsLoadingFlagTo> = (
  flag: boolean,
) => ({
  type: actionTypes.SET_IS_LOADING_FLAG_TO,
  payload: flag,
});

export const loadingFailed: ActionCreator<LoadingFailed> = () => ({
  type: actionTypes.LOADING_FAILED,
});

export const savePossibleDepartureDays: ActionCreator<SavePossibleDepartureDays> = (
  days: PossibleDepartureDay[],
) => ({
  type: actionTypes.SAVE_POSSIBLE_DEPARTURE_DAYS,
  payload: days,
});

// Async Actions

export const fetchCalendarData = (
  params?: Partial<CalendarSearchParams>,
): ThunkAction<Promise<void>, AppState, {}, CalendarActionCreators> => async (
  dispatch,
  getState,
): Promise<void> => {
  // collecting data for the package-offer request params
  const state = getState();
  const { flight, hotel, id: packageId } = state.selectedOffer;
  const startDate = flight ? flight.outbound_departure : hotel.arrival_date;
  const { adults, children, infants, lengthOfStay } = getOdpSearchParams(state);
  const market = getMarket(state);
  const language = getLanguage(state);
  const { start: showStartDate, end: showEndDate } = calculateCalendarDateRange(
    startDate,
  );
  const travellers = calculateTravellers(adults, children, infants);

  // Combining data in one request object
  const initialParams = {
    packageId,
    showEndDate,
    showStartDate,
    language,
    market,
    travellers,
    lengthOfStay,
  };

  dispatch(setIsLoadingFlagTo(true));
  try {
    const data = await httpService
      .getJson(API_URL_PACKAGE, 'calendar', { ...initialParams, ...params }) // overriding initial params
      .then(({ data }) => data);
    dispatch(saveData(data));
  } catch (err) {
    dispatch(loadingFailed());
  } finally {
    dispatch(setIsLoadingFlagTo(false));
  }
};

export const fetchPossibleDepartureDays = (
  params: CalendarSearchParams,
): ThunkAction<Promise<void>, AppState, void, CalendarActionCreators> => async (
  dispatch,
): Promise<void> => {
  const data = await httpService
    .getJson(API_URL_PACKAGE, 'possibleDepartureDay', params)
    .then(({ data }) => data.possibleDepartureDays);
  dispatch(savePossibleDepartureDays(data));
};
