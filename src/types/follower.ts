export type SelectionStatus = 'neutral' | 'remove' | 'keep';

export type SelectionMap = Record<string, SelectionStatus>;

export interface Follower {
  username: string;
  profileUrl: string;
  date?: string;
}

export interface FollowerStatus {
  username: string;
  profileUrl: string;
  date?: string;
  status: SelectionStatus;
}

export interface AnalysisResult {
  followingButNotFollowingBack: FollowerStatus[];
  followersNotFollowingBack: FollowerStatus[];
}
