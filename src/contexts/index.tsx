import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Contract, Eip1193Provider, ethers, toBigInt } from "ethers";
import { MEME_ADDRESS, MEME_STAKING_ADDRESS, MEME_DAO_ADDRESS } from "@/constants";
import { getProvider } from "@/constants/provider";
import MEMETokenAbi from "@/abis/MEMETokenABI.json";
import MEMEStakingAbi from "@/abis/MEMEStakingABI.json";
import MEMEDAOAbi from "@/abis/MEMEDaoABI.json";
import { calculateAPY, getProposalFromPinata } from "@/lib/utils";
import type { IProposal } from "@/types";

export const statisticsContext = createContext(null);

export const StatisticsProvider = ({ children }: { children: ReactNode }) => {
    const [statisticsData, setStatisticsData] = useState({
        currentAPY: toBigInt(0),
        stakedMEME: toBigInt(0),
        pendingRewards: toBigInt(0),
        availableAfter: toBigInt(0),
        votingPower: toBigInt(0),
        proposals: [],
        quorum: 0,
    });
    const { address, isConnected } = useAppKitAccount();
    const { walletProvider }: { walletProvider: Eip1193Provider } = useAppKitProvider("eip155");

    useEffect(() => {
        const fetchProposals = async () => {
            const provider = getProvider();
            const daoContract = new Contract(MEME_DAO_ADDRESS, MEMEDAOAbi, provider);

            const quorum = await daoContract.minVotesNeeded();
            const proposalCount = await daoContract.proposalCount();
            const proposals: IProposal[] = [];
            for (let i = 0; i < proposalCount; i++) {
                const proposalData = await daoContract.getProposalData(i + 1);
                const metadata = await getProposalFromPinata(proposalData[0]);
                const proposal: IProposal = {
                    proposalCID: proposalData[0],
                    metadata: metadata,
                    votesFor: Number(ethers.formatEther(proposalData[1])),
                    votesAgainst: Number(ethers.formatEther(proposalData[2])),
                    votersCount: Number(ethers.formatEther(proposalData[3])),
                    startTime: Number(proposalData[4]),
                    endTime: Number(proposalData[5]),
                    status: Number(proposalData[6]),
                    proposer: proposalData[7],
                    isVoted: false,
                };
                proposals.push(proposal);
            }

            if (isConnected && address) {
                const ethersProvider = new BrowserProvider(walletProvider);
                const signer = await ethersProvider.getSigner();

                const browserDaoContract = new Contract(MEME_ADDRESS, MEMEDAOAbi, signer);
                for (let i = 0; i < proposalCount; i++) {
                    const isVoted = await browserDaoContract.getDidVote(i + 1);
                    proposals[i].isVoted = isVoted;
                }
            }

            setStatisticsData((prev) => {
                return { ...prev, proposals, quorum: Number(ethers.formatEther(quorum)) };
            });
        };
        fetchProposals();
    }, [address, isConnected]);

    useEffect(() => {
        const fetchStaking = async () => {
            const ethersProvider = new BrowserProvider(walletProvider);
            const signer = await ethersProvider.getSigner();

            const stakingContract = new Contract(MEME_STAKING_ADDRESS, MEMEStakingAbi, signer);
            const stakedAmount = await stakingContract.getStakedBalance(address);
            const pendingRewards = await stakingContract.earned(address);
            const unlockTime = await stakingContract.getUnlockTime(address);
            const rewardRate = await stakingContract.rewardRate();
            const totalStaked = await stakingContract.totalStaked();
            const votingPower = await stakingContract.getVotingPower(address);

            const apy = calculateAPY(rewardRate, totalStaked);
            setStatisticsData((prev) => {
                return { ...prev, currentAPY: apy, stakedMEME: stakedAmount, pendingRewards: pendingRewards, votingPower: votingPower, availableAfter: unlockTime };
            });
        };
        if (!isConnected) {
            setStatisticsData((prev) => {
                return { ...prev, stakedMEME: toBigInt(0), pendingRewards: toBigInt(0) };
            });
        } else {
            fetchStaking();
        }
    }, [address, isConnected]);

    return <statisticsContext.Provider value={{ statisticsData }}>{children}</statisticsContext.Provider>;
};
export const useStatisticsData = () => {
    const context = useContext(statisticsContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
