import { Follower } from '@/types/follower';

export const parseInstagramHTML = (htmlContent: string): Follower[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const followers: Follower[] = [];
  const links = doc.querySelectorAll('a[href*="instagram.com"]');
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    let username = link.textContent?.trim();
    
    if (href && username && href.includes('instagram.com')) {
      // Se o username for uma URL, extrair do elemento anterior (h2)
      if (username.includes('http') || username.includes('instagram.com')) {
        const parentDiv = link.closest('div.pam');
        const h2 = parentDiv?.querySelector('h2');
        if (h2) {
          username = h2.textContent?.trim() || username;
        } else {
          // Tentar extrair da URL
          const urlMatch = href.match(/instagram\.com\/(?:_u\/)?([^/]+)/);
          username = urlMatch ? urlMatch[1] : username;
        }
      }
      
      // Find the date from Instagram export structure
      const container = link.closest('div._a6-p') || link.closest('div.pam') || link.closest('div');
      let date: string | undefined;
      if (container) {
        const innerDivs = Array.from(container.querySelectorAll('div'));
        const candidate = innerDivs.at(-1)?.textContent?.trim();
        if (candidate && candidate.length > 0) {
          date = candidate;
        }
      }
      
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
