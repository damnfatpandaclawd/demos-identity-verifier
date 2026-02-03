import { useState } from "react";

// Address type detection
function detectAddressType(input) {
  const trimmed = input.trim();
  if (/^demos[a-fA-F0-9]{64}$/.test(trimmed)) return "demos";
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return "evm";
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed)) return "solana";
  return "unknown";
}

// Mock identity lookup (replace with real SDK when available)
async function lookupIdentity(address, type) {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 1500));
  
  // Mock data for demonstration
  const mockIdentities = {
    "0x742d35Cc6634C0532925a3b844Bc9e7595f4e123": {
      demosAddress: "demos8a4f2e1b9c3d5678901234567890abcdef1234567890abcdef1234567890ab",
      xmIdentities: [
        { chain: "ethereum", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f4e123" },
        { chain: "polygon", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f4e123" },
        { chain: "solana", address: "7EYnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs" }
      ],
      web2Identities: [
        { platform: "twitter", handle: "@demosweb3", verified: true },
        { platform: "github", handle: "demosnetwork", verified: true }
      ],
      reputation: { score: 87, validations: 42 }
    }
  };

  // Check if we have mock data for this address
  if (mockIdentities[address]) {
    return { found: true, ...mockIdentities[address] };
  }

  // For demo purposes, generate fake data for any valid address
  if (type !== "unknown") {
    return {
      found: true,
      demosAddress: "demos" + "a".repeat(64),
      xmIdentities: [
        { chain: type === "evm" ? "ethereum" : type, address: address }
      ],
      web2Identities: [],
      reputation: { score: 0, validations: 0 }
    };
  }

  return { found: false };
}

function App() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async () => {
    if (!address.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    const type = detectAddressType(address);
    
    if (type === "unknown") {
      setError("Invalid address format. Please enter a valid Demos, EVM, or Solana address.");
      setLoading(false);
      return;
    }

    try {
      const identity = await lookupIdentity(address, type);
      setResult({ type, ...identity });
    } catch (err) {
      setError("Failed to lookup identity: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-demos-dark">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-demos-blue to-demos-magenta rounded-lg" />
            <h1 className="text-xl font-semibold">Identity Verifier</h1>
          </div>
          <span className="text-sm text-gray-500">Powered by Demos CCI</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-demos-blue via-demos-magenta to-demos-orange bg-clip-text text-transparent">
            Verify Cross-Chain Identity
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Look up any address to discover linked wallets and verified social proofs 
            using Demos Cross-Context Identity (CCI).
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white/5 rounded-2xl p-8 mb-8 border border-white/10">
          <div className="flex gap-4">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="Enter Demos, EVM (0x...), or Solana address"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-demos-blue mono text-sm"
            />
            <button
              onClick={handleVerify}
              disabled={loading || !address.trim()}
              className="px-6 py-3 bg-demos-blue hover:bg-demos-blue/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl font-medium transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </span>
              ) : "Verify"}
            </button>
          </div>
          
          {/* Address Type Hints */}
          <div className="flex gap-6 mt-4 text-sm text-gray-500">
            <span>Demos: <code className="text-demos-cyan">demos...</code></span>
            <span>EVM: <code className="text-demos-orange">0x...</code></span>
            <span>Solana: <code className="text-demos-magenta">Base58</code></span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8 text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        {result && result.found && (
          <div className="space-y-6">
            {/* Identity Card */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Identity Found
                </h3>
                <span className="px-3 py-1 bg-demos-blue/20 text-demos-cyan rounded-full text-sm capitalize">
                  {result.type}
                </span>
              </div>

              {/* Demos Address */}
              <div className="mb-6">
                <label className="text-sm text-gray-500 mb-1 block">Demos Address</label>
                <code className="text-demos-cyan text-sm break-all">{result.demosAddress}</code>
              </div>

              {/* Reputation */}
              {result.reputation && (
                <div className="flex gap-6 mb-6">
                  <div className="bg-white/5 rounded-xl px-4 py-3">
                    <div className="text-2xl font-bold text-demos-blue">{result.reputation.score}</div>
                    <div className="text-xs text-gray-500">Reputation Score</div>
                  </div>
                  <div className="bg-white/5 rounded-xl px-4 py-3">
                    <div className="text-2xl font-bold text-demos-magenta">{result.reputation.validations}</div>
                    <div className="text-xs text-gray-500">Validations</div>
                  </div>
                </div>
              )}
            </div>

            {/* Linked Wallets */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">🔗 Linked Wallets</h3>
              {result.xmIdentities.length > 0 ? (
                <div className="space-y-3">
                  {result.xmIdentities.map((wallet, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ChainIcon chain={wallet.chain} />
                        <span className="capitalize font-medium">{wallet.chain}</span>
                      </div>
                      <code className="text-sm text-gray-400 mono">{truncateAddress(wallet.address)}</code>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No linked wallets found</p>
              )}
            </div>

            {/* Social Proofs */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">✓ Social Proofs</h3>
              {result.web2Identities.length > 0 ? (
                <div className="space-y-3">
                  {result.web2Identities.map((social, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <SocialIcon platform={social.platform} />
                        <span className="capitalize font-medium">{social.platform}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{social.handle}</span>
                        {social.verified && (
                          <span className="text-green-500">✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No social proofs linked</p>
              )}
            </div>
          </div>
        )}

        {result && !result.found && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No Identity Found</h3>
            <p className="text-gray-400">This address is not linked to a Demos identity yet.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4 mt-12">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          Built with <a href="https://demos.sh" className="text-demos-blue hover:underline">Demos SDK</a> · 
          Part of the <a href="https://moltbook.com" className="text-demos-orange hover:underline">Moltbook</a> ecosystem
        </div>
      </footer>
    </div>
  );
}

function truncateAddress(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function ChainIcon({ chain }) {
  const colors = {
    ethereum: "bg-blue-500",
    polygon: "bg-purple-500",
    solana: "bg-gradient-to-br from-purple-500 to-green-400",
    base: "bg-blue-600",
  };
  return <div className={`w-6 h-6 rounded-full ${colors[chain] || "bg-gray-500"}`} />;
}

function SocialIcon({ platform }) {
  const icons = {
    twitter: "🐦",
    github: "🐙",
    discord: "💬",
  };
  return <span className="text-xl">{icons[platform] || "🔗"}</span>;
}

export default App;
