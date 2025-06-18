
import { useState } from 'react';
import { Plus, Minus, TrendingUp, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface StakingSectionProps {
  isConnected: boolean;
}

export const StakingSection = ({ isConnected }: StakingSectionProps) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const { toast } = useToast();

  const handleStake = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to stake tokens",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Staking Successful",
      description: `Successfully staked ${stakeAmount} $MEME tokens`,
    });
    setStakeAmount('');
  };

  const handleUnstake = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to unstake tokens",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Unstaking Initiated",
      description: `Unstaking ${unstakeAmount} $MEME tokens (7-day cooldown)`,
    });
    setUnstakeAmount('');
  };

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h2 className="text-4xl font-bold text-white mb-4">Stake & Earn</h2>
        <p className="text-xl text-gray-300">
          Stake your $MEME tokens to earn rewards and participate in DAO governance
        </p>
      </div>

      {/* Staking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">24.5%</p>
            <p className="text-sm text-gray-300">Current APY</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1,250</p>
            <p className="text-sm text-gray-300">Your Staked $MEME</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">42.8</p>
            <p className="text-sm text-gray-300">Pending Rewards</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stake Card */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Plus className="mr-2 h-5 w-5 text-green-400" />
              Stake Tokens
            </CardTitle>
            <CardDescription className="text-gray-300">
              Stake your $MEME tokens to earn rewards and voting power
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Amount to Stake</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                <Button
                  variant="outline"
                  onClick={() => setStakeAmount('1000')}
                  className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
                >
                  MAX
                </Button>
              </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Estimated Annual Rewards:</span>
                <span className="text-green-400">{stakeAmount ? (parseFloat(stakeAmount) * 0.245).toFixed(2) : '0'} $MEME</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-300">Voting Power:</span>
                <span className="text-purple-400">{stakeAmount || '0'} votes</span>
              </div>
            </div>
            
            <Button
              onClick={handleStake}
              disabled={!stakeAmount || !isConnected}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Stake Tokens
            </Button>
          </CardContent>
        </Card>

        {/* Unstake Card */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Minus className="mr-2 h-5 w-5 text-orange-400" />
              Unstake Tokens
            </CardTitle>
            <CardDescription className="text-gray-300">
              Unstake your tokens (7-day cooldown period applies)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Amount to Unstake</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                <Button
                  variant="outline"
                  onClick={() => setUnstakeAmount('1250')}
                  className="border-orange-500 text-orange-300 hover:bg-orange-500/20"
                >
                  MAX
                </Button>
              </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg">
              <Badge className="bg-orange-600/20 text-orange-300 border-orange-500/50 mb-2">
                ⏰ 7-day cooldown period
              </Badge>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Available after:</span>
                <span className="text-orange-400">March 20, 2025</span>
              </div>
            </div>
            
            <Button
              onClick={handleUnstake}
              disabled={!unstakeAmount || !isConnected}
              variant="outline"
              className="w-full border-orange-500 text-orange-300 hover:bg-orange-500/20"
            >
              <Minus className="mr-2 h-4 w-4" />
              Unstake Tokens
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Claim Rewards */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/50 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
              Pending Rewards
            </span>
            <Badge className="bg-green-600/20 text-green-300 border-green-500/50">
              Ready to Claim
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-white">42.8 $MEME</p>
            <p className="text-gray-300">≈ $128.40 USD</p>
          </div>
          <Button
            disabled={!isConnected}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            Claim Rewards
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
