import { useState } from "react";
import { ThumbsUp, ThumbsDown, Clock, Users, TrendingUp, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAppKitAccount } from "@reown/appkit/react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { uploadProposalToPinata, getProposalFromPinata, getProposalStatus } from "@/lib/utils";
import { useActions } from "@/hooks/use-actions";
import { useStatisticsData } from "@/contexts";
import { IProposal } from "@/types";
import { ethers } from "ethers";

const proposals = [
    {
        id: 1,
        title: "PepeCoin 2.0 Launch",
        description: "A next-generation Pepe meme token with deflationary mechanics and community rewards",
        status: "active",
        endDate: "March 25, 2025",
        votesFor: 1250,
        votesAgainst: 340,
        totalVotes: 1590,
        quorum: 2000,
        requestedFunding: "$500K",
        category: "Launchpad",
    },
    {
        id: 2,
        title: "ShibaSpace NFT Collection",
        description: "Community-driven NFT collection featuring space-themed Shiba Inu characters",
        status: "active",
        endDate: "March 30, 2025",
        votesFor: 890,
        votesAgainst: 120,
        totalVotes: 1010,
        quorum: 1500,
        requestedFunding: "$250K",
        category: "NFT",
    },
    {
        id: 3,
        title: "DogeDAO Gaming Platform",
        description: "P2E gaming platform with $DOGE integration and meme-themed mini-games",
        status: "passed",
        endDate: "March 15, 2025",
        votesFor: 2100,
        votesAgainst: 450,
        totalVotes: 2550,
        quorum: 2000,
        requestedFunding: "$750K",
        category: "Gaming",
    },
];

