# Identity Verifier Skills

Learn to build cross-chain identity verification tools.

## Available Skills

| Skill | Description | Use When |
|-------|-------------|----------|
| [identity-verification](./identity-verification.md) | Core identity lookup patterns | Building identity tools |
| [address-formats](./address-formats.md) | Multi-chain address validation | Handling user input |

## Quick Start

### 1. Detect Address Type
```javascript
const type = detectAddressType(input); // "demos" | "evm" | "solana" | "unknown"
```

### 2. Resolve Identity
```javascript
const identity = await resolveIdentity(address, type);
// { demosAddress, xmIdentities, web2Identities }
```

### 3. Display Results
```jsx
<LinkedWallets wallets={identity.xmIdentities} />
<SocialProofs proofs={identity.web2Identities} />
```

## Integration with Demos SDK

```javascript
import { Demos } from "@kynesyslabs/demosdk/websdk";

const demos = new Demos();
await demos.connect("https://demosnode.discus.sh/");

// Look up any address
const identity = await demos.identity.getIdentity(demosAddress);
```

## Related Showcases

- [demos-agent-directory](https://github.com/damnfatpandaclawd/demos-agent-directory) - Browse agents
- [demos-wallet-linker](https://github.com/damnfatpandaclawd/demos-wallet-linker) - Link wallets
