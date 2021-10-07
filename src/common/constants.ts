import { ChainID } from '@stacks/transactions';

export const gaiaUrl = 'https://hub.blockstack.org';

export const STX_TRANSFER_TX_SIZE_BYTES = 180;

export const transition = 'all .2s cubic-bezier(.215,.61,.355,1)';

export const USERNAMES_ENABLED = process.env.USERNAMES_ENABLED === 'true';

export const IS_TEST_ENV = process.env.TEST_ENV === 'true';
export const IS_DEV_ENV = process.env.NODE_ENV === 'development';

export const PERSISTENCE_CACHE_TIME = 1000 * 60 * 60 * 12; // 12 hours

export const STX_DECIMALS = 6;

export const STACKS_MARKETS_URL = 'https://coinmarketcap.com/currencies/stacks/markets/';

export const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

export const POPUP_WIDTH = 442;
export const POPUP_HEIGHT = 646;
export const MICROBLOCKS_ENABLED = !IS_TEST_ENV && true;

export const GITHUB_ORG = 'blockstack';
export const GITHUB_REPO = 'stacks-wallet-web';
export const GITHUB_PRIMARY_BRANCH = 'main';

export const SIP_010 = {
  mainnet: {
    address: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
    name: 'sip-010-trait-ft-standard',
    trait: 'sip-010-trait',
  },
  testnet: {
    address: 'STR8P3RD1EHA8AA37ERSSSZSWKS9T2GYQFGXNA4C',
    name: 'sip-010-trait-ft-standard',
    trait: 'sip-010-trait',
  },
  regtest: {
    address: 'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3',
    name: 'ft-trait',
    trait: 'ft-trait',
  },
};

export interface Network {
  url: string;
  name: string;
  chainId: ChainID;
}

export const DEFAULT_TESTNET_SERVER = 'https://stacks-node-api.testnet.stacks.co';

export const DEFAULT_REGTEST_SERVER = 'https://stacks-node-api.regtest.stacks.co';

export const DEFAULT_MAINNET_SERVER = 'https://stacks-node-api.stacks.co';

export type Networks = Record<string, Network>;

export const defaultNetworks: Networks = {
  mainnet: {
    url: DEFAULT_MAINNET_SERVER,
    name: 'Mainnet',
    chainId: ChainID.Mainnet,
  },
  testnet: {
    url: DEFAULT_TESTNET_SERVER,
    name: 'Testnet',
    chainId: ChainID.Testnet,
  },
  regtest: {
    url: DEFAULT_REGTEST_SERVER,
    name: 'Regtest',
    chainId: ChainID.Testnet,
  },
  localnet: {
    url: 'http://localhost:3999',
    name: 'Localnet',
    chainId: ChainID.Testnet,
  },
} as const;

export enum QueryRefreshRates {
  VERY_SLOW = 120_000,
  SLOW = 30_000,
  MEDIUM = 10_000,
  FAST = 3_500,
}

export const SEGMENT = {
  WRITE_KEY: 'XXX',
};
