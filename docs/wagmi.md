# wagmi v2.15.4 Usage Guide

## Supported Hooks

### Read from Contract
```tsx
import { useReadContract } from 'wagmi';

const { data, isLoading, isError } = useReadContract({
  address: '0xYourContractAddress',
  abi: [/* ... */],
  functionName: 'yourReadFunction',
  args: [/* ... */], // optional, if your function takes arguments
});
```

### Read from Multiple Contracts
```tsx
import { useReadContracts } from 'wagmi';

const { data, isLoading, isError } = useReadContracts({
  contracts: [
    {
      address: '0xYourContractAddress',
      abi: [/* ... */],
      functionName: 'yourReadFunction',
      args: [/* ... */],
    },
    // ...more contracts
  ],
});
```

### Write to Contract
```tsx
import { useWriteContract } from 'wagmi';

const { writeContract, isPending, isSuccess, error } = useWriteContract();

// Usage
<button
  disabled={isPending}
  onClick={() =>
    writeContract({
      address: '0xYourContractAddress',
      abi: [/* ... */],
      functionName: 'yourWriteFunction',
      args: [/* ... */],
    })
  }
>
  Write
</button>
```

## ⚠️ Deprecated/Removed APIs
- `useContractRead`, `useContractWrite`, and `usePrepareContractWrite` are **not available in wagmi v2+**. Do NOT use them.
- Always check the [official wagmi docs](https://wagmi.sh/react/api/hooks) for the latest usage patterns.

## References
- [wagmi v2.15.4 Hooks](https://wagmi.sh/react/api/hooks)
- [Migration Guide v1 → v2](https://wagmi.sh/react/guides/migrate-from-v1-to-v2) 