export const VotingSection = () => {
    const [votedProposals, setVotedProposals] = useState<Set<number>>(new Set());
    const { toast } = useToast();
    const { isConnected } = useAppKitAccount();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [funding, setFunding] = useState("");
    const [open, setOpen] = useState(false);
    const { createProposal, castVote } = useActions();
    const { statisticsData } = useStatisticsData();

    const activeProposals = statisticsData.proposals.filter((proposal: IProposal) => getProposalStatus(proposal.status) === "active");
    const resolvedProposalCount = statisticsData.proposals.filter((proposal: IProposal) => getProposalStatus(proposal.status) === "resolved").length;
    const votingPower = Number(ethers.formatEther(statisticsData.votingPower)).toLocaleString();
    const votersCount = activeProposals.length > 0 ? Number(activeProposals[activeProposals.length - 1].votersCount).toLocaleString() : 0;

    const handleVote = async (proposalId: number, vote: "for" | "against") => {
        if (!isConnected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet to vote",
                variant: "destructive",
            });
            return;
        }

        try {
            const succeed = await castVote(proposalId, vote === "for");
            if (succeed) {
                toast({
                    title: "Vote Submitted",
                    description: `Successfully voted ${vote} proposal #${proposalId}`,
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmitProposal = async (e) => {
        e.preventDefault();
        if (!title || !description || !category || !funding || !selectedDate) {
            toast({
                title: "Missing Fields",
                description: "Please fill out all fields.",
                variant: "destructive",
            });
            return;
        }

        try {
            const cid = await uploadProposalToPinata({ title, description, category, requestedFunding: funding, endDate: selectedDate.toDateString() });
            if (cid !== null) {
                const delay = 0;
                const duration = parseInt(`${(selectedDate.getTime() - new Date().getTime()) / 1000}`);

                const succeed = await createProposal(cid, delay, duration);
                if (succeed) {
                    toast({
                        title: "Proposal Submitted",
                        description: `Title: ${title}\nCategory: ${category}\nFunding: ${funding}\nEnd Date: ${format(selectedDate, "MM/dd/yyyy")}`,
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
        // Reset form
        setTitle("");
        setDescription("");
        setCategory("");
        setFunding("");
        setSelectedDate(new Date());
        setOpen(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-blue-600/20 text-blue-300 border-blue-500/50";
            case "passed":
                return "bg-green-600/20 text-green-300 border-green-500/50";
            case "rejected":
                return "bg-red-600/20 text-red-300 border-red-500/50";
            default:
                return "bg-gray-600/20 text-gray-300 border-gray-500/50";
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Launchpad":
                return "bg-purple-600/20 text-purple-300 border-purple-500/50";
            case "NFT":
                return "bg-pink-600/20 text-pink-300 border-pink-500/50";
            case "Gaming":
                return "bg-orange-600/20 text-orange-300 border-orange-500/50";
            default:
                return "bg-gray-600/20 text-gray-300 border-gray-500/50";
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-4xl font-bold text-white mb-4">DAO Governance</h2>
                <p className="text-xl text-gray-300">Vote on meme project proposals and shape the future of our ecosystem</p>
            </div>

            {/* Voting Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                    <CardContent className="p-6 text-center">
                        <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{votersCount}</p>
                        <p className="text-sm text-gray-300">Active Voters</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                    <CardContent className="p-6 text-center">
                        <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{activeProposals.length}</p>
                        <p className="text-sm text-gray-300">Active Proposals</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                    <CardContent className="p-6 text-center">
                        <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{votingPower}</p>
                        <p className="text-sm text-gray-300">Your Voting Power</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                    <CardContent className="p-6 text-center">
                        <ExternalLink className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{resolvedProposalCount}</p>
                        <p className="text-sm text-gray-300">Projects Funded</p>
                    </CardContent>
                </Card>
            </div>

            {/* Proposals */}
            <div className="space-y-6">
                {statisticsData.proposals.map((proposal: IProposal, index: number) => {
                    const totalVotes = proposal.votesFor + proposal.votesAgainst;
                    const votePercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
                    const quorumPercentage = (totalVotes / statisticsData.quorum) * 100;
                    const hasVoted = proposal.isVoted;
                    const status = getProposalStatus(proposal.status);

                    return (
                        <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-lg">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Badge className={getStatusColor(status)}>{status.toUpperCase()}</Badge>
                                            <Badge className={getCategoryColor(proposal.metadata.category)}>{proposal.metadata.category}</Badge>
                                            <span className="text-sm text-gray-400">#{index}</span>
                                        </div>
                                        <CardTitle className="text-white text-xl">{proposal.metadata.title}</CardTitle>
                                        <CardDescription className="text-gray-300 mt-2">{proposal.metadata.description}</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Funding Request</p>
                                        <p className="text-lg font-bold text-green-400">{proposal.metadata.requestedFunding}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Voting Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Support</span>
                                        <span className="text-white">
                                            {votePercentage.toFixed(1)}% ({proposal.votesFor} votes)
                                        </span>
                                    </div>
                                    <Progress value={votePercentage} className="h-2" />
                                </div>

                                {/* Quorum Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Quorum Progress</span>
                                        <span className="text-white">
                                            {totalVotes} / {statisticsData.quorum} votes
                                        </span>
                                    </div>
                                    <Progress value={quorumPercentage} className="h-2" />
                                </div>

                                {/* Vote Details */}
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-gray-400">For</p>
                                        <p className="text-lg font-bold text-green-400">{proposal.votesFor}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Against</p>
                                        <p className="text-lg font-bold text-red-400">{proposal.votesAgainst}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Ends</p>
                                        <p className="text-sm text-white">{proposal.metadata.endDate}</p>
                                    </div>
                                </div>

                                {/* Voting Buttons */}
                                {status === "active" && (
                                    <div className="flex space-x-4">
                                        <Button onClick={() => handleVote(index + 1, "for")} disabled={hasVoted || !isConnected} className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                                            <ThumbsUp className="mr-2 h-4 w-4" />
                                            Vote For
                                        </Button>
                                        <Button onClick={() => handleVote(index + 1, "against")} disabled={hasVoted || !isConnected} variant="outline" className="flex-1 border-red-500 text-red-300 hover:bg-red-500/20">
                                            <ThumbsDown className="mr-2 h-4 w-4" />
                                            Vote Against
                                        </Button>
                                    </div>
                                )}

                                {hasVoted && (
                                    <div className="text-center">
                                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50">✓ You have voted on this proposal</Badge>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Submit Proposal CTA */}
            <Dialog open={open} onOpenChange={setOpen}>
                <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                    <CardContent className="p-8 text-center">
                        <h3 className="text-2xl font-bold text-white mb-4">Have a Meme Project Idea?</h3>
                        <p className="text-gray-300 mb-6">Submit your proposal to the DAO and get community funding for your next big meme project</p>
                        <DialogTrigger asChild>
                            <Button disabled={!isConnected} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                Submit Proposal
                            </Button>
                        </DialogTrigger>
                    </CardContent>
                </Card>
                <DialogContent className="bg-white/10 border-white/20 backdrop-blur-lg text-white shadow-lg rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Submit a New Proposal</DialogTitle>
                        <DialogDescription>Fill out the form below to submit your meme project proposal for DAO voting.</DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleSubmitProposal}>
                        <div>
                            <Label htmlFor="proposal-title">Title</Label>
                            <Input id="proposal-title" name="title" className="text-black" required placeholder="Enter proposal title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="proposal-description">Description</Label>
                            <Textarea id="proposal-description" name="description" className="text-black" required placeholder="Describe your project" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="proposal-category">Category</Label>
                            <Select name="category" required value={category} onValueChange={setCategory}>
                                <SelectTrigger id="proposal-category" className="text-black">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Launchpad">Launchpad</SelectItem>
                                    <SelectItem value="NFT">NFT</SelectItem>
                                    <SelectItem value="Gaming">Gaming</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="proposal-funding">Requested Funding</Label>
                            <Input id="proposal-funding" name="funding" className="text-black" required placeholder="$100K" value={funding} onChange={(e) => setFunding(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="proposal-end-date">End Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={"w-full justify-start text-left font-normal text-black bg-white" + (!selectedDate ? " text-muted-foreground" : "")}>
                                        {selectedDate ? format(selectedDate, "MM/dd/yyyy") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white text-black" align="start">
                                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                Submit Proposal
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
