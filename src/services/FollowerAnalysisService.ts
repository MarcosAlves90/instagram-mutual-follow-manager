import { AnalysisResult, Follower, FollowerStatus, SelectionMap } from '@/types/follower';
import { parseInstagramHTML, compareFollowers } from '@/utils/parseFollowers';

export interface FollowerParser {
  parse(htmlContent: string): Follower[];
}

export interface FollowerComparer {
  compare(
    followers: Follower[],
    following: Follower[]
  ): {
    followingButNotFollowingBack: string[];
    followersNotFollowingBack: string[];
  };
}

export interface FollowerAnalysisService {
  analyze(
    followersHtml: string,
    followingHtml: string,
    selections: SelectionMap
  ): AnalysisResult;
}

class InstagramFollowerParser implements FollowerParser {
  parse(htmlContent: string): Follower[] {
    return parseInstagramHTML(htmlContent);
  }
}

class DefaultFollowerComparer implements FollowerComparer {
  compare(followers: Follower[], following: Follower[]) {
    return compareFollowers(followers, following);
  }
}

export class DefaultFollowerAnalysisService implements FollowerAnalysisService {
  constructor(
    private readonly parser: FollowerParser,
    private readonly comparer: FollowerComparer
  ) {}

  analyze(
    followersHtml: string,
    followingHtml: string,
    selections: SelectionMap
  ): AnalysisResult {
    const followers = this.parser.parse(followersHtml);
    const following = this.parser.parse(followingHtml);

    const comparison = this.comparer.compare(followers, following);

    const followingButNotBack = this.applySelections(
      following.filter((f) => comparison.followingButNotFollowingBack.includes(f.username)),
      selections
    );

    const followersNotBack = this.applySelections(
      followers.filter((f) => comparison.followersNotFollowingBack.includes(f.username)),
      selections
    );

    return {
      followingButNotFollowingBack: followingButNotBack,
      followersNotFollowingBack: followersNotBack,
    };
  }

  private applySelections(users: Follower[], selections: SelectionMap): FollowerStatus[] {
    return users.map((user) => ({
      ...user,
      status: selections[user.username] ?? 'neutral',
    }));
  }
}

export const createDefaultFollowerAnalysisService = () =>
  new DefaultFollowerAnalysisService(
    new InstagramFollowerParser(),
    new DefaultFollowerComparer()
  );
