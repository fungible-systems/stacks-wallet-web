import { useQuery, UseQueryOptions } from 'react-query';
import { useCurrentAccountStxAddressState } from '@store/accounts/account.hooks';
import { useCurrentNetworkState } from '@store/network/networks.hooks';
import { useAccountsApi } from '@store/common/api-clients.hooks';
import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';
import { useAccountTransactionsWithTransfersState } from '@store/accounts/transactions-with-transfer.hooks';
import { DEFAULT_LIST_LIMIT, QueryRefreshRates } from '@common/constants';
import { PaginatedResults } from '@common/types';

const QUERY_OPTIONS = {
  refetchInterval: QueryRefreshRates.MEDIUM,
  refetchOnMount: 'always',
  refetchOnReconnect: 'always',
  refetchOnWindowFocus: 'always',
};

export function useGetAccountTransactionsWithTransfer(reactQueryOptions: UseQueryOptions = {}) {
  const principal = useCurrentAccountStxAddressState();
  const { url: networkUrl } = useCurrentNetworkState();
  const { accountsApi } = useAccountsApi();
  const fetch = () => {
    if (!principal) return;
    return accountsApi.getAccountTransactionsWithTransfers({
      principal,
      limit: DEFAULT_LIST_LIMIT,
    });
  };

  return useQuery(['account/transactionsWithTransfers', principal, networkUrl], fetch, {
    enabled: !!principal || !!networkUrl,
    ...reactQueryOptions,
  });
}

export function useAccountTransactionsWithTransfers() {
  const [accountTransactionsWithTransfer, setAccountTransactionsWithTransfer] =
    useAccountTransactionsWithTransfersState();
  const onSuccess = (data: PaginatedResults<AddressTransactionWithTransfers>) => {
    setAccountTransactionsWithTransfer(data.results);
  };
  useGetAccountTransactionsWithTransfer({ ...QUERY_OPTIONS, onSuccess } as UseQueryOptions);
  return accountTransactionsWithTransfer;
}
