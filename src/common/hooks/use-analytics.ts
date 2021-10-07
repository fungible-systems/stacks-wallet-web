import { hiroAnalyticsState } from '@store/common/analytics';
import { useCurrentNetworkState } from '@store/network/networks.hooks';
import { useAtomValue } from 'jotai/utils';
import { useLocation } from 'react-router-dom';
import { useCurrentAccountAvailableStxBalance } from '@store/accounts/account.hooks';
import { IS_DEV_ENV } from '@common/constants';

export function useAnalytics() {
  const analytics = useAtomValue(hiroAnalyticsState);
  const currentNetwork = useCurrentNetworkState();
  const location = useLocation();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  console.log(availableStxBalance);
  console.log('dev env', IS_DEV_ENV)
  const defaultOptions = {
    network: currentNetwork,
    route: location.pathname,
    version: VERSION,
    has_stx: availableStxBalance?.isGreaterThan(0) ?? false,
  };
  console.log('defaultOptions', defaultOptions);
  return {
    track: (name: string, options = {}) => {
      if (IS_DEV_ENV) {
        console.log(arguments)
        return
      }
      analytics?.track(name, { ...defaultOptions, ...options });
    },
  };
}
