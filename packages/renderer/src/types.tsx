/// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Types common with the electron code

import { type Credentials } from '../../src/backend/commonTypes';

/// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export enum OutputVendorName {
  YNAB = 'ynab',
  GOOGLE_SHEETS = 'googleSheets',
  JSON = 'json',
  CSV = 'csv',
}

export interface Config {
  outputVendors: {
    [OutputVendorName.GOOGLE_SHEETS]?: GoogleSheetsConfig;
    [OutputVendorName.YNAB]?: YnabConfig;
    [OutputVendorName.JSON]?: JsonConfig;
    [OutputVendorName.CSV]?: CsvConfig;
  };
  scraping: {
    timeout: number;
    numDaysBack: number;
    showBrowser: boolean;
    accountsToScrape: AccountToScrapeConfig[];
    chromiumPath?: string;
    maxConcurrency?: number;
  };
}

export interface AppInfo {
  sourceCommitShort: string;
  repository: string;
  discordChanel: string;
  currentVersion: string;
}

export type OutputVendorConfigs = Exclude<
  Config['outputVendors'][OutputVendorName],
  undefined
>;
export type OutputVendorConfig<T extends OutputVendorName> = Exclude<
  Config['outputVendors'][T],
  undefined
>;

export interface OutputVendorConfigBase {
  active: boolean;
}

export interface CsvConfig extends OutputVendorConfigBase {
  options: {
    filePath: string;
  };
}

export interface JsonConfig extends OutputVendorConfigBase {
  options: {
    filePath: string;
  };
}

export interface GoogleSheetsConfig extends OutputVendorConfigBase {
  options: {
    credentials: Credentials;
    // credentials: string;
    spreadsheetId: string;
  };
}

export interface YnabConfig extends OutputVendorConfigBase {
  options: {
    accessToken: string;
    accountNumbersToYnabAccountIds: { [key: string]: string };
    budgetId: string;
    maxPayeeNameLength?: number;
  };
}

export interface AccountToScrapeConfig {
  id: string;
  key: CompanyTypes;
  name: string;
  loginFields: Record<string, string>;
  active?: boolean;
}

export enum CompanyTypes {
  HAPOALIM = 'hapoalim',
  HAPOALIM_BE_ONLINE = 'hapoalimBeOnline',
  BEINLEUMI = 'beinleumi',
  UNION = 'union',
  AMEX = 'amex',
  ISRACARD = 'isracard',
  VISACAL = 'visaCal',
  MAX = 'max',
  LEUMI_CARD = 'leumiCard',
  OTSAR_HAHAYAL = 'otsarHahayal',
  DISCOUNT = 'discount',
  MIZRAHI = 'mizrahi',
  LEUMI = 'leumi',
  MASSAD = 'massad',
  YAHAV = 'yahav',
  BEYAHAD_BISHVILHA = 'beyahadBishvilha',
  BEHATSDAA = 'behatsdaa',
  MERCANTILE = 'mercantile',
}

export enum AccountType {
  IMPORTER = 'Importer',
  EXPORTER = 'Exporter',
}

export enum AccountStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  IN_PROGRESS = 'inProgress',
  DONE = 'done',
  ERROR = 'error',
}

export class BudgetTrackingEvent {
  message: string;

  vendorId?: CompanyTypes | OutputVendorName;

  accountStatus?: AccountStatus;

  error?: Error;

  accountType?: AccountType;

  constructor({
    message, vendorId, error, accountType, accountStatus = AccountStatus.IN_PROGRESS,
  }: BudgetTrackingEvent) {
    this.message = message;
    this.vendorId = vendorId;
    this.error = error;
    this.accountType = accountType;
    this.accountStatus = accountStatus;
  }
};

export class DownalodChromeEvent extends BudgetTrackingEvent {
  percent: number;

  constructor(percent: number) {
    super({ message: `Download Chrome: ${percent}%` });
    this.percent = percent;
  }
}

/// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// End of common types
/// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface Log {
  message: string;
  originalEvent?: BudgetTrackingEvent;
}

export interface Account {
  id: string;
  companyId: CompanyTypes | OutputVendorName;
  displayName: string;
  logo: string;
  type: AccountType;
  active: boolean;
  status?: AccountStatus;
  logs: Log[];
}

export interface Importer extends Account {
  loginFields: Record<string, string>;
}

export interface Exporter extends Account {
  options: object;
}

export type AccountMetadata = {
  companyId: string;
  companyName: string;
  logo: string;
};

export enum ModalStatus {
  IMPORTER_SETTINGS,
  EXPORTER_SETTINGS,
  LOGS,
  HIDDEN,
  NEW_SCRAPER,
  GENERAL_SETTINGS,
}

export enum ExporterResultType {
  WEBSITE_URL,
  FILE,
}

export interface ExportResultMetadata {
  resultType: ExporterResultType;
  getResultUri(exporter: OutputVendorConfigBase): string;
}