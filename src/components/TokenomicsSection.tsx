
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Lock, Users, Zap, Shield } from 'lucide-react';

const tokenomicsData = [
  { name: 'DAO Treasury', value: 30, color: '#8B5CF6' },
  { name: 'Community Rewards', value: 25, color: '#06B6D4' },
  { name: 'Team & Advisors', value: 15, color: '#10B981' },
  { name: 'Liquidity', value: 15, color: '#F59E0B' },
  { name: 'Marketing & Growth', value: 10, color: '#EF4444' },
  { name: 'Reserve', value: 5, color: '#6B7280' },
];

const utilityData = [
  { name: 'Governance Voting', value: 100, icon: '🗳️' },
  { name: 'Priority Access', value: 85, icon: '🚀' },
  { name: 'Staking Rewards', value: 95, icon: '💰' },
  { name: 'Profit Sharing', value: 90, icon: '📈' },
];

export const TokenomicsSection = () => {
  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h2 className="text-4xl font-bold text-white mb-4">$MEME Tokenomics</h2>
        <p className="text-xl text-gray-300">
          Transparent distribution and utility-driven economics
        </p>
      </div>

      {/* Token Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <Coins className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1B</p>
            <p className="text-sm text-gray-300">Total Supply</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">$0.003</p>
            <p className="text-sm text-gray-300">Current Price</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <Lock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">65%</p>
            <p className="text-sm text-gray-300">Tokens Locked</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">2,847</p>
            <p className="text-sm text-gray-300">Holders</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Token Distribution */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white">Token Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tokenomicsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tokenomicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {tokenomicsData.map((item, index) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-300">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Token Utility */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white">Token Utility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {utilityData.map((utility, index) => (
              <div key={utility.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 flex items-center">
                    <span className="mr-2">{utility.icon}</span>
                    {utility.name}
                  </span>
                  <span className="text-white font-semibold">{utility.value}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${utility.value}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'DAO Treasury (30%)',
            description: 'Project funding and ecosystem development',
            amount: '300M $MEME',
            icon: Shield,
            color: 'from-purple-500 to-blue-500'
          },
          {
            title: 'Community Rewards (25%)',
            description: 'Staking, voting, and airdrop rewards',
            amount: '250M $MEME',
            icon: Users,
            color: 'from-blue-500 to-cyan-500'
          },
          {
            title: 'Team & Advisors (15%)',
            description: 'Locked with 12-month vesting schedule',
            amount: '150M $MEME',
            icon: Lock,
            color: 'from-green-500 to-emerald-500'
          },
          {
            title: 'Liquidity (15%)',
            description: 'Exchange listings and market making',
            amount: '150M $MEME',
            icon: TrendingUp,
            color: 'from-yellow-500 to-orange-500'
          },
          {
            title: 'Marketing & Growth (10%)',
            description: 'Partnerships, KOLs, and campaigns',
            amount: '100M $MEME',
            icon: Zap,
            color: 'from-red-500 to-pink-500'
          },
          {
            title: 'Reserve (5%)',
            description: 'Emergency fund and long-term stability',
            amount: '50M $MEME',
            icon: Shield,
            color: 'from-gray-500 to-slate-500'
          }
        ].map((item, index) => (
          <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-lg">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mb-4`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{item.description}</p>
              <Badge className="bg-white/10 text-white border-white/20">
                {item.amount}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vesting Schedule */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/50 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white">Vesting Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Team & Advisors</h4>
              <p className="text-gray-300">12-month cliff, 36-month linear vesting</p>
              <Badge className="mt-2 bg-blue-600/20 text-blue-300 border-blue-500/50">
                Locked until Q3 2026
              </Badge>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Marketing & Growth</h4>
              <p className="text-gray-300">6-month cliff, 24-month linear vesting</p>
              <Badge className="mt-2 bg-green-600/20 text-green-300 border-green-500/50">
                Locked until Q1 2026
              </Badge>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Reserve Fund</h4>
              <p className="text-gray-300">Multisig wallet, DAO governance required</p>
              <Badge className="mt-2 bg-purple-600/20 text-purple-300 border-purple-500/50">
                DAO Controlled
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
