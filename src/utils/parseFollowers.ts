import { Follower } from '@/types/follower';

export const parseInstagramHTML = (htmlContent: string): Follower[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const followers: Follower[] = [];
  const links = doc.querySelectorAll('a[href*="instagram.com"]');
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    const username = link.textContent?.trim();
    
    if (href && username && href.includes('instagram.com')) {
      // Find the date in the next div sibling
      const parent = link.closest('div');
      const dateDiv = parent?.querySelector('div:last-child');
      const date = dateDiv?.textContent?.trim();
      
      followers.push({
        username,
        profileUrl: href,
        date,
      });
    }
  });
  
  return followers;
};

export const compareFollowers = (
  followers: Follower[],
  following: Follower[]
): {
  followingButNotFollowingBack: string[];
  followersNotFollowingBack: string[];
} => {
  const followerUsernames = new Set(followers.map((f) => f.username));
  const followingUsernames = new Set(following.map((f) => f.username));
  
  const followingButNotFollowingBack = following
    .filter((f) => !followerUsernames.has(f.username))
    .map((f) => f.username);
    
  const followersNotFollowingBack = followers
    .filter((f) => !followingUsernames.has(f.username))
    .map((f) => f.username);
  
  return {
    followingButNotFollowingBack,
    followersNotFollowingBack,
  };
};
