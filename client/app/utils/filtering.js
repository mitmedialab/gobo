/* eslint camelcase: 0, no-mixed-operators: 0, no-param-reassign: 0, no-return-assign: 0 */

function get_nums_males_females(f, m, r) {
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

function filterPostByKeyword(post, settings) {
  let filtered = false;
  if (settings.keywords && settings.keywords.length > 0) {
    const fullText = post.content.full_text.toLowerCase();
    settings.keywords.forEach((keyword) => {
      if (fullText.indexOf(keyword.toLowerCase()) > -1) {
        filtered = true;
      }
    });
  }
  return {
    filtered,
    reason: 'Keyword',
  };
}

function filterPostByCorporate(post, settings) {
  return {
    filtered: post.is_corporate && !settings.include_corporate,
    reason: 'Corporate',
  };
}

export function getFilteredPosts(posts, settings) {
  const filtered_posts = [];
  let kept_posts = [];
  const filter_reasons = {};
  const virality_scores = posts.map(post => Math.log(post.virality_count + 1));
  const max_virality = virality_scores.reduce((a, b) => Math.max(a, b), 0);
  const sum = virality_scores.reduce((previous, current) => current += previous);
  const virality_avg = sum / virality_scores.length;

  // TODO: continue refactoring filters to this pattern
  const filters = [filterPostByCorporate, filterPostByKeyword];

  posts.forEach((post) => {
    let keep = true;
    filter_reasons[post.id] = [];

    filters.forEach((filter) => {
      const { filtered, reason } = filter(post, settings);
      if (filtered) {
        keep = false;
        filter_reasons[post.id].push(reason);
      }
    });

    if ((post.toxicity !== null && post.toxicity !== -1 && (post.toxicity > settings.rudeness_max || post.toxicity < settings.rudeness_min)) ||
              (post.toxicity === -1 && settings.rudeness_min > 0.1)) {
      keep = false;
      filter_reasons[post.id].push('Rudeness');
    }
    if ((settings.seriousness_max < 0.98 || settings.seriousness_min > 0.02) && (!post.news_score || post.news_score > settings.seriousness_max || post.news_score < settings.seriousness_min)) {
      keep = false;
      filter_reasons[post.id].push('Seriousness');
    }
    const virality_score = Math.log(post.virality_count + 1) / max_virality;
    if (virality_score > settings.virality_max || virality_score < settings.virality_min) {
      keep = false;
      filter_reasons[post.id].push('Virality');
    }
    if (post.is_news && (
              post.political_quintile > (settings.political_affiliation + settings.echo_range) ||
              post.political_quintile < (settings.political_affiliation - settings.echo_range))) {
      keep = false;
      filter_reasons[post.id].push('News Echo');
    }
    if (keep) {
      kept_posts.push(post);
    } else {
      filtered_posts.push(post);
    }
  });
  const kept_female_posts = kept_posts.filter(post => post.gender === 'GenderEnum.female');
  const kept_male_posts = kept_posts.filter(post => post.gender === 'GenderEnum.male');
  const num_posts_to_keep = get_nums_males_females(kept_female_posts.length, kept_male_posts.length, settings.gender_female_per / 100.0);
  const neutral_fb = Math.min(1, kept_female_posts.length / (kept_female_posts.length + kept_male_posts.length));
      // remove female posts
  if (num_posts_to_keep.f < kept_female_posts.length) {
          // remove kept_female_posts.length - num_posts_to_keep['f'] from kept to filtered
    const f_posts_to_remove = kept_female_posts.slice(0, kept_female_posts.length - num_posts_to_keep.f);
    kept_posts = kept_posts.filter((post) => {
      if (f_posts_to_remove.indexOf(post) === -1) {
        return true;
      }
      filter_reasons[post.id].push('Gender');
      return false;
    });
    filtered_posts.push(...f_posts_to_remove);
  }
      // remove male posts
  if (num_posts_to_keep.m < kept_male_posts.length) {
          // remove kept_male_posts.length - num_posts_to_keep['m'] from kept to filtered
    const m_posts_to_remove = kept_male_posts.slice(0, kept_male_posts.length - num_posts_to_keep.m);
    kept_posts = kept_posts.filter((post) => {
      if (m_posts_to_remove.indexOf(post) === -1) {
        return true;
      }
      filter_reasons[post.id].push('Gender');
      return false;
    });
    filtered_posts.push(...m_posts_to_remove);
  }
  return {
    kept_posts,
    filtered_posts,
    neutral_fb,
    filter_reasons,
    max_virality,
    virality_avg,
  };
}

export default function calculateFilteredPosts(posts, settings) {
  return new Promise((resolve) => {
    const { kept_posts, filtered_posts, neutral_fb, filter_reasons, max_virality, virality_avg } = getFilteredPosts(posts, settings);
    resolve({ kept: kept_posts,
      filtered: filtered_posts,
      fb: neutral_fb,
      reasons: filter_reasons,
      virality_max: max_virality,
      virality_avg });
  });
}
