import React, { useCallback, useEffect, useState } from 'react';
import { Box, Flex, Button, Stack } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';
import { Body } from '@components/typography';
import { SettingsSelectors } from '@tests/integration/settings.selectors';
import { useAnalytics } from '@common/hooks/use-analytics';

interface CreateAccountProps {
  close: () => void;
}

const TIMEOUT = 3000;

export const CreateAccount: React.FC<CreateAccountProps> = ({ close }) => {
  const { doCreateNewAccount } = useWallet();
  const [isSetting, setSetting] = useState(false);
  const [hasFired, setHasFired] = useState(false);
  const analytics = useAnalytics();

  const createAccount = useCallback(async () => {
    if (!isSetting) {
      setSetting(true);
      await doCreateNewAccount();
      console.log('track: create new account');
      analytics?.track('Create New Account', {
        has_stx: true,
      });
      setSetting(false);
      window.setTimeout(() => close(), TIMEOUT);
    }
  }, [isSetting, doCreateNewAccount, analytics, close]);

  useEffect(() => {
    if (!hasFired) {
      setHasFired(true);
      void createAccount();
    }
  }, [createAccount, hasFired]);

  return (
    <Box width="100%" px="extra-loose">
      <Stack spacing="base">
        <Body>Your new account has been created.</Body>
        <Flex width="100%" flexGrow={1} mt="base" pb="loose">
          <Button
            width="100%"
            onClick={close}
            isLoading={isSetting}
            borderRadius="10px"
            isDisabled={isSetting}
            data-testid={isSetting ? undefined : SettingsSelectors.BtnCreateAccountDone}
          >
            Done
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};
