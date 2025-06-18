
import { useState } from 'react';
import { Wallet, Vote, TrendingUp, Users, Zap, Shield, Star, Rocket, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WalletConnect } from '@/components/WalletConnect';
import { StakingSection } from '@/components/StakingSection';
import { VotingSection } from '@/components/VotingSection';
import { TokenomicsSection } from '@/components/TokenomicsSection';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const roadmapPhases = [
    {
      phase: 'Phase 1',
      period: 'Q3 2025',
      status: 'current',
      title: 'Foundation & Launch',
      items: [
        'Project branding, community formation',
        'MVP platform + website launch',
        'Token launch and liquidity pool creation'
      ]
    },
    {
      phase: 'Phase 2',
      period: 'Q4 2025',
      status: 'upcoming',
      title: 'DAO Implementation',
      items: [
        'DAO voting system implementation',
        'First meme project launch',
        'Marketing push and influencer partnerships'
      ]
    },
    {
      phase: 'Phase 3',
      period: 'Q1 2026',
      status: 'future',
      title: 'Scale & Governance',
      items: [
        'Staking and rewards system',
        'Launchpad scalability + multi-chain support',
        'Community governance upgrades'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-lg bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">MemeTokenDAO</span>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              {['Overview', 'Stake', 'Vote', 'Tokenomics'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item.toLowerCase())}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === item.toLowerCase()
                      ? 'text-purple-300'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
            <WalletConnect isConnected={isConnected} setIsConnected={setIsConnected} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <>
            {/* Hero Section */}
            <section className="text-center py-16">
              <div className="max-w-4xl mx-auto">
                <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-500/50">
                  🚀 Phase 1 - Q3 2025
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  MemeTokenDAO
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                  Empowering communities to discover, vote on, and invest in new meme-based crypto projects
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
                    onClick={() => setActiveTab('stake')}
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Start Staking
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-purple-500 text-purple-300 hover:bg-purple-500/20 px-8 py-3"
                    onClick={() => setActiveTab('vote')}
                  >
                    <Vote className="mr-2 h-5 w-5" />
                    View Proposals
                  </Button>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {[
                { label: 'Total Value Locked', value: '$2.4M', icon: TrendingUp },
                { label: 'Active Voters', value: '1,247', icon: Users },
                { label: 'Projects Funded', value: '8', icon: Star },
                { label: 'Community APY', value: '24.5%', icon: Zap },
              ].map((stat, index) => (
                <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-lg">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-300">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </section>

            {/* Roadmap Section */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Project Roadmap</h2>
                <p className="text-xl text-gray-300">Our journey to revolutionize meme token investments</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {roadmapPhases.map((phase, index) => (
                  <Card key={index} className={`bg-white/10 border-white/20 backdrop-blur-lg relative overflow-hidden ${
                    phase.status === 'current' ? 'ring-2 ring-purple-400' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={`${
                          phase.status === 'current' 
                            ? 'bg-purple-600/30 text-purple-300 border-purple-500/50' 
                            : phase.status === 'upcoming'
                            ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                            : 'bg-gray-600/30 text-gray-300 border-gray-500/50'
                        }`}>
                          {phase.phase}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          {phase.status === 'current' ? (
                            <Clock className="h-4 w-4 text-purple-400" />
                          ) : phase.status === 'upcoming' ? (
                            <Calendar className="h-4 w-4 text-blue-400" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-300">{phase.period}</span>
                        </div>
                      </div>
                      <CardTitle className="text-white text-xl">{phase.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {phase.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              phase.status === 'current' 
                                ? 'bg-purple-400' 
                                : phase.status === 'upcoming'
                                ? 'bg-blue-400'
                                : 'bg-gray-400'
                            }`} />
                            <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    
                    {phase.status === 'current' && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 opacity-20 rounded-bl-full" />
                    )}
                  </Card>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: 'DAO Voting System',
                  description: 'Token holders vote on submitted meme project proposals with transparent governance.',
                  icon: Vote,
                  gradient: 'from-purple-500 to-blue-500'
                },
                {
                  title: 'Meme Launchpad',
                  description: 'Projects approved by the DAO can launch tokens directly on our platform.',
                  icon: Rocket,
                  gradient: 'from-blue-500 to-indigo-500'
                },
                {
                  title: 'Revenue Sharing',
                  description: 'Platform profits are redistributed to DAO participants via staking rewards.',
                  icon: TrendingUp,
                  gradient: 'from-indigo-500 to-purple-500'
                },
                {
                  title: 'Project Vetting',
                  description: 'Smart contract audits and community reports ensure project quality.',
                  icon: Shield,
                  gradient: 'from-green-500 to-blue-500'
                },
                {
                  title: 'Multi-chain Support',
                  description: 'Support for Ethereum, BSC, and Solana networks.',
                  icon: Zap,
                  gradient: 'from-yellow-500 to-orange-500'
                },
                {
                  title: 'Gamified Rankings',
                  description: 'Top contributors earn badges, levels, and exclusive rewards.',
                  icon: Star,
                  gradient: 'from-pink-500 to-purple-500'
                }
              ].map((feature, index) => (
                <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-lg hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </section>
          </>
        )}

        {activeTab === 'stake' && <StakingSection isConnected={isConnected} />}
        {activeTab === 'vote' && <VotingSection isConnected={isConnected} />}
        {activeTab === 'tokenomics' && <TokenomicsSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 MemeTokenDAO. Building the future of community-driven meme investments.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
