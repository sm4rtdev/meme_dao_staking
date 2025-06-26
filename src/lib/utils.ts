import { clsx, type ClassValue } from "clsx";
import { parseEther, toBigInt } from "ethers";
import { twMerge } from "tailwind-merge";
import { IProposalMetadata } from "@/types";

const PINATA_API_KEY = "6ac60d93f668aad617d1";
const PINATA_SECRET_KEY = "e14eea7c848e8e2e51316796d86db783e3da33e8651fe894bcd9654605741f31";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatAddress(addr: string) {
    return `${addr.slice(0, 6)}...${addr.slice(addr.length - 4, addr.length)}`;
}

export function calculateAPY(rewardRate, totalStaked) {
    if (totalStaked === toBigInt(0)) {
        return toBigInt(0);
    }

    // Calculate rewards per token per second
    const rewardsPerTokenPerSecond = (rewardRate * parseEther("1")) / totalStaked;

    // Convert to annual rate
    const secondsPerYear = toBigInt("365") * toBigInt("24") * toBigInt("60") * toBigInt("60"); // 31,536,000 seconds
    const annualRewardRate = rewardsPerTokenPerSecond * secondsPerYear;

    // Convert to percentage
    const apy = annualRewardRate * toBigInt(100);

    return apy;
}

export const uploadProposalToPinata = async (proposal: IProposalMetadata): Promise<string | null> => {
    try {
        const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_KEY,
                Accept: "application/json",
            },
            body: JSON.stringify(proposal),
        });
        const result = await response.json();

        return result.IpfsHash;
    } catch (error) {
        console.error("Failed to upload proposal to Pinata:", error);
        return null;
    }
};

export const getProposalFromPinata = async (ipfsHash: string): Promise<IProposalMetadata | null> => {
    try {
        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

        if (!response.ok) {
            return null;
        }

        const proposal: IProposalMetadata = await response.json();
        return proposal;
    } catch (error) {
        console.log("Failed to retrieve proposal from IPFS:", error);
        return null;
    }
};

export const getProposalStatus = (status: number, votesFor?: number, votesAgainst?: number) => {
    if (status == 0) {
        return "not_started";
    } else if (status == 1) {
        return "active";
    } else if (status == 2) {
        if (votesFor >= votesAgainst) return "passed";
        else return "failed";
    } else if (status == 3) {
        return "resolved";
    } else if (status == 4) {
        return "canceled";
    } else if (status == 5) {
        return "quorum_failed";
    }
};
