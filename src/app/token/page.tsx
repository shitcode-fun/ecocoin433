'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useReadContract, useWriteContract } from 'wagmi';
import { formatUnits, parseUnits } from 'ethers';
import { useToast } from '../../components/ToastContext';
import TokenABI from '@/abis/Token.json';
import {
  TOKEN_ADDRESS,
  TOKEN_NAME,
  TOKEN_SYMBOL,
  TOKEN_DECIMALS,
} from '@/config';

export default function TokenPage() {
  const { address, isConnected } = useAccount();
  const { addToast } = useToast();
  const {
    data: balanceData,
    isLoading,
    isError,
  } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TokenABI,
    functionName: 'balanceOf',
    args: [address],
  });

  const balance =
    typeof balanceData === 'string' ||
    typeof balanceData === 'number' ||
    typeof balanceData === 'bigint'
      ? formatUnits(balanceData, TOKEN_DECIMALS)
      : undefined;

  const {
    writeContract: transferTokens,
    isPending: isTransferPending,
    isSuccess: isTransferSuccess,
    error: transferError,
  } = useWriteContract();
  const {
    writeContract: approveTokens,
    isPending: isApprovePending,
    isSuccess: isApproveSuccess,
    error: approveError,
  } = useWriteContract();

  const handleTransfer = (to: string, amount: string) => {
    if (!to || !amount) return;
    transferTokens({
      address: TOKEN_ADDRESS,
      abi: TokenABI,
      functionName: 'transfer',
      args: [to as any, parseUnits(amount, TOKEN_DECIMALS)],
    });
  };

  const handleApprove = (spender: string, amount: string) => {
    if (!spender || !amount) return;
    approveTokens({
      address: TOKEN_ADDRESS,
      abi: TokenABI,
      functionName: 'approve',
      args: [spender as any, parseUnits(amount, TOKEN_DECIMALS)],
    });
  };

  useEffect(() => {
    if (isTransferSuccess) {
      addToast('Transfer successful', 'success');
    }
  }, [isTransferSuccess, addToast]);

  useEffect(() => {
    if (transferError) {
      addToast((transferError as Error).message, 'error');
    }
  }, [transferError, addToast]);

  useEffect(() => {
    if (isApproveSuccess) {
      addToast('Approval successful', 'success');
    }
  }, [isApproveSuccess, addToast]);

  useEffect(() => {
    if (approveError) {
      addToast((approveError as Error).message, 'error');
    }
  }, [approveError, addToast]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Token Info</h1>
      <p>
        <strong>Name:</strong> {TOKEN_NAME}
      </p>
      <p>
        <strong>Symbol:</strong> {TOKEN_SYMBOL}
      </p>
      <p>
        <strong>Address:</strong>{' '}
        <a
          href={`https://basescan.org/address/${TOKEN_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline transition-colors duration-200 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {TOKEN_ADDRESS}
        </a>
      </p>
      {isConnected ? (
        <>
          <p className="mt-4">
            <strong>Balance:</strong>{' '}
            {isLoading ? (
              <span className="inline-block h-4 w-24 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
            ) : isError ? (
              <span className="text-red-600">Error fetching balance</span>
            ) : (
              `${balance} ${TOKEN_SYMBOL}`
            )}
          </p>

          <div className="mt-6 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Transfer Tokens</h2>
            <fieldset disabled={isTransferPending} className="space-y-2">
              <div>
                <label className="block text-sm">Recipient Address</label>
                <input
                  type="text"
                  id="transfer-to"
                  placeholder="0x..."
                  className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm">Amount ({TOKEN_SYMBOL})</label>
                <input
                  type="number"
                  id="transfer-amount"
                  step="any"
                  placeholder="0.0"
                  className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  const toInput = (document.getElementById('transfer-to') as HTMLInputElement)?.value;
                  const amountInput = (document.getElementById('transfer-amount') as HTMLInputElement)?.value;
                  handleTransfer(toInput, amountInput);
                }}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isTransferPending ? 'Transferring...' : 'Transfer'}
              </button>
            </fieldset>
            {/* Notifications displayed via toast */}
          </div>

          <div className="mt-6 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Approve Tokens</h2>
            <fieldset disabled={isApprovePending} className="space-y-2">
              <div>
                <label className="block text-sm">Spender Address</label>
                <input
                  type="text"
                  id="approve-spender"
                  placeholder="0x..."
                  className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm">Amount ({TOKEN_SYMBOL})</label>
                <input
                  type="number"
                  id="approve-amount"
                  step="any"
                  placeholder="0.0"
                  className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  const spenderInput = (document.getElementById('approve-spender') as HTMLInputElement)?.value;
                  const approveAmount = (document.getElementById('approve-amount') as HTMLInputElement)?.value;
                  handleApprove(spenderInput, approveAmount);
                }}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isApprovePending ? 'Approving...' : 'Approve'}
              </button>
            </fieldset>
            {/* Notifications displayed via toast */}
          </div>
        </>
      ) : (
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Please connect your wallet to view and manage your tokens.
        </p>
      )}
    </div>
  );
}