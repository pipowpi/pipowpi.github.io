import posts from '../generated/posts.json';
import upcoming from '../generated/upcoming.json';

// The posts in this build. The live site leaves out drafts; preview builds include them
// (scripts/build.mjs). `upcoming` lists the drafts that were left out.
export const POSTS = posts;
export const UPCOMING = upcoming;

// A link elsewhere on the site that points at a post not in this build (a draft on the live site)
// is dropped instead of leading to a 404.
const LIVE = new Set(posts.map((p) => `writing/${p.slug}/`));
export const isLive = (to) => !/^writing\/[^/]+\/$/.test(to) || LIVE.has(to);
