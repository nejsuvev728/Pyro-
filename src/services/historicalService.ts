import { HISTORICAL_EVENTS } from '../data/mockTimeWarp';
import { HistoricalEvent } from '../types/intelligence';

export const getHistoricalEvents = (): HistoricalEvent[] => {
  return HISTORICAL_EVENTS;
};

export const getHistoricalEventById = (id: string): HistoricalEvent | undefined => {
  return HISTORICAL_EVENTS.find((e) => e.id === id) || HISTORICAL_EVENTS[0];
};
