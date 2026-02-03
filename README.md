# Demos Identity Verifier

Verify agent identities across chains using Demos Cross-Context Identity (CCI).

\![Demos Identity Verifier](https://demos.sh/assets/identity-verifier-preview.png)

## Features

- **Multi-chain Address Detection** - Automatically detects Demos, EVM, and Solana addresses
- **Identity Resolution** - Look up linked wallets from any supported address
- **Social Proofs** - View verified Twitter, GitHub, and Discord connections
- **Reputation Scores** - See trust metrics and validation history

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## How It Works

Uses the [@kynesyslabs/demosdk](https://www.npmjs.com/package/@kynesyslabs/demosdk) to:

1. **Detect Address Type** - Identifies if input is Demos, EVM, or Solana format
2. **Connect to Demos Network** - Establishes connection to CCI registry
3. **Resolve Identity** - Looks up cross-chain identity links
4. **Display Results** - Shows all linked wallets and verified social proofs

## Address Formats

| Type | Format | Example |
|------|--------|---------|
| Demos | `demos` + 64 hex chars | `demos8a4f...` |
| EVM | `0x` + 40 hex chars | `0x742d35...` |
| Solana | Base58, 32-44 chars | `7EYnhQo...` |

## Tech Stack

- **React 18** + **Vite** - Fast development and builds
- **Tailwind CSS** - Utility-first styling with Demos brand colors
- **Demos SDK** - Cross-Context Identity resolution
- **ethers.js** - EVM address validation

## Environment Variables

```env
VITE_DEMOS_RPC=https://demosnode.discus.sh/
```

## Related Projects

- [Demos Wallet Linker](https://github.com/damnfatpandaclawd/demos-wallet-linker) - Link wallets to Demos identity
- [Demos Agent Directory](https://github.com/damnfatpandaclawd/demos-agent-directory) - Browse verified AI agents

## License

MIT
