import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';
import { type BudgetTrackingEvent, type DownalodChromeEvent } from './types';

class NewStore {
  data = 0;
  private _data2 = 0;

  chromeDownloadPercent = 0;

  constructor() {
    makeAutoObservable(this);
  }

  clearScrapingStatus() {
    this.updateChromeDownloadPercent(0);
  }

  updateChromeDownloadPercent(percent: number) {
    this.chromeDownloadPercent = percent;
  }

  handleScrapingEvent(eventName: string, budgetTrackingEvent?: BudgetTrackingEvent) {
    console.log('Received scraping event (newStore)', eventName, budgetTrackingEvent);
    if (eventName === 'DOWNLOAD_CHROME') {
      this.updateChromeDownloadPercent((budgetTrackingEvent as DownalodChromeEvent)?.percent);
    }
  }

  increment() {
    this.data++;
  }

  get data2() {
    return this._data2;
  }

  set data2(value) {
    this._data2 = value;
  }
}

const newStore = new NewStore();
setInterval(() => {
  newStore.increment();
  newStore.data2++;
}, 1000);

const StoreContext = createContext(newStore);
export const NewStoreProvider = ({ children }: { children: React.ReactNode }) => (
  <StoreContext.Provider value={newStore}>{children}</StoreContext.Provider>
);
export const useNewStore = () => useContext(StoreContext);
