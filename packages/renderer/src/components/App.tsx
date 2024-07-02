import { getAppInfo, getConfig } from '#preload';
import { useEffect } from 'react';
import { NewStoreProvider } from '../store/NewStore';
import Store, { StoreContext } from '../store/Store';
import './App.css';
import Body from './Body';
import TopBar from './topBar/TopBar';

const store = new Store();

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
      <NewStoreProvider>
        <div className="App">
          <TopBar />
          <Body />
        </div>
      </NewStoreProvider>
    </StoreContext.Provider>
  );
}

export default App;
