import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { useNewStore } from '../store/NewStore';

const ChromeDownloadProgress = () => {
  const newStore = useNewStore();

  const label = useMemo(
    () =>
      newStore.chromeDownloadPercent && newStore.chromeDownloadPercent === 100
        ? 'Download Completed'
        : `Downloading Chrome ${newStore.chromeDownloadPercent}%`,
    [newStore.chromeDownloadPercent],
  );

  if (!newStore.chromeDownloadPercent) {
    return null;
  }

  return <ProgressBar now={newStore.chromeDownloadPercent} label={label} className='w-100' />;
};

export default observer(ChromeDownloadProgress);
