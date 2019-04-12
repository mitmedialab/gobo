/* eslint no-mixed-operators: 0, no-param-reassign: 0, no-return-assign: 0 */
export function getFilterReasonIcon(reasonType) {
  const reasons = {
    corporate: 'icon-corporate',
    keyword: 'icon-keyword-rule',  // TODO: this needs a real logo
    rudeness: 'icon-toxicity',
    seriousness: 'icon-seriousness',
    virality: 'icon-virality',
    additive: 'icon-additive',
    gender: 'icon-gender',
  };
  return reasons[reasonType];
}

const REASONS = {
  virality: {
    label: 'Virality',
    type: 'virality',
    icon: getFilterReasonIcon('virality'),
  },
  newsEcho: {
    label: 'News Echo',
    type: 'newsEcho',
    icon: getFilterReasonIcon('additive'),
  },
  rudeness: {
    label: 'Rudeness',
    type: 'rudeness',
    icon: getFilterReasonIcon('rudeness'),
  },
  seriousness: {
    label: 'Seriousness',
    type: 'seriousness',
    icon: getFilterReasonIcon('seriousness'),
  },
  gender: {
    label: 'Gender',
    type: 'gender',
    icon: getFilterReasonIcon('gender'),
  },
  corporate: {
    label: 'Corporate',
    type: 'corporate',
    icon: getFilterReasonIcon('corporate'),
  },
};

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
    if (content.description) {
      fullText += content.description;
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
    reason: {
      label: 'Keyword',
      type: 'keyword',
      icon: getFilterReasonIcon('keyword'),
    },
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
    reason: {
      label: 'Keyword',
      type: 'keyword',
      icon: getFilterReasonIcon('keyword'),
    },
  };
}

function filterPostByCorporate(post, settings) {
  return {
    filtered: post.is_corporate && !settings.include_corporate,
    reason: REASONS.corporate,
  };
}

/**
 * Filter post by level
 */
export function filterPostByRuleLevel(post, rule) {
  let filtered = false;

  if (post.rules) {
    const postRule = post.rules.find(r => r.id === rule.id);
    if (postRule) {
      if (rule.enabled) {
         // TODO: this may need to change to be cumulative (e.g. this level or less)
        filtered = postRule.level !== rule.level;
      } else {
         // posts will hidden if the rule is disabled
        filtered = true;
      }
    }
  }
  return filtered;
}

export function getFilteredPosts(posts, settings, rules, showPlatform) {
  const filteredPosts = [];
  let keptPosts = [];
  const inFeedPosts = [];
  const filterReasons = {};
  const viralityScores = posts.map(post => Math.log(post.virality_count + 1));
  const maxVirality = viralityScores.reduce((a, b) => Math.max(a, b), 0);
  const sum = viralityScores.reduce((previous, current) => current += previous);
  const viralityAvg = sum / viralityScores.length;

  // TODO: continue refactoring filters to this pattern
  const filters = [filterPostByCorporate, filterPostKeywordOrBySettings, filterPostByKeywordAnd];

  let platformPosts = [...posts];
  if (showPlatform !== 'all') {
    platformPosts = platformPosts.filter(post => post.source === showPlatform);
  }

  platformPosts.forEach((post) => {
    let inFeed = true;
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
      if (rule.type === 'keyword') {
        if (rule.enabled) {
          const filtered = filterPostByKeywordOr(post, rule.exclude_terms);
          if (filtered) {
            keep = false;
            filterReasons[post.id].push({
              label: rule.title,
              type: 'keyword',
              icon: getFilterReasonIcon('keyword'),
            });
          }
        }
      } else if (rule.type === 'additive') {
        const filtered = filterPostByRuleLevel(post, rule);
        if (filtered) {
          keep = false;
          inFeed = false;
          filterReasons[post.id].push({
            label: rule.title,
            type: 'additive',
            icon: getFilterReasonIcon('additive'),
          });
        }
      }
    });

    if ((post.toxicity !== null && post.toxicity !== -1 && (post.toxicity > settings.rudeness_max || post.toxicity < settings.rudeness_min)) ||
              (post.toxicity === -1 && settings.rudeness_min > 0.1)) {
      keep = false;
      filterReasons[post.id].push(REASONS.rudeness);
    }
    if ((settings.seriousness_max < 0.98 || settings.seriousness_min > 0.02) && (!post.news_score || post.news_score > settings.seriousness_max || post.news_score < settings.seriousness_min)) {
      keep = false;
      filterReasons[post.id].push(REASONS.seriousness);
    }
    const viralityScore = Math.log(post.virality_count + 1) / maxVirality;
    if (viralityScore > settings.virality_max || viralityScore < settings.virality_min) {
      keep = false;
      filterReasons[post.id].push(REASONS.virality);
    }
    if (post.is_news && (
              post.political_quintile > (settings.political_affiliation + settings.echo_range) ||
              post.political_quintile < (settings.political_affiliation - settings.echo_range))) {
      keep = false;
      inFeed = false;
      filterReasons[post.id].push(REASONS.newsEcho);
    }
    if (inFeed) {
      inFeedPosts.push(post);
      if (keep) {
        keptPosts.push(post);
      } else {
        filteredPosts.push(post);
      }
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
        filterReasons[post.id].push(REASONS.gender);
        return false;
      });
      filteredPosts.push(...postsToRemove);
    }
  });
  return {
    inFeedPosts,
    filteredPosts,
    neutralFb,
    filterReasons,
    maxVirality,
    viralityAvg,
  };
}

export default function calculateFilteredPosts(posts, settings, rules, showPlatform) {
  const { inFeedPosts, filteredPosts, neutralFb, filterReasons, maxVirality, viralityAvg } = getFilteredPosts(posts, settings, rules, showPlatform);
  return {
    inFeedPosts,
    filtered: filteredPosts,
    fb: neutralFb,
    reasons: filterReasons,
    virality_max: maxVirality,
    virality_avg: viralityAvg,
  };
}
