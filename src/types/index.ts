export type IProposalMetadata = {
    title: string;
    description: string;
    requestedFunding: string;
    category: string;
    endDate: string;
};

export type IProposal = {
    proposalCID: string;
    metadata: IProposalMetadata;
    votesFor: number;
    votesAgainst: number;
    votersCount: number;
    startTime: number;
    endTime: number;
    status: number;
    proposer: string;
    isVoted?: boolean;
};
