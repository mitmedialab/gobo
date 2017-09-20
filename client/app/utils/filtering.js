
function get_nums_males_females(f, m ,r){
    if (m == 0) {
        if (f == 0){
            // m = 0, f = 0
            return {'f': 0, 'm': 0}
        }
        else {
            //m = 0 f > 0
            return {'f': r*f, 'm':0}
        }
    }
    else if (f == 0) {
        return {'f': 0, 'm':m*r}
    }
    else if (m >= f) {
        if (r==0) {
            return {'f': 0, 'm': m}
        }
        else if (r < f/m) {
            return {'f': Math.min((r/(1-r) * m), f), 'm':m}
        }
        else {
            return {'f': f, 'm':Math.min(((1-r)/r * f), m)}
        }
    }
    else {
        // m < f
        if (r==1) {
            return {'f': f, 'm': 0}
        }
        else if (r < m/f) {
            return {'f': f, 'm':Math.min(((1-r)/r * f), m)}
        }
        return {'f': Math.min((r/(1-r) * m), f), 'm':m}
    }
}

export function calculateFilteredPosts(posts, settings) {
    return new Promise((resolve)=> {
        var filtered_posts = []
        var kept_posts = []
        const filter_reasons = {}
        const virality_scores = posts.map(post => Math.log(post.virality_count + 1))
        const max_virality = virality_scores.reduce(function (a, b) {
            return Math.max(a, b);
        }, 0);

        posts.forEach(post => {
            var keep = true;
            filter_reasons[post.id] = [];
            if (post.is_corporate && !settings.include_corporate) {
                keep = false;
                filter_reasons[post.id].push('Corporate')
            }

            if ((post.toxicity != null && post.toxicity != -1 && (post.toxicity > settings.rudeness_max || post.toxicity < settings.rudeness_min)) ||
                (post.toxicity==-1 && settings.rudeness_min>0.1)) {
                keep = false;
                filter_reasons[post.id].push('Rudeness')
            }
            if ((settings.seriousness_max<0.98 || settings.seriousness_min>0.02) && (!post.news_score || post.news_score > settings.seriousness_max || post.news_score < settings.seriousness_min))  {
                keep = false;
                filter_reasons[post.id].push('Seriousness')
            }
            const virality_score = Math.log(post.virality_count + 1) / max_virality;
            if (virality_score > settings.virality_max || virality_score < settings.virality_min) {
                keep = false;
                filter_reasons[post.id].push('Virality')
            }
            if (post.is_news && (
                post.political_quintile>(settings.political_affiliation+settings.echo_range) ||
                post.political_quintile<(settings.political_affiliation-settings.echo_range))) {
                keep = false;
                filter_reasons[post.id].push('News Echo')
            }
            if (keep) {
                kept_posts.push(post)
            }
            else {
                filtered_posts.push(post)
            }
        })
        const kept_female_posts = kept_posts.filter(post => post.gender == 'GenderEnum.female');
        const kept_male_posts = kept_posts.filter(post => post.gender == 'GenderEnum.male');
        const num_posts_to_keep = get_nums_males_females(kept_female_posts.length, kept_male_posts.length, settings.gender_female_per / 100.0)
        const neutral_fb = Math.min(1, kept_female_posts.length / (kept_female_posts.length + kept_male_posts.length ))
        // remove female posts
        if (num_posts_to_keep['f'] < kept_female_posts.length) {
            //remove kept_female_posts.length - num_posts_to_keep['f'] from kept to filtered
            const f_posts_to_remove = kept_female_posts.slice(0, kept_female_posts.length - num_posts_to_keep['f']);
            kept_posts = kept_posts.filter(function (post) {
                if (f_posts_to_remove.indexOf(post) === -1) {
                    return true
                }
                else {
                    filter_reasons[post.id].push('Gender')
                }
            });
            filtered_posts.push(...f_posts_to_remove)
        }
        // remove male posts
        if (num_posts_to_keep['m'] < kept_male_posts.length) {
            //remove kept_male_posts.length - num_posts_to_keep['m'] from kept to filtered
            const m_posts_to_remove = kept_male_posts.slice(0, kept_male_posts.length - num_posts_to_keep['m']);
            kept_posts = kept_posts.filter(function (post) {
                if (m_posts_to_remove.indexOf(post) === -1) {
                    return true
                }
                else {
                    filter_reasons[post.id].push('Gender')
                }
            });
            filtered_posts.push(...m_posts_to_remove)
        }
        resolve({kept: kept_posts, filtered: filtered_posts, fb: neutral_fb, reasons: filter_reasons})

    })
}