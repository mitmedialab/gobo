/* eslint no-mixed-operators: 0, no-param-reassign: 0, no-return-assign: 0 */

function getGenderCounts(f, m, r) {
  if (m === 0) {
    if (f === 0) {
            // m = 0, f = 0
      return { f: 0, m: 0 };
    }

            // m = 0 f > 0
    return { f: r * f, m: 0 };
  } else if (f === 0) {
    return { f: 0, m: m * r };
  } else if (m >= f) {
    if (r === 0) {
      return { f: 0, m };
    } else if (r < f / m) {
      return { f: Math.min((r / (1 - r) * m), f), m };
    }

    return { f, m: Math.min(((1 - r) / r * f), m) };
  }

        // m < f
  if (r === 1) {
    return { f, m: 0 };
  } else if (r < m / f) {
    return { f, m: Math.min(((1 - r) / r * f), m) };
  }
  return { f: Math.min((r / (1 - r) * m), f), m };
}

function getFullText(post) {
  const content = post.content;
  let fullText = '';
  if (content.full_text) {
    fullText = content.full_text;
  } else if (content.message) {
    fullText = content.message;
    if (content.name) {
      fullText += content.name;
    }
  } else if (content.content) {
    fullText = content.content;
  }
  return fullText.toLowerCase();
}

/**
 * Post is filtered if all keywords are found.
 */
function filterPostByKeywordAnd(post, settings) {
  let filtered = false;
  let keywords = settings.keywordsAnd;
  if (keywords && keywords.length > 0) {
    const fullText = getFullText(post);
    keywords = keywords.map(keyword => keyword.toLowerCase());
    const foundKeyword = {};
    keywords.forEach((keyword) => {
      foundKeyword[keyword] = false;
    });
    keywords.forEach((keyword) => {
      if (fullText.indexOf(keyword) > -1) {
        foundKeyword[keyword] = true;
      }
    });
    filtered = keywords.reduce((accumulator, keyword) => foundKeyword[keyword] && accumulator, true);
  }
  return {
    filtered,
    reason: 'Keyword',
  };
}

/**
 * Post is filtered if any word is included.
 */
export function filterPostByKeywordOr(post, keywords) {
  let filtered = false;
  if (keywords && keywords.length > 0) {
    const fullText = getFullText(post);
    keywords.forEach((keyword) => {
      if (fullText.indexOf(keyword.toLowerCase()) > -1) {
        filtered = true;
      }
    });
  }
  return filtered;
}

function filterPostKeywordOrBySettings(post, settings) {
  return {
    filtered: filterPostByKeywordOr(post, settings.keywordsOr),
    reason: 'Keyword',
  };
}

function filterPostByCorporate(post, settings) {
  return {
    filtered: post.is_corporate && !settings.include_corporate,
    reason: 'Corporate',
  };
}

export function getFilteredPosts(posts, settings, rules) {
  const filteredPosts = [];
  let keptPosts = [];
  const filterReasons = {};
  const viralityScores = posts.map(post => Math.log(post.virality_count + 1));
  const maxVirality = viralityScores.reduce((a, b) => Math.max(a, b), 0);
  const sum = viralityScores.reduce((previous, current) => current += previous);
  const viralityAvg = sum / viralityScores.length;

  // TODO: continue refactoring filters to this pattern
  const filters = [filterPostByCorporate, filterPostKeywordOrBySettings, filterPostByKeywordAnd];

  posts.forEach((post) => {
    let keep = true;
    filterReasons[post.id] = [];

    filters.forEach((filter) => {
      const { filtered, reason } = filter(post, settings);
      if (filtered) {
        keep = false;
        filterReasons[post.id].push(reason);
      }
    });

    rules.forEach((rule) => {
      if (rule.enabled) {
        const filtered = filterPostByKeywordOr(post, rule.exclude_terms);
        if (filtered) {
          keep = false;
          filterReasons[post.id].push('Rule');
        }
      }
    });

    if ((post.toxicity !== null && post.toxicity !== -1 && (post.toxicity > settings.rudeness_max || post.toxicity < settings.rudeness_min)) ||
              (post.toxicity === -1 && settings.rudeness_min > 0.1)) {
      keep = false;
      filterReasons[post.id].push('Rudeness');
    }
    if ((settings.seriousness_max < 0.98 || settings.seriousness_min > 0.02) && (!post.news_score || post.news_score > settings.seriousness_max || post.news_score < settings.seriousness_min)) {
      keep = false;
      filterReasons[post.id].push('Seriousness');
    }
    const viralityScore = Math.log(post.virality_count + 1) / maxVirality;
    if (viralityScore > settings.virality_max || viralityScore < settings.virality_min) {
      keep = false;
      filterReasons[post.id].push('Virality');
    }
    if (post.is_news && (
              post.political_quintile > (settings.political_affiliation + settings.echo_range) ||
              post.political_quintile < (settings.political_affiliation - settings.echo_range))) {
      keep = false;
      filterReasons[post.id].push('News Echo');
    }
    if (keep) {
      keptPosts.push(post);
    } else {
      filteredPosts.push(post);
    }
  });
  const keptFemalePosts = keptPosts.filter(post => post.gender === 'GenderEnum.female');
  const keptMalePosts = keptPosts.filter(post => post.gender === 'GenderEnum.male');
  const numPostsToKeep = getGenderCounts(keptFemalePosts.length, keptMalePosts.length, settings.gender_female_per / 100.0);
  const neutralFb = Math.min(1, keptFemalePosts.length / (keptFemalePosts.length + keptMalePosts.length));

  ['f', 'm'].forEach((gender) => {
    const keptPostsGender = gender === 'f' ? keptFemalePosts : keptMalePosts;
    if (numPostsToKeep[gender] < keptPostsGender.length) {
      const postsToRemove = keptPostsGender.slice(0, keptPostsGender.length - numPostsToKeep[gender]);
      keptPosts = keptPosts.filter((post) => {
        if (postsToRemove.indexOf(post) === -1) {
          return true;
        }
        filterReasons[post.id].push('Gender');
        return false;
      });
      filteredPosts.push(...postsToRemove);
    }
  });
  return {
    keptPosts,
    filteredPosts,
    neutralFb,
    filterReasons,
    maxVirality,
    viralityAvg,
  };
}

export default function calculateFilteredPosts(posts, settings, rules) {
  return new Promise((resolve) => {
    const { keptPosts, filteredPosts, neutralFb, filterReasons, maxVirality, viralityAvg } = getFilteredPosts(posts, settings, rules);
    resolve({
      kept: keptPosts,
      filtered: filteredPosts,
      fb: neutralFb,
      reasons: filterReasons,
      virality_max: maxVirality,
      virality_avg: viralityAvg,
    });
  });
}
