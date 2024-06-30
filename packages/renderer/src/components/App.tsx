import { getAppInfo, getConfig, scrape } from '#preload';
import { useEffect } from 'react';
import Store, { StoreContext } from '../Store';
import './App.css';
import Body from './Body';
import TopBar from './topBar/TopBar';

const store = new Store();
const boundScrape = async () => {
  store.clearScrapingStatus();
  await scrape(store.handleScrapingEvent);
};

function App() {
  useEffect(() => {
    getConfig().then(config => {
      store.configuration = config;
    });
    getAppInfo().then(appInfo => {
      store.appInfo = appInfo;
    });
  }, []);

  return (
    <StoreContext.Provider value={store}>
      <div className="App">
        <TopBar />
        <Body scrape={boundScrape} />
      </div>
    </StoreContext.Provider>
  );
}

export default App;
