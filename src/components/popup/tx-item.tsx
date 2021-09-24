import React from 'react';
import type {
  MempoolTransaction,
  Transaction,
  AddressTransactionWithTransfers,
} from '@stacks/stacks-blockchain-api-types';
import { Box, BoxProps, Button, Circle, color, Stack } from '@stacks/ui';
import { isPendingTx } from '@stacks/ui-utils';

import { stacksValue } from '@common/stacks-utils';
import { useExplorerLink } from '@common/hooks/use-explorer-link';

import { Caption, Title } from '@components/typography';
import { SpaceBetween } from '@components/space-between';
import { TxItemIcon, TypeIconWrapper } from '@components/tx-icon';
import { Tooltip } from '@components/tooltip';
import { useCurrentAccount } from '@store/accounts/account.hooks';
import { usePressable } from '@components/item-hover';
import { useRawTxIdState } from '@store/transactions/raw.hooks';
import { FiFastForward } from 'react-icons/all';
import { StxIcon } from '@components/icons/stx-icon';
import { FiArrowDown as IconArrowDown, FiArrowUp as IconArrowUp } from 'react-icons/fi';
import {
  getTxCaption,
  getTxTitle,
  getTxValue,
  isAddressTransactionWithTransfer,
  StxTransfer,
} from '@common/transactions/transaction-utils';

type Tx = MempoolTransaction | Transaction;

interface TxItemProps {
  transaction: Tx;
}

interface TxViewProps {
  transaction: AddressTransactionWithTransfers | Tx;
}

const Status: React.FC<{ transaction: Tx } & BoxProps> = ({ transaction, ...rest }) => {
  const isPending = isPendingTx(transaction as any);
  const isFailed = !isPending && transaction.tx_status !== 'success';
  return isFailed || isPending ? (
    <Box {...rest}>
      {isPending && (
        <Caption variant="c2" color={color('feedback-alert')}>
          Pending
        </Caption>
      )}
      {isFailed && (
        <Tooltip
          placement="bottom"
          label={
            // TODO: better language around failure
            transaction.tx_status
          }
        >
          <Caption variant="c2" color={color('feedback-error')}>
            Failed
          </Caption>
        </Tooltip>
      )}
    </Box>
  ) : null;
};

const SpeedUpButton = ({
  txid,
  isHovered,
  isEnabled,
}: {
  txid: string;
  isHovered: boolean;
  isEnabled: boolean;
}) => {
  const [rawTxId, setTxId] = useRawTxIdState();
  const isSelected = rawTxId === txid;
  const isActive = isEnabled && !isSelected && isHovered;
  return (
    <Button
      size="sm"
      mode="tertiary"
      fontSize={0}
      onClick={e => {
        setTxId(txid);
        e.stopPropagation();
      }}
      zIndex={999}
      ml="auto"
      opacity={!isActive ? 0 : 1}
      pointerEvents={!isActive ? 'none' : 'all'}
      color={color('text-body')}
      _hover={{
        color: color('text-title'),
      }}
    >
      <Box mr="3px" as={FiFastForward} color={color('accent')} />
      Increase fee
    </Button>
  );
};

const TxTransfers: React.FC<{ transaction: AddressTransactionWithTransfers & BoxProps }> = ({
  transaction,
  ...rest
}) => {
  return (
    <>
      {transaction.stx_transfers.map((stxTransfer, index) => (
        <StxTransferItem stxTransfer={stxTransfer} parentTx={transaction} {...rest} key={index} />
      ))}
    </>
  );
};

