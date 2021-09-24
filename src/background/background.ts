/**
 The background script is the extension's event handler; it contains listeners for browser
 events that are important to the extension. It lies dormant until an event is fired then
 performs the instructed logic. An effective background script is only loaded when it is
 needed and unloaded when it goes idle.
 https://developer.chrome.com/docs/extensions/mv3/architecture-overview/#background_script
 */
import * as Sentry from '@sentry/react';

import { storePayload, StorageKey } from '@common/storage';
import { ScreenPaths } from '@common/types';
import {
  CONTENT_SCRIPT_PORT,
  ExternalMethods,
  MessageFromContentScript,
} from '@common/message-types';

import type { VaultActions } from '@background/vault-types';
import { popupCenter } from '@background/popup';
import { vaultMessageHandler } from '@background/vault';
import { initContextMenuActions } from '@background/init-context-menus';
import { initSentry } from '@common/sentry-init';

const IS_TEST_ENV = process.env.TEST_ENV === 'true';

initSentry();

initContextMenuActions();

// Playwright does not currently support Chrome extension popup testing:
// https://github.com/microsoft/playwright/issues/5593
async function openRequestInFullPage(path: string, urlParams: URLSearchParams) {
  await chrome.tabs.create({
    url: chrome.runtime.getURL(`index.html#${path}?${urlParams.toString()}`),
  });
}

// Listen for install event
chrome.runtime.onInstalled.addListener(details => {
  Sentry.wrap(async () => {
    if (details.reason === 'install' && !IS_TEST_ENV) {
      await chrome.tabs.create({
        url: chrome.runtime.getURL(`index.html#${ScreenPaths.INSTALLED}`),
      });
    }
  });
});

// Listen for connection to the content-script - port for two-way communication
chrome.runtime.onConnect.addListener(port =>
  Sentry.wrap(() => {
    // Listen for auth and transaction events
    if (port.name === CONTENT_SCRIPT_PORT) {
      port.onMessage.addListener(async (message: MessageFromContentScript, port) => {
        const { payload } = message;
        switch (message.method) {
          case ExternalMethods.authenticationRequest: {
            void storePayload({
              payload,
              storageKey: StorageKey.authenticationRequests,
              port,
            });
            const path = ScreenPaths.GENERATION;
            const urlParams = new URLSearchParams();
            urlParams.set('authRequest', payload);
            if (IS_TEST_ENV) {
              await openRequestInFullPage(path, urlParams);
            } else {
              popupCenter({ url: `/popup.html#${path}?${urlParams.toString()}` });
            }
            break;
          }
          case ExternalMethods.transactionRequest: {
            void storePayload({
              payload,
              storageKey: StorageKey.transactionRequests,
              port,
            });
            const path = ScreenPaths.TRANSACTION_POPUP;
            const urlParams = new URLSearchParams();
            urlParams.set('request', payload);
            if (IS_TEST_ENV) {
              await openRequestInFullPage(path, urlParams);
            } else {
              popupCenter({ url: `/popup.html#${path}?${urlParams.toString()}` });
            }
            break;
          }
          default:
            break;
        }
      });
    }
  })
);

// Listen for events triggered by the background memory vault
chrome.runtime.onMessage.addListener((message: VaultActions, sender, sendResponse) =>
  Sentry.wrap(() => {
    // Only respond to internal messages from our UI, not content scripts in other applications
    if (!sender.url?.startsWith(chrome.runtime.getURL(''))) return;
    void vaultMessageHandler(message).then(sendResponse).catch(sendResponse);
    // Return true to specify that we are responding async
    return true;
  })
);

if (IS_TEST_ENV) {
  // Expose a helper function to open a new tab with the wallet from tests
  (window as any).openOptionsPage = function (page: string) {
    const url = chrome.runtime.getURL(`index.html#${page}`);
    return url;
  };
}
