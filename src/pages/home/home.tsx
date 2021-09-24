import React from 'react';
import { Outlet } from 'react-router-dom';
import { Stack } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';
import { BalancesAndActivity } from '@components/popup/balances-and-activity';
import { UserAccount } from '@pages/home/components/user-area';
import { HomeActions } from '@pages/home/components/actions';

import { usePromptUserToSetDiagnosticPermissions } from '@common/hooks/use-diagnostic-permission-prompt';

export const PopupHome = () => {
  usePromptUserToSetDiagnosticPermissions();

  return (
    <>
      <PopupContainer header={<Header />} requestType="auth">
        <Stack data-testid="home-page" flexGrow={1} spacing="loose">
          <UserAccount />
          <HomeActions />
          <BalancesAndActivity />
        </Stack>
      </PopupContainer>
      <Outlet />
    </>
  );
};
