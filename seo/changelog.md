# Change log: quickdecorideas.com

Site 28-day baseline at 2026-10-09 (GSC 2026-09-09 to 2026-10-06): 1 click, 510 impressions, CTR 0.2%, avg position 24.4. Indexed 32 of 131 (the Indexing plan counts 84 as unknown to Google) pages that should be indexed.

| date | url | change | finding | baseline clicks/impr/ctr/pos (28d) | review on | result |
|---|---|---|---|---|---|---|
| 2026-10-09 | https://quickdecorideas.com/blog | `/blog` now pages through every post (12 per page, numbered and prev/next links, self-canonical per page, past-the-end pages return 404). Before, it listed only the latest 12, so 46 of the 120 sitemap posts had no link from the home, blog or first category pages, and 32 had none from any page (checked on the live site, 2026-10-09). | indexing-plan: "URL is unknown to Google" (84 URLs, 0 inbound links) | 0 / 1 / 0% / 9.0 | 2026-11-06 | |
| 2026-10-09 | https://quickdecorideas.com/category/home-decor?page=2 | Category pages 2+ had a canonical pointing at page 1 (Google folds them into page 1 and can skip the posts only they list). Each page is now its own canonical, with "page N" in its title. Pagination also gets numbered links. | quickdecorideas-tech-2 | site: 1 / 510 / 0.2% / 24.4 | 2026-11-06 | |
| 2026-10-09 | https://quickdecorideas.com/sitemap.xml | Sitemap static entries (home, blog, about, contact, privacy) no longer carry `lastmod` = build time. | tk-policy-check #7 (fake freshness) | site: 1 / 510 / 0.2% / 24.4 | 2026-11-06 | |
