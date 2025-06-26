import { useState, useEffect } from "react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Contract, Eip1193Provider, ethers, toBigInt } from "ethers";
import { MEME_ADDRESS, MEME_STAKING_ADDRESS, MEME_DAO_ADDRESS } from "@/constants";
import MEMETokenAbi from "@/abis/MEMETokenABI.json";
import MEMEStakingAbi from "@/abis/MEMEStakingABI.json";
import MEMEDAOAbi from "@/abis/MEMEDaoABI.json";

import { useToast } from "@/hooks/use-toast";

export const useActions = () => {
    const { address, isConnected } = useAppKitAccount();
    const { walletProvider }: { walletProvider: Eip1193Provider } = useAppKitProvider("eip155");
    const { toast } = useToast();

    const stake = async (amount: string) => {
        if (!isConnected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect wallet first.",
                variant: "destructive",
            });
            return;
        }
        try {
            const ethersProvider = new BrowserProvider(walletProvider);
            const signer = await ethersProvider.getSigner();

            const stakingContract = new Contract(MEME_STAKING_ADDRESS, MEMEStakingAbi, signer);
            const memeContract = new Contract(MEME_ADDRESS, MEMETokenAbi, signer);
            const memeBalance = await memeContract.balanceOf(address);
            const stakeAmount = ethers.parseEther(amount);
            if (stakeAmount > memeBalance) {
                toast({
                    title: "Insufficient MEME Balance",
                    description: `Your MEME Balance ${ethers.formatEther(memeBalance)} is below than stake amount ${amount}`,
                });
                return;
            }

            const approveTx = await memeContract.approve(MEME_STAKING_ADDRESS, stakeAmount);
            await approveTx.wait();

            const stakeTx = await stakingContract.stake(stakeAmount);
            await stakeTx.wait();

            toast({
                title: "Staking Successful",
                description: `Successfully staked ${amount} $MEME tokens`,
            });
        } catch (err) {
            console.log(err);
            toast({
                title: "Stake Failed",
                description: "Failed to stake MEME, Please try again later.",
            });
        }
    };

    const unstake = async (amount: string) => {
        if (!isConnected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect wallet first.",
                variant: "destructive",
            });
            return;
        }

        try {
            const ethersProvider = new BrowserProvider(walletProvider);
            const signer = await ethersProvider.getSigner();

            const stakingContract = new Contract(MEME_STAKING_ADDRESS, MEMEStakingAbi, signer);
            const stakedAmount = await stakingContract.getStakedBalance(address);
            const unstakeAmount = ethers.parseEther(amount);

            if (unstakeAmount > stakedAmount) {
                toast({
                    title: "Insufficient staked Balance",
                    description: `Your staked $MEME Balance ${ethers.formatEther(stakedAmount)} is below than unstake amount ${amount}`,
                });
                return;
            }

            const unstakeTx = await stakingContract.withdraw(unstakeAmount);
            await unstakeTx.wait();
        } catch (err) {
            console.log(err);
            toast({
                title: "Unstake Failed",
                description: "Failed to unstake MEME, Please try again later.",
            });
        }
    };

    const claimRewards = async () => {
        if (!isConnected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect wallet first.",
                variant: "destructive",
            });
            return;
        }

        try {
            const ethersProvider = new BrowserProvider(walletProvider);
            const signer = await ethersProvider.getSigner();

            const stakingContract = new Contract(MEME_STAKING_ADDRESS, MEMEStakingAbi, signer);

            const claimTx = await stakingContract.claimReward();
            await claimTx.wait();
        } catch (err) {
            console.log(err);
            toast({
                title: "Claim Reward Failed",
                description: "Failed to claim reward, Please try again later.",
            });
        }
    };

    const createProposal = async (cid: string, delay: number, duration: number) => {
        if (!isConnected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect wallet first.",
                variant: "destructive",
            });
            return;
        }

        try {
            const ethersProvider = new BrowserProvider(walletProvider);
            const signer = await ethersProvider.getSigner();

            const daoContract = new Contract(MEME_DAO_ADDRESS, MEMEDAOAbi, signer);

            const createProposalTx = await daoContract.createProposal(cid, toBigInt(delay), toBigInt(duration));
            await createProposalTx.wait();

            return true;
        } catch (err) {
            console.log(err);
            toast({
                title: "Create Proposal Failed",
                description: "Failed to create proposal, Please try again later.",
            });

            return false;
        }
    };

    const castVote = async (proposalIndex: number, vote: boolean) => {
        if (!isConnected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect wallet first.",
                variant: "destructive",
            });
            return;
        }

        try {
            const ethersProvider = new BrowserProvider(walletProvider);
            const signer = await ethersProvider.getSigner();

            const daoContract = new Contract(MEME_DAO_ADDRESS, MEMEDAOAbi, signer);

            const voteTx = await daoContract.vote(proposalIndex, vote);
            await voteTx.wait();

            return true;
        } catch (err) {
            console.log(err);
            toast({
                title: "Vote Failed",
                description: "Failed to vote, Please try again later.",
            });

            return false;
        }
    };
    return { stake, unstake, claimRewards, createProposal, castVote };
};
