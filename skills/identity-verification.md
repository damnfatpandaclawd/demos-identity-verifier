# Skill: Cross-Chain Identity Verification

Learn to verify identities across multiple blockchains using Demos Cross-Context Identity (CCI).

## What You Will Learn

- Detect address types (Demos, EVM, Solana)
- Resolve addresses to unified identities
- Display linked wallets and social proofs
- Handle verification states and errors

## Core Pattern: Address Type Detection

```javascript
function detectAddressType(input) {
  const trimmed = input.trim();
  
  // Demos: "demos" prefix + 64 hex characters
  if (/^demos[a-fA-F0-9]{64}$/.test(trimmed)) return "demos";
  
  // EVM: "0x" prefix + 40 hex characters  
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return "evm";
  
  // Solana: Base58, 32-44 characters
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed)) return "solana";
  
  return "unknown";
}
```

## Core Pattern: Identity Resolution

```javascript
import { Demos } from "@kynesyslabs/demosdk/websdk";

async function resolveIdentity(address, type) {
  const demos = new Demos();
  await demos.connect("https://demosnode.discus.sh/");
  
  let demosAddress;
  
  if (type === "demos") {
    demosAddress = address;
  } else {
    // Resolve EVM/Solana to Demos identity
    const identity = await demos.identity.resolveByXmAddress(address, type);
    demosAddress = identity?.demosAddress;
  }
  
  if (!demosAddress) return { found: false };
  
  // Get full identity info
  const fullIdentity = await demos.identity.getIdentity(demosAddress);
  
  return {
    found: true,
    demosAddress,
    xmIdentities: fullIdentity.xmIdentities || [],
    web2Identities: fullIdentity.web2Identities || [],
  };
}
```

## Core Pattern: Display Linked Wallets

```jsx
function LinkedWallets({ wallets }) {
  const chainColors = {
    ethereum: "bg-blue-500",
    polygon: "bg-purple-500", 
    solana: "bg-green-500",
    base: "bg-blue-600",
  };

  return (
    <div className="space-y-2">
      {wallets.map((wallet, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full ${chainColors[wallet.chain]}`} />
            <span className="capitalize">{wallet.chain}</span>
          </div>
          <code className="text-sm text-gray-400">
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </code>
        </div>
      ))}
    </div>
  );
}
```

## Core Pattern: Social Proof Display

```jsx
function SocialProofs({ proofs }) {
  const platformIcons = {
    twitter: "🐦",
    github: "🐙", 
    discord: "💬",
  };

  return (
    <div className="space-y-2">
      {proofs.map((proof, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2">
            <span>{platformIcons[proof.platform]}</span>
            <span className="capitalize">{proof.platform}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{proof.handle}</span>
            {proof.verified && <span className="text-green-500">✓</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling Pattern

```javascript
async function safeResolve(address) {
  const type = detectAddressType(address);
  
  if (type === "unknown") {
    return { 
      error: "Invalid address format",
      hint: "Enter a valid Demos, EVM (0x...), or Solana address"
    };
  }

  try {
    const result = await resolveIdentity(address, type);
    if (!result.found) {
      return { 
        error: "No identity found",
        hint: "This address is not linked to a Demos identity"
      };
    }
    return { success: true, data: result };
  } catch (err) {
    return { 
      error: "Network error",
      hint: "Failed to connect to Demos network. Try again."
    };
  }
}
```

## UI State Machine

```javascript
const STATES = {
  IDLE: "idle",           // Waiting for input
  LOADING: "loading",     // Fetching identity
  SUCCESS: "success",     // Identity found
  NOT_FOUND: "not_found", // Address valid but no identity
  ERROR: "error",         // Network/validation error
};

function useIdentityLookup() {
  const [state, setState] = useState(STATES.IDLE);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const lookup = async (address) => {
    setState(STATES.LOADING);
    setError(null);
    
    const result = await safeResolve(address);
    
    if (result.error) {
      setState(result.hint.includes("not linked") ? STATES.NOT_FOUND : STATES.ERROR);
      setError(result.error);
    } else {
      setState(STATES.SUCCESS);
      setData(result.data);
    }
  };

  return { state, data, error, lookup };
}
```

## Integration Points

| Feature | Demos SDK Method | Description |
|---------|-----------------|-------------|
| Get identity | `demos.identity.getIdentity(addr)` | Full identity with all links |
| Resolve EVM | `demos.identity.resolveByXmAddress(addr, "evm")` | EVM → Demos |
| Resolve Solana | `demos.identity.resolveByXmAddress(addr, "solana")` | Solana → Demos |
| Get proofs | `demos.identity.getWeb2Proofs(addr)` | Social verifications |

## When to Use This Skill

- Building identity lookup tools
- Verifying agent identities in workflows
- Displaying user profiles with cross-chain wallets
- Implementing "connect with Demos" features
