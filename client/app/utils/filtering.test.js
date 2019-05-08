import { getFilteredPosts } from './filtering';

const POSTS = {
  posts: [
    {
      content: {
        contributors: null,
        coordinates: null,
        created_at: 'Tue Jan 22 15:00:00 +0000 2019',
        display_text_range: [
          0,
          164,
        ],
        entities: {
          hashtags: [
            {
              indices: [
                13,
                16,
              ],
              text: 'DC',
            },
            {
              indices: [
                41,
                48,
              ],
              text: 'meetup',
            },
          ],
          symbols: [],
          urls: [
            {
              display_url: 'bit.ly/2VEcnnq',
              expanded_url: 'http://bit.ly/2VEcnnq',
              indices: [
                141,
                164,
              ],
              url: 'https://t.co/xAJyZIhMrz',
            },
          ],
          user_mentions: [
            {
              id: 2578505900,
              id_str: '2578505900',
              indices: [
                82,
                93,
              ],
              name: 'DataKind DC',
              screen_name: 'DataKindDC',
            },
          ],
        },
        favorite_count: 0,
        favorited: false,
        full_text: "If you're in #DC, check out your next DK #meetup happening tomorrow, Jan 23, with @DataKindDC. RSVP to hang out with fellow data do-gooders! https://t.co/xAJyZIhMrz",
        geo: null,
        id: 1087726582431658000,
        id_str: '1087726582431657984',
        in_reply_to_screen_name: null,
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        is_quote_status: false,
        lang: 'en',
        place: null,
        possibly_sensitive: false,
        possibly_sensitive_appealable: false,
        replies_count: 0,
        retweet_count: 0,
        retweeted: false,
        source: '<a href="https://about.twitter.com/products/tweetdeck" rel="nofollow">TweetDeck</a>',
        truncated: false,
        user: {
          contributors_enabled: false,
          created_at: 'Sun Jan 08 20:04:26 +0000 2012',
          default_profile: false,
          default_profile_image: false,
          description: 'Global nonprofit that harnesses the power of data science & AI in the service of humanity. Chapters @DataKindBLR @DataKindSF @DataKindSG @DataKindUK\n@DataKindDC',
          entities: {
            description: {
              urls: [],
            },
            url: {
              urls: [
                {
                  display_url: 'datakind.org',
                  expanded_url: 'http://www.datakind.org',
                  indices: [
                    0,
                    22,
                  ],
                  url: 'http://t.co/eIgzbeR7z2',
                },
              ],
            },
          },
          favourites_count: 7012,
          follow_request_sent: false,
          followers_count: 27351,
          following: true,
          friends_count: 404,
          geo_enabled: true,
          has_extended_profile: false,
          id: 458647237,
          id_str: '458647237',
          is_translation_enabled: false,
          is_translator: false,
          lang: 'en',
          listed_count: 1533,
          location: 'Brooklyn, NY',
          name: 'DataKind',
          notifications: false,
          profile_background_color: 'FF921A',
          profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
          profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
          profile_background_tile: false,
          profile_banner_url: 'https://pbs.twimg.com/profile_banners/458647237/1548101553',
          profile_image_url: 'http://pbs.twimg.com/profile_images/501380312576704512/GD4WifJk_normal.png',
          profile_image_url_https: 'https://pbs.twimg.com/profile_images/501380312576704512/GD4WifJk_normal.png',
          profile_link_color: 'FF921A',
          profile_sidebar_border_color: 'FFFFFF',
          profile_sidebar_fill_color: 'DDEEF6',
          profile_text_color: '333333',
          profile_use_background_image: true,
          protected: false,
          screen_name: 'DataKind',
          statuses_count: 7769,
          time_zone: null,
          translator_type: 'none',
          url: 'http://t.co/eIgzbeR7z2',
          utc_offset: null,
          verified: false,
        },
      },
      created_at: 'Tue, 22 Jan 2019 15:00:00 GMT',
      gender: 'GenderEnum.unknown',
      has_link: true,
      id: 4521474,
      is_corporate: true,
      news_score: 0.0617,
      original_id: '1087726582431657984',
      retrieved_at: 'Tue, 22 Jan 2019 15:00:26 GMT',
      source: 'twitter',
      toxicity: 0.14308399,
      virality_count: 0,
    },
    {
      content: {
        contributors: null,
        coordinates: null,
        created_at: 'Tue Jan 22 14:55:06 +0000 2019',
        display_text_range: [
          0,
          106,
        ],
        entities: {
          hashtags: [],
          media: [
            {
              display_url: 'pic.twitter.com/o5VSfatH4G',
              expanded_url: 'https://twitter.com/pitchfork/status/1087725347595005952/photo/1',
              id: 1087725345397198800,
              id_str: '1087725345397198850',
              indices: [
                107,
                130,
              ],
              media_url: 'http://pbs.twimg.com/media/DxhgcEmW0AIZlsq.jpg',
              media_url_https: 'https://pbs.twimg.com/media/DxhgcEmW0AIZlsq.jpg',
              sizes: {
                large: {
                  h: 395,
                  resize: 'fit',
                  w: 790,
                },
                medium: {
                  h: 395,
                  resize: 'fit',
                  w: 790,
                },
                small: {
                  h: 340,
                  resize: 'fit',
                  w: 680,
                },
                thumb: {
                  h: 150,
                  resize: 'crop',
                  w: 150,
                },
              },
              type: 'photo',
              url: 'https://t.co/o5VSfatH4G',
            },
          ],
          symbols: [],
          urls: [
            {
              display_url: 'p4k.in/lqJcGbV',
              expanded_url: 'http://p4k.in/lqJcGbV',
              indices: [
                83,
                106,
              ],
              url: 'https://t.co/GhOVEW2lMb',
            },
          ],
          user_mentions: [],
        },
        extended_entities: {
          media: [
            {
              display_url: 'pic.twitter.com/o5VSfatH4G',
              expanded_url: 'https://twitter.com/pitchfork/status/1087725347595005952/photo/1',
              id: 1087725345397198800,
              id_str: '1087725345397198850',
              indices: [
                107,
                130,
              ],
              media_url: 'http://pbs.twimg.com/media/DxhgcEmW0AIZlsq.jpg',
              media_url_https: 'https://pbs.twimg.com/media/DxhgcEmW0AIZlsq.jpg',
              sizes: {
                large: {
                  h: 395,
                  resize: 'fit',
                  w: 790,
                },
                medium: {
                  h: 395,
                  resize: 'fit',
                  w: 790,
                },
                small: {
                  h: 340,
                  resize: 'fit',
                  w: 680,
                },
                thumb: {
                  h: 150,
                  resize: 'crop',
                  w: 150,
                },
              },
              type: 'photo',
              url: 'https://t.co/o5VSfatH4G',
            },
          ],
        },
        favorite_count: 52,
        favorited: false,
        full_text: 'ICYMI: Spotify is rolling out a feature that allows users to mute specific artists https://t.co/GhOVEW2lMb https://t.co/o5VSfatH4G',
        geo: null,
        id: 1087725347595006000,
        id_str: '1087725347595005952',
        in_reply_to_screen_name: null,
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        is_quote_status: false,
        lang: 'en',
        place: null,
        possibly_sensitive: false,
        possibly_sensitive_appealable: false,
        replies_count: 0,
        retweet_count: 11,
        retweeted: false,
        source: '<a href="http://www.socialflow.com" rel="nofollow">SocialFlow</a>',
        truncated: false,
        user: {
          contributors_enabled: false,
          created_at: 'Thu Mar 06 15:34:41 +0000 2008',
          default_profile: false,
          default_profile_image: false,
          description: 'The most trusted voice in music.\n\n#MidwinterChicago tickets now on sale.',
          entities: {
            description: {
              urls: [],
            },
            url: {
              urls: [
                {
                  display_url: 'pitchfork.com',
                  expanded_url: 'http://pitchfork.com',
                  indices: [
                    0,
                    23,
                  ],
                  url: 'https://t.co/vn4d8VhqAu',
                },
              ],
            },
          },
          favourites_count: 100,
          follow_request_sent: false,
          followers_count: 3309311,
          following: true,
          friends_count: 3768,
          geo_enabled: true,
          has_extended_profile: false,
          id: 14089195,
          id_str: '14089195',
          is_translation_enabled: true,
          is_translator: false,
          lang: 'en',
          listed_count: 33944,
          location: 'Chicago/NYC',
          name: 'Pitchfork',
          notifications: false,
          profile_background_color: '1F1F1F',
          profile_background_image_url: 'http://abs.twimg.com/images/themes/theme9/bg.gif',
          profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme9/bg.gif',
          profile_background_tile: true,
          profile_banner_url: 'https://pbs.twimg.com/profile_banners/14089195/1546897886',
          profile_image_url: 'http://pbs.twimg.com/profile_images/839758429963104256/UZ90wIZU_normal.jpg',
          profile_image_url_https: 'https://pbs.twimg.com/profile_images/839758429963104256/UZ90wIZU_normal.jpg',
          profile_link_color: 'EF4035',
          profile_sidebar_border_color: 'FFFFFF',
          profile_sidebar_fill_color: '171717',
          profile_text_color: '456E87',
          profile_use_background_image: true,
          protected: false,
          screen_name: 'pitchfork',
          statuses_count: 93383,
          time_zone: null,
          translator_type: 'none',
          url: 'https://t.co/vn4d8VhqAu',
          utc_offset: null,
          verified: true,
        },
      },
      created_at: 'Tue, 22 Jan 2019 14:55:06 GMT',
      gender: 'GenderEnum.unknown',
      has_link: true,
      id: 4521515,
      is_corporate: true,
      news_score: 0.24343,
      original_id: '1087725347595005952',
      retrieved_at: 'Tue, 22 Jan 2019 15:00:34 GMT',
      source: 'twitter',
      toxicity: 0.07091221,
      virality_count: 63,
    },
    {
      content: {
        contributors: null,
        coordinates: null,
        created_at: 'Tue Jan 22 14:54:42 +0000 2019',
        display_text_range: [
          0,
          159,
        ],
        entities: {
          hashtags: [],
          symbols: [],
          urls: [
            {
              display_url: 'hillreporter.com/kavanaugh-like…',
              expanded_url: 'https://hillreporter.com/kavanaugh-likely-to-be-investigated-for-perjury-according-to-house-judiciary-democrat-22007',
              indices: [
                136,
                159,
              ],
              url: 'https://t.co/JWqybqPcV0',
            },
          ],
          user_mentions: [],
        },
        favorite_count: 21,
        favorited: false,
        full_text: 'Both Kavanaugh and Gorsuch appointments should be overturned, along with everything else 45 and his ilk have done during this tragedy.\n\nhttps://t.co/JWqybqPcV0',
        geo: null,
        id: 1087725245836886000,
        id_str: '1087725245836886016',
        in_reply_to_screen_name: null,
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        is_quote_status: false,
        lang: 'en',
        place: null,
        possibly_sensitive: false,
        possibly_sensitive_appealable: false,
        replies_count: 0,
        retweet_count: 5,
        retweeted: false,
        source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
        truncated: false,
        user: {
          contributors_enabled: false,
          created_at: 'Wed Jan 25 19:10:43 +0000 2017',
          default_profile: true,
          default_profile_image: false,
          description: "An unofficial group of employees scientists and activists, in and around Yellowstone national park. We will try and keep you informed, when others can't.",
          entities: {
            description: {
              urls: [],
            },
          },
          favourites_count: 10250,
          follow_request_sent: false,
          followers_count: 62993,
          following: true,
          friends_count: 219,
          geo_enabled: false,
          has_extended_profile: false,
          id: 824333698728333300,
          id_str: '824333698728333312',
          is_translation_enabled: false,
          is_translator: false,
          lang: 'en',
          listed_count: 727,
          location: 'Yellowstone National Park',
          name: 'AltYellowstoneNatPar',
          notifications: false,
          profile_background_color: 'F5F8FA',
          profile_background_image_url: null,
          profile_background_image_url_https: null,
          profile_background_tile: false,
          profile_banner_url: 'https://pbs.twimg.com/profile_banners/824333698728333312/1485377318',
          profile_image_url: 'http://pbs.twimg.com/profile_images/824721302749483009/t2Dop1fU_normal.jpg',
          profile_image_url_https: 'https://pbs.twimg.com/profile_images/824721302749483009/t2Dop1fU_normal.jpg',
          profile_link_color: '1DA1F2',
          profile_sidebar_border_color: 'C0DEED',
          profile_sidebar_fill_color: 'DDEEF6',
          profile_text_color: '333333',
          profile_use_background_image: true,
          protected: false,
          screen_name: 'AltYelloNatPark',
          statuses_count: 25049,
          time_zone: null,
          translator_type: 'none',
          url: null,
          utc_offset: null,
          verified: false,
        },
      },
      created_at: 'Tue, 22 Jan 2019 14:54:42 GMT',
      gender: 'GenderEnum.unknown',
      has_link: true,
      id: 4521559,
      is_corporate: false,
      news_score: 0.63325,
      original_id: '1087725245836886016',
      retrieved_at: 'Tue, 22 Jan 2019 15:00:43 GMT',
      source: 'twitter',
      toxicity: 0.12776165,
      virality_count: 26,
    },
  ],
};

