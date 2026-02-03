# Skill: Multi-Chain Address Formats

Recognize and validate addresses across different blockchain networks.

## Address Format Reference

| Chain | Format | Length | Example |
|-------|--------|--------|---------|
| Demos | `demos` + hex | 69 chars | `demos8a4f2e1b...` |
| EVM (Ethereum, Polygon, Base) | `0x` + hex | 42 chars | `0x742d35Cc...` |
| Solana | Base58 | 32-44 chars | `7EYnhQoR9YM3...` |
| Bitcoin | Base58Check | 26-35 chars | `1BvBMSEYst...` |
| NEAR | Human-readable | Variable | `alice.near` |

## Validation Regex Patterns

```javascript
const ADDRESS_PATTERNS = {
  demos: /^demos[a-fA-F0-9]{64}$/,
  evm: /^0x[a-fA-F0-9]{40}$/,
  solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-zA-HJ-NP-Z0-9]{39,59}$/,
  near: /^[a-z0-9._-]+\.near$/,
};

function validateAddress(address, chain) {
  return ADDRESS_PATTERNS[chain]?.test(address) ?? false;
}
```

## EVM Checksum Validation

```javascript
import { getAddress, isAddress } from "ethers";

function isValidEVMAddress(address) {
  if (!isAddress(address)) return false;
  
  try {
    // Throws if checksum invalid
    getAddress(address);
    return true;
  } catch {
    return false;
  }
}

function toChecksumAddress(address) {
  try {
    return getAddress(address.toLowerCase());
  } catch {
    return null;
  }
}
```

## Solana Address Validation

```javascript
import { PublicKey } from "@solana/web3.js";

function isValidSolanaAddress(address) {
  try {
    const pubkey = new PublicKey(address);
    return PublicKey.isOnCurve(pubkey.toBytes());
  } catch {
    return false;
  }
}
```

## Universal Address Detector

```javascript
function detectAndValidate(input) {
  const trimmed = input.trim();
  
  // Check each format in order of specificity
  if (/^demos[a-fA-F0-9]{64}$/.test(trimmed)) {
    return { valid: true, chain: "demos", address: trimmed };
  }
  
  if (/^0x[a-fA-F0-9]{40}$/i.test(trimmed)) {
    const checksummed = toChecksumAddress(trimmed);
    return { 
      valid: !!checksummed, 
      chain: "evm", 
      address: checksummed || trimmed,
      warning: checksummed ? null : "Invalid checksum"
    };
  }
  
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed)) {
    const valid = isValidSolanaAddress(trimmed);
    return { valid, chain: "solana", address: trimmed };
  }
  
  return { valid: false, chain: "unknown", address: trimmed };
}
```

## Address Display Utilities

```javascript
// Truncate address for display
function truncate(address, startChars = 6, endChars = 4) {
  if (address.length <= startChars + endChars + 3) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

// Format with chain prefix
function formatWithChain(address, chain) {
  const icons = { evm: "Ξ", solana: "◎", demos: "⬡" };
  return `${icons[chain] || ""} ${truncate(address)}`;
}

// Copy-friendly format
function toCopyFormat(address, chain) {
  return {
    display: truncate(address),
    full: address,
    explorer: getExplorerUrl(address, chain),
  };
}

function getExplorerUrl(address, chain) {
  const explorers = {
    ethereum: `https://etherscan.io/address/${address}`,
    polygon: `https://polygonscan.com/address/${address}`,
    base: `https://basescan.org/address/${address}`,
    solana: `https://solscan.io/account/${address}`,
    demos: `https://explorer.demos.sh/address/${address}`,
  };
  return explorers[chain] || null;
}
```

## React Component: Address Input

```jsx
function AddressInput({ onSubmit, placeholder }) {
  const [value, setValue] = useState("");
  const [validation, setValidation] = useState(null);

  const handleChange = (e) => {
    const input = e.target.value;
    setValue(input);
    
    if (input.length > 10) {
      setValidation(detectAndValidate(input));
    } else {
      setValidation(null);
    }
  };

  return (
    <div className="space-y-2">
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder || "Enter address..."}
        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
      />
      {validation && (
        <div className={`text-sm ${validation.valid ? "text-green-500" : "text-red-500"}`}>
          {validation.valid 
            ? `✓ Valid ${validation.chain.toUpperCase()} address`
            : `✗ Invalid address format`}
        </div>
      )}
    </div>
  );
}
```
