import { scrape } from '#preload';
import { observer } from 'mobx-react-lite';
import { useCallback, useContext, useState } from 'react';
import { Button, Container, Image, Modal, Stack } from 'react-bootstrap';
import { useNewStore } from '../store/NewStore';
import { StoreContext } from '../store/Store';
import settingsIcon from '../assets/gear.svg';
import {
  ModalStatus,
  OutputVendorName,
  type Account,
  type Exporter,
  type Importer,
} from '../types';
import styles from './Body.module.css';
import CheckForUpdates from './CheckForUpdates';
import ChromeDownloadProgress from './ChromeDownloadProgress';
import GeneralSettings from './GeneralSettings';
import AccountLogs from './accounts/AccountLogs';
import AccountsContainer from './accounts/AccountsContainer';
import CreateImporter from './accounts/CreateImporter';
import EditImporter from './accounts/EditImporter';
import Importers from './accounts/Importers';
import EditExporter from './exporters/EditExporter';
import Exporters from './exporters/Exporters';

const Body = () => {
  const store = useContext(StoreContext);
  const newStore = useNewStore();
  const cleanAndScrape = useCallback(() => {
    store.clearScrapingStatus();
    newStore.clearScrapingStatus();
    return scrape(newStore.handleScrapingEvent.bind(newStore));
  }, [store, newStore]);

  const { config } = store;
  const { isScraping } = store;
  const [modalStatus, setModalStatus] = useState<ModalStatus>(
    ModalStatus.HIDDEN,
  );

  const [currentAccount, setCurrentAccount] = useState<Account>();
  const closeModal = () => setModalStatus(ModalStatus.HIDDEN);
  const showModal = (account: Account, status: ModalStatus) => {
    setCurrentAccount(account);
    setModalStatus(status);
  };

  const wideModal = shouldShowWideModal(modalStatus, currentAccount);

  const newScraperClicked = () => {
    setModalStatus(ModalStatus.NEW_SCRAPER);
  };

  const createImporter = async (importer: Importer) => {
    await store.addImporter(importer);
    closeModal();
  };
  const updateImporter = async (importer: Importer) => {
    await store.updateImporter(importer.id, importer);
    closeModal();
  };

  const updateExporter = async (exporter: Exporter) => {
    await store.updateExporter(exporter);
    closeModal();
  };

  const deleteImporter = async (importerId) => {
    await store.deleteImporter(importerId);
    closeModal();
  };

  return (
    <Container className={styles.root}>
      <Container className={styles.container}>
        <div className={styles.contentContainer}>
          <Stack direction="horizontal" className={styles.customGap}>
            {config && config.scraping && (
              <AccountsContainer title="בנקים וכרטיסי אשראי">
                <Importers
                  accounts={store.importers}
                  isScraping={isScraping}
                  showModal={showModal}
                  handleNewAccountClicked={newScraperClicked}
                />
              </AccountsContainer>
            )}
            {config && config.outputVendors && (
              <AccountsContainer
                title="תוכנות ניהול תקציב"
                accounts={store.exporters}
                isScraping={isScraping}
                showModal={showModal}
              >
                <Exporters
                  exporters={store.exporters}
                  isScraping={isScraping}
                  showModal={showModal}
                />
              </AccountsContainer>
            )}
          </Stack>
        </div>
        <Modal
          show={modalStatus !== ModalStatus.HIDDEN}
          onHide={closeModal}
          dialogClassName={wideModal ? styles.modalWide : ''}
        >
          <Modal.Header
            closeButton
            className={styles.modalHeader}
          ></Modal.Header>
          <Modal.Body>
            {modalStatus === ModalStatus.LOGS && currentAccount && (
              <AccountLogs logs={currentAccount.logs} />
            )}
            {modalStatus === ModalStatus.IMPORTER_SETTINGS &&
              currentAccount && (
                <EditImporter
                  handleSave={updateImporter}
                  importer={currentAccount}
                  handleDelete={deleteImporter}
                />
              )}
            {modalStatus === ModalStatus.EXPORTER_SETTINGS &&
              currentAccount && (
                <EditExporter
                  handleSave={updateExporter}
                  exporter={currentAccount}
                  handleDelete={deleteImporter}
                />
              )}
            {modalStatus === ModalStatus.NEW_SCRAPER && (
              <CreateImporter handleSave={createImporter} />
            )}
            {modalStatus === ModalStatus.GENERAL_SETTINGS && (
              <GeneralSettings />
            )}
          </Modal.Body>
        </Modal>
      </Container>
      <Container className={styles.buttonsContainer}>
        <ChromeDownloadProgress />
        <Button
          variant="dark"
          size="lg"
          onClick={cleanAndScrape}
          disabled={store.isScraping}
        >
          הפעל
        </Button>
        <Image
          src={settingsIcon}
          onClick={() => showModal(null, ModalStatus.GENERAL_SETTINGS)}
          className={styles.pointer}
        />
        <CheckForUpdates />
      </Container>
    </Container>
  );
};

function shouldShowWideModal(
  modalStatus: ModalStatus,
  currentAccount?: Account,
) {
  return (
    modalStatus === ModalStatus.EXPORTER_SETTINGS &&
    currentAccount &&
    currentAccount.companyId === OutputVendorName.YNAB
  );
}

export default observer(Body);