const TxItemRow: React.FC<{
  title: string;
  value: number | string | null;
  caption?: string;
  icon: JSX.Element;
  onClick?: () => Window | null;
}> = ({ title, caption, value, icon, onClick, ...rest }) => {
  const [component, bind] = usePressable(true);
  return (
    <Box position="relative" cursor="pointer" {...bind} {...rest}>
      <Stack
        alignItems="center"
        spacing="base-loose"
        isInline
        position="relative"
        zIndex={2}
        onClick={onClick}
      >
        {icon}
        <SpaceBetween flexGrow={1}>
          <Stack spacing="base-tight">
            <Title as="h3" fontWeight="normal">
              {title}
            </Title>
            <Stack isInline flexWrap="wrap">
              <Caption variant="c2">{caption}</Caption>
            </Stack>
          </Stack>
          <Stack alignItems="flex-end" spacing="base-tight">
            {value && (
              <Title as="h3" fontWeight="normal">
                {value}
              </Title>
            )}
          </Stack>
        </SpaceBetween>
      </Stack>
      {component}
    </Box>
  );
};

const StxTransferItem: React.FC<{
  stxTransfer: StxTransfer;
  parentTx: AddressTransactionWithTransfers;
}> = ({ stxTransfer, parentTx }) => {
  const currentAccount = useCurrentAccount();
  const { handleOpenTxLink } = useExplorerLink();
  const title = 'Stacks Token Transfer';
  const caption = getTxCaption(parentTx.tx) ?? '';
  const isOriginator = stxTransfer.sender === currentAccount?.address;

  const value = `${isOriginator ? '-' : ''}${stacksValue({
    value: stxTransfer.amount,
    withTicker: false,
  })}`;

  const icon = isOriginator ? IconArrowUp : IconArrowDown;

  const iconWrapper = (
    <Circle position="relative" size="36px" bg={color('accent')} color={color('bg')}>
      <Box as={StxIcon} />
      <TypeIconWrapper icon={icon} bg={'brand'} />
    </Circle>
  );

  return (
    <TxItemRow
      title={title}
      caption={caption}
      value={value}
      onClick={() => handleOpenTxLink(parentTx.tx.tx_id)}
      icon={iconWrapper}
    />
  );
};

export const TxView: React.FC<TxViewProps & BoxProps> = ({ transaction, ...rest }) => {
  if (!isAddressTransactionWithTransfer(transaction))
    return <TxItem transaction={transaction as Tx} {...rest} />; // This is a normal Transaction or MempoolTransaction

  // Show transfer only for contract calls
  if (transaction.tx.tx_type !== 'contract_call')
    return <TxItem transaction={transaction.tx} {...rest} />;

  return (
    <>
      <TxTransfers transaction={transaction} />
      <TxItem transaction={transaction.tx} {...rest} />
    </>
  );
};

export const TxItem: React.FC<TxItemProps & BoxProps> = ({ transaction, ...rest }) => {
  const [component, bind, { isHovered }] = usePressable(true);
  const { handleOpenTxLink } = useExplorerLink();
  const currentAccount = useCurrentAccount();

  if (!transaction) {
    return null;
  }

  const isOriginator = transaction.sender_address === currentAccount?.address;

  const isPending = isPendingTx(transaction as MempoolTransaction);

  const value = getTxValue(transaction, isOriginator);

  return (
    <Box position="relative" cursor="pointer" {...bind} {...rest}>
      <Stack
        alignItems="center"
        spacing="base-loose"
        isInline
        position="relative"
        zIndex={2}
        onClick={() => handleOpenTxLink(transaction.tx_id)}
      >
        <TxItemIcon transaction={transaction} />
        <SpaceBetween flexGrow={1}>
          <Stack spacing="base-tight">
            <Title as="h3" fontWeight="normal">
              {getTxTitle(transaction as any)}
            </Title>
            <Stack isInline flexWrap="wrap">
              <Caption variant="c2">{getTxCaption(transaction)}</Caption>
              <Status transaction={transaction} />
            </Stack>
          </Stack>
          <Stack alignItems="flex-end" spacing="base-tight">
            {value && (
              <Title as="h3" fontWeight="normal">
                {value}
              </Title>
            )}
            <SpeedUpButton
              isEnabled={isPending && isOriginator}
              isHovered={isHovered}
              txid={transaction.tx_id}
            />
          </Stack>
        </SpaceBetween>
      </Stack>
      {component}
    </Box>
  );
};
