import { Follower } from '@/types/follower';

export const parseInstagramHTML = (htmlContent: string): Follower[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const followers: Follower[] = [];
  const cards = doc.querySelectorAll('div.pam');
  
  cards.forEach((card) => {
    const h2 = card.querySelector('h2');
    const link = card.querySelector('a[href*="instagram.com"]');
    const contentDiv = card.querySelector('div._a6-p');
    
    if (!h2 || !link) return;
    
    const username = h2.textContent?.trim();
    const href = link.getAttribute('href');
    
    // Extrair a data do segundo div dentro do div._a6-p
    let date: string | undefined;
    if (contentDiv) {
      const innerDivs = contentDiv.querySelectorAll('div > div');
      if (innerDivs.length >= 2) {
        date = innerDivs[1].textContent?.trim();
      }
    }
    
    if (username && href) {
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
  followingButNotFollowingBack: Follower[];
  followersNotFollowingBack: Follower[];
} => {
  const followerUsernames = new Set(followers.map((f) => f.username));
  const followingUsernames = new Set(following.map((f) => f.username));
  
  const followingButNotFollowingBack = following
    .filter((f) => !followerUsernames.has(f.username));
    
  const followersNotFollowingBack = followers
    .filter((f) => !followingUsernames.has(f.username));
  
  return {
    followingButNotFollowingBack,
    followersNotFollowingBack,
  };
};
