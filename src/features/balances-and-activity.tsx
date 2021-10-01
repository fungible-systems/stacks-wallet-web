import React, { memo } from 'react';
import type { StackProps } from '@stacks/ui';
import { Box, color, Flex, SlideFade, Spinner, Stack } from '@stacks/ui';
import { TokenAssets } from '@components/popup/token-assets';

import { Caption } from '@components/typography';
import { NoActivityIllustration } from '@components/vector/no-activity';
import { Tabs } from '@components/tabs';

import { useHomeTabs } from '@common/hooks/use-home-tabs';
import { useCurrentAccountLocalTxids } from '@store/accounts/account-activity.hooks';
import { LocalTxList } from '@features/local-transaction-activity/local-tx-list';
import { useAccountTransactionsWithTransfers } from '@common/hooks/account/use-account-transactions-with-transfers.hooks';
import { TransactionList } from '@components/popup/transaction-list';
import { HomePageSelectors } from '@tests/page-objects/home-page.selectors';

function EmptyActivity() {
  return (
    <Stack py="extra-loose" spacing="extra-loose" justifyContent="center" alignItems="center">
      <Box mx="auto">
        <NoActivityIllustration />
      </Box>

      <Caption maxWidth="23ch" textAlign="center">
        No activity yet.
      </Caption>
    </Stack>
  );
}

const ActivityList = () => {
  const transactions = useAccountTransactionsWithTransfers();
  const txids = useCurrentAccountLocalTxids();
  const hasTxs = txids.length > 0 || transactions.length > 0;
  return !hasTxs ? (
    <EmptyActivity />
  ) : (
    <>
      {txids.length > 0 && <LocalTxList txids={txids} />}
      {transactions.length > 0 && <TransactionList txs={transactions} />}
    </>
  );
};

const Loading = memo(() => (
  <Flex pb="72px" width="100%" alignItems="center" justifyContent="center" flexGrow={1}>
    <Spinner size="lg" opacity={0.5} color={color('text-caption')} />
  </Flex>
));

export function BalancesAndActivity(props: StackProps) {
  const { activeTab, setActiveTab } = useHomeTabs();
  return (
    <Stack flexGrow={1} spacing="extra-loose" {...props}>
      <Tabs
        tabs={[
          { slug: 'balances', label: 'Balances' },
          { slug: 'activity', label: 'Activity' },
        ]}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />

      <Flex position="relative" flexGrow={1}>
        {activeTab === 0 && (
          <React.Suspense fallback={<Loading />}>
            <SlideFade in={activeTab === 0}>
              {styles => (
                <TokenAssets
                  data-testid={HomePageSelectors.BalancesList}
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  style={styles}
                />
              )}
            </SlideFade>
          </React.Suspense>
        )}
        {activeTab === 1 && (
          <React.Suspense fallback={<Loading />}>
            <SlideFade in={activeTab === 1}>
              {styles => (
                <Box position="absolute" top={0} left={0} width="100%" style={styles}>
                  <ActivityList />
                </Box>
              )}
            </SlideFade>
          </React.Suspense>
        )}
      </Flex>
    </Stack>
  );
}
