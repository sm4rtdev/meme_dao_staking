
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Clock, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface VotingSectionProps {
  isConnected: boolean;
}

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
    category: "Launchpad"
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
    category: "NFT"
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
    category: "Gaming"
  }
];

export const VotingSection = ({ isConnected }: VotingSectionProps) => {
  const [votedProposals, setVotedProposals] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleVote = (proposalId: number, vote: 'for' | 'against') => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      });
      return;
    }

    setVotedProposals(prev => new Set(prev).add(proposalId));
    toast({
      title: "Vote Submitted",
      description: `Successfully voted ${vote} proposal #${proposalId}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-600/20 text-blue-300 border-blue-500/50';
      case 'passed':
        return 'bg-green-600/20 text-green-300 border-green-500/50';
      case 'rejected':
        return 'bg-red-600/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-600/20 text-gray-300 border-gray-500/50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Launchpad':
        return 'bg-purple-600/20 text-purple-300 border-purple-500/50';
      case 'NFT':
        return 'bg-pink-600/20 text-pink-300 border-pink-500/50';
      case 'Gaming':
        return 'bg-orange-600/20 text-orange-300 border-orange-500/50';
      default:
        return 'bg-gray-600/20 text-gray-300 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h2 className="text-4xl font-bold text-white mb-4">DAO Governance</h2>
        <p className="text-xl text-gray-300">
          Vote on meme project proposals and shape the future of our ecosystem
        </p>
      </div>

      {/* Voting Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1,247</p>
            <p className="text-sm text-gray-300">Active Voters</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-sm text-gray-300">Active Proposals</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1,250</p>
            <p className="text-sm text-gray-300">Your Voting Power</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <ExternalLink className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">8</p>
            <p className="text-sm text-gray-300">Projects Funded</p>
          </CardContent>
        </Card>
      </div>

      {/* Proposals */}
      <div className="space-y-6">
        {proposals.map((proposal) => {
          const votePercentage = proposal.totalVotes > 0 ? (proposal.votesFor / proposal.totalVotes) * 100 : 0;
          const quorumPercentage = (proposal.totalVotes / proposal.quorum) * 100;
          const hasVoted = votedProposals.has(proposal.id);

          return (
            <Card key={proposal.id} className="bg-white/10 border-white/20 backdrop-blur-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStatusColor(proposal.status)}>
                        {proposal.status.toUpperCase()}
                      </Badge>
                      <Badge className={getCategoryColor(proposal.category)}>
                        {proposal.category}
                      </Badge>
                      <span className="text-sm text-gray-400">#{proposal.id}</span>
                    </div>
                    <CardTitle className="text-white text-xl">{proposal.title}</CardTitle>
                    <CardDescription className="text-gray-300 mt-2">
                      {proposal.description}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Funding Request</p>
                    <p className="text-lg font-bold text-green-400">{proposal.requestedFunding}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Voting Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Support</span>
                    <span className="text-white">{votePercentage.toFixed(1)}% ({proposal.votesFor} votes)</span>
                  </div>
                  <Progress value={votePercentage} className="h-2" />
                </div>

                {/* Quorum Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Quorum Progress</span>
                    <span className="text-white">{proposal.totalVotes} / {proposal.quorum} votes</span>
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
                    <p className="text-sm text-white">{proposal.endDate}</p>
                  </div>
                </div>

                {/* Voting Buttons */}
                {proposal.status === 'active' && (
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => handleVote(proposal.id, 'for')}
                      disabled={hasVoted || !isConnected}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Vote For
                    </Button>
                    <Button
                      onClick={() => handleVote(proposal.id, 'against')}
                      disabled={hasVoted || !isConnected}
                      variant="outline"
                      className="flex-1 border-red-500 text-red-300 hover:bg-red-500/20"
                    >
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      Vote Against
                    </Button>
                  </div>
                )}

                {hasVoted && (
                  <div className="text-center">
                    <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50">
                      ✓ You have voted on this proposal
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Proposal CTA */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/50 backdrop-blur-lg">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Have a Meme Project Idea?</h3>
          <p className="text-gray-300 mb-6">
            Submit your proposal to the DAO and get community funding for your next big meme project
          </p>
          <Button
            disabled={!isConnected}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Submit Proposal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
