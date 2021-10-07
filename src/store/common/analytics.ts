import { Analytics } from '@segment/analytics-next';
import { atom } from 'jotai';

export const analyticsState = atom<Analytics | undefined>(undefined);

export const hiroAnalyticsState = atom(get => {
  const analytics = get(analyticsState);
  console.log('hiroAnalyticsState');
  return analytics;
});
