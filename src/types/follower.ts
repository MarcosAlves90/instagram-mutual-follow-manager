export interface Follower {
  username: string;
  profileUrl: string;
  date?: string;
}

export interface FollowerStatus {
  username: string;
  profileUrl: string;
  status: 'neutral' | 'remove' | 'keep';
}

export interface AnalysisResult {
  followingButNotFollowingBack: FollowerStatus[];
  followersNotFollowingBack: FollowerStatus[];
}
