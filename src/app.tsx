import React, { useEffect, useState } from 'react';
import { ThemeProvider, ColorModeProvider } from '@stacks/ui';
import { QueryClientProvider } from 'react-query';
import { jotaiWrappedReactQueryQueryClient as queryClient } from '@store/common/common.hooks';
import { Toaster } from 'react-hot-toast';

import { theme } from '@common/theme';
import { HashRouter as Router } from 'react-router-dom';
import { GlobalStyles } from '@components/global-styles';
import { VaultLoader } from '@components/vault-loader';
import { AccountsDrawer } from '@features/accounts-drawer/accounts-drawer';
import { NetworksDrawer } from '@features/network-drawer/networks-drawer';
import { Routes } from './routes';

import { SettingsPopover } from '@features/settings-dropdown/settings-popover';
import { AppErrorBoundary } from '@features/errors/app-error-boundary';
import { TransactionSettingsDrawer } from '@features/fee-nonce-drawers/transaction-settings-drawer';
import { SpeedUpTransactionDrawer } from '@features/fee-nonce-drawers/speed-up-transaction-drawer';
import { AnalyticsBrowser } from '@segment/analytics-next';
import { SEGMENT } from '@common/constants';
import { analyticsState } from '@store/common/analytics';
import { useAtom } from 'jotai';

export const App: React.FC = () => {
  useEffect(() => {
    (window as any).__APP_VERSION__ = VERSION;
  }, []);
  const [_, setAnalytics] = useAtom(analyticsState);
  const [writeKey] = useState(SEGMENT.WRITE_KEY);

  useEffect(() => {
    const loadAnalytics = async () => {
      const [response] = await AnalyticsBrowser.load({ writeKey });
      console.log('setting analytics');
      setAnalytics(response);
    };
    void loadAnalytics();
  }, [setAnalytics, writeKey]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <QueryClientProvider client={queryClient}>
        <ColorModeProvider defaultMode="light">
          <>
            <Router>
              <AppErrorBoundary>
                <VaultLoader />
                <Routes />
                <AccountsDrawer />
                <NetworksDrawer />
                <TransactionSettingsDrawer />
                <SpeedUpTransactionDrawer />
                <SettingsPopover />
              </AppErrorBoundary>
              <Toaster position="bottom-center" toastOptions={{ style: { fontSize: '14px' } }} />
            </Router>
          </>
        </ColorModeProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
