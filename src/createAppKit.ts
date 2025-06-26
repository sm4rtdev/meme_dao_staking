import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { avalancheFuji } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

// 1. Get projectId
const projectId = "7fb2af622044d6facb0b3e32bb0de726";

// 2. Set the networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [avalancheFuji];

// 3. Create a metadata object - optional
const metadata = {
    name: "MEME DAO",
    description: "$MEME DAO Station",
    url: "http://192.168.12.95:8080", // origin must match your domain & subdomain
    icons: [],
};

// 4. Create a AppKit instance
createAppKit({
    adapters: [new EthersAdapter()],
    networks,
    metadata,
    projectId,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
    },
});