describe('filtering', () => {
  describe('getFilteredPosts', () => {
    it('filters brands', () => {
      const settings = {
        include_corporate: false,
      };
      const {
        inFeedPosts,
        filteredPosts,
        filterReasons,
      } = getFilteredPosts(POSTS.posts, settings, [], 'all');
      expect(inFeedPosts.length).toBe(3);
      expect(filteredPosts.length).toBe(2);
      expect(filterReasons).toEqual({ 4521474: [{ label: 'Corporate', type: 'corporate', icon: 'icon-corporate' }], 4521515: [{ label: 'Corporate', type: 'corporate', icon: 'icon-corporate' }], 4521559: [] });
    });

    it('filters by keyword by AND', () => {
      const settings = {
        include_corporate: true,
        keywordsAnd: ['out', 'https'],
      };
      const {
        inFeedPosts,
        filteredPosts,
        filterReasons,
      } = getFilteredPosts(POSTS.posts, settings, [], 'all');
      expect(inFeedPosts.length).toBe(3);
      expect(filteredPosts.length).toBe(2);
      expect(filterReasons).toEqual({ 4521474: [{ label: 'Keyword', type: 'keyword', icon: 'icon-keyword-rule' }], 4521515: [{ label: 'Keyword', type: 'keyword', icon: 'icon-keyword-rule' }], 4521559: [] });
    });

    it('filters by keyword by OR', () => {
      const settings = {
        include_corporate: true,
        keywordsOr: ['appointments', 'Do-gooders'],
      };
      const {
        inFeedPosts,
        filteredPosts,
        filterReasons,
      } = getFilteredPosts(POSTS.posts, settings, [], 'all');
      expect(inFeedPosts.length).toBe(3);
      expect(filteredPosts.length).toBe(2);
      expect(filterReasons).toEqual({ 4521474: [{ label: 'Keyword', type: 'keyword', icon: 'icon-keyword-rule' }], 4521515: [], 4521559: [{ label: 'Keyword', type: 'keyword', icon: 'icon-keyword-rule' }] });
    });
  });
});
