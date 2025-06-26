import { useState } from "react";
import { Wallet, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import { formatAddress } from "@/lib/utils";

// interface WalletConnectProps {
//   isConnected: boolean;
//   setIsConnected: (connected: boolean) => void;
// }

export const WalletConnect = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const { toast } = useToast();

    const { disconnect } = useDisconnect();
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();

    const connectWallet = async () => {
        setIsConnecting(true);

        try {
            // Simulate wallet connection
            await open();
            // toast({
            //     title: "Wallet Connected",
            //     description: "Successfully connected to MemeTokenDAO",
            // });
        } catch (error) {
            // toast({
            //     title: "Connection Failed",
            //     description: "Failed to connect wallet. Please try again.",
            //     variant: "destructive",
            // });
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = async () => {
        try {
            await disconnect();
            toast({
                title: "Wallet Disconnected",
                description: "Successfully disconnected from MemeTokenDAO",
            });
        } catch (error) {
            toast({
                title: "Disconnect Failed",
                description: "Failed to disconnect wallet. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (isConnected) {
        return (
            <Button variant="outline" onClick={disconnectWallet} className="bg-gradient-to-r from-purple-600 to-blue-600 border-green-500 text-green-300 hover:bg-green-500/20">
                <CheckCircle className="mr-2 h-4 w-4" />
                {formatAddress(address)}
            </Button>
        );
    }

    return (
        <Button onClick={connectWallet} disabled={isConnecting} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            <Wallet className="mr-2 h-4 w-4" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
    );
};
