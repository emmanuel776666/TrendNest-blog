
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { marked } from "marked";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

// Escape values that will be placed inside HTML attributes
const escapeHTML = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Get an article from Appwrite using its slug
async function getPostBySlug(slug) {
  const query = JSON.stringify({
    method: "equal",
    attribute: "slug",
    values: [slug]
  });

  const url =
    `${process.env.APPWRITE_ENDPOINT}/databases/` +
    `${process.env.APPWRITE_DATABASE_ID}/collections/` +
    `${process.env.APPWRITE_COLLECTION_ID}/documents` +
    `?queries[]=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: {
      "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID,
      "X-Appwrite-Key": process.env.APPWRITE_API_KEY
    }
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "❌ Appwrite request failed:",
      response.status,
      errorText
    );

    throw new Error("Failed to fetch article from Appwrite");
  }

  const data = await response.json();

  return data.documents?.[0] || null;
}

/* =========================================================
   HOME / HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.status(200).send("TrendNest server is running 🚀");
});

/* =========================================================
   ARTICLE PAGE
=========================================================

   What this route does:

   1. Gets the article from Appwrite using the slug.
   2. Converts Markdown content into HTML.
   3. Provides SEO metadata.
   4. Provides Open Graph metadata.
   5. Provides Twitter metadata.
   6. Provides Article JSON-LD structured data.
   7. Crawlers/importers receive the complete article HTML.
   8. Normal visitors are redirected to your existing SPA.

========================================================= */

app.get("/articles.html", async (req, res) => {
  const slug = req.query.slug;

  if (!slug) {
    return res.status(400).send("No slug");
  }

  try {
    /* -------------------------------------------------------
       GET ARTICLE FROM APPWRITE
    ------------------------------------------------------- */

    const post = await getPostBySlug(slug);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    /* -------------------------------------------------------
       URLS
    ------------------------------------------------------- */

    // Your public/SEO URL
    // Keep this as BASE_URL (www version)
    const pageURL =
      `${process.env.BASE_URL.trim()}/articles.html?slug=${encodeURIComponent(slug)}`;

    // Your existing SPA URL
    // Keep this as SPA_URL (non-www version)
    const spaURL =
      `${process.env.SPA_URL.trim()}/articles.html?slug=${encodeURIComponent(slug)}`;

    /* -------------------------------------------------------
       ARTICLE CONTENT
    ------------------------------------------------------- */

    // Convert Markdown stored in Appwrite into HTML
    const articleHTML = marked.parse(post.content || "");

    /* -------------------------------------------------------
       ARTICLE INFORMATION
    ------------------------------------------------------- */

    const title = escapeHTML(
      post.title || post.subheading || "TrendNest"
    );

    const subheading = escapeHTML(
      post.subheading || post.title || ""
    );

    const description = escapeHTML(
      post.description || ""
    );

    const image = escapeHTML(
      post.image || ""
    );

    /* -------------------------------------------------------
       DATES
    ------------------------------------------------------- */

    const publishedDate = post.$createdAt
      ? new Date(post.$createdAt).toISOString()
      : new Date().toISOString();

    const modifiedDate = post.$updatedAt
      ? new Date(post.$updatedAt).toISOString()
      : publishedDate;

    /* -------------------------------------------------------
       USER AGENT
    ------------------------------------------------------- */

    const userAgent = req.headers["user-agent"] || "";

    /*
      These are crawlers/importers/social preview bots.

      They receive the complete server-rendered article
      instead of being redirected to the JavaScript SPA.
    */

    const isCrawler =
      /facebookexternalhit|facebot|meta-externalagent|twitterbot|linkedinbot|whatsapp|googlebot|bingbot|yandex|medium/i
        .test(userAgent);

    /* -------------------------------------------------------
       CACHE
    ------------------------------------------------------- */

    res.setHeader(
      "Cache-Control",
      "public, max-age=600"
    );

    /* =======================================================
       CRAWLERS / IMPORTERS
    ======================================================= */

    if (isCrawler) {
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",

        headline:
          post.title ||
          post.subheading ||
          "",

        description:
          post.description ||
          "",

        image:
          post.image ||
          "",

        datePublished: publishedDate,
        dateModified: modifiedDate,

        author: {
          "@type": "Person",
          name: "MEC",
          url: "https://www.trendblogs.com/mec/"
        },

        publisher: {
          "@type": "Organization",
          name: "TrendNest",

          logo: {
            "@type": "ImageObject",
            url: "https://raw.githubusercontent.com/emmanuel776666/TrendNest-blog/refs/heads/main/trendnest691871f4a48d4cf38ca89def.png"
          }
        },

        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageURL
        },

        url: pageURL
      };

      /*
        Prevent accidental </script> inside article/schema
        from breaking the JSON-LD script element.
      */
      const safeArticleSchema = JSON.stringify(articleSchema)
        .replace(/</g, "\\u003c");

      return res.status(200).send(`
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>${title} | TrendNest</title>

  <meta
    name="description"
    content="${description}"
  >

  <meta
    name="robots"
    content="index, follow"
  >

  <!-- Canonical URL -->

  <link
    rel="canonical"
    href="${escapeHTML(pageURL)}"
  >

  <!-- Open Graph -->

  <meta
    property="og:title"
    content="${subheading}"
  >

  <meta
    property="og:description"
    content="${description}"
  >

  <meta
    property="og:image"
    content="${image}"
  >

  <meta
    property="og:url"
    content="${escapeHTML(pageURL)}"
  >

  <meta
    property="og:type"
    content="article"
  >

  <meta
    property="og:site_name"
    content="TrendNest"
  >

  <!-- Twitter -->

  <meta
    name="twitter:card"
    content="summary_large_image"
  >

  <meta
    name="twitter:title"
    content="${subheading}"
  >

  <meta
    name="twitter:description"
    content="${description}"
  >

  <meta
    name="twitter:image"
    content="${image}"
  >

  <!-- Article Structured Data -->

  <script type="application/ld+json">
${safeArticleSchema}
  </script>

  <!-- Simple styling for crawlers/importers -->

  <style>

    body {
      font-family: Arial, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 30px 20px;
      line-height: 1.7;
      color: #222;
    }

    article {
      font-size: 18px;
    }

    h1 {
      font-size: 36px;
      line-height: 1.2;
      margin-bottom: 20px;
    }

    article img {
      max-width: 100%;
      height: auto;
    }

    .published-date {
      color: #666;
      font-size: 14px;
      margin-bottom: 30px;
    }

    .article-content img {
      max-width: 100%;
      height: auto;
    }

  </style>

</head>

<body>

  <article>

    <h1>${subheading}</h1>

    ${
      image
        ? `
        <img
          src="${image}"
          alt="${subheading}"
        >
        `
        : ""
    }

    <p class="published-date">
      Published ${new Date(publishedDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      )}
    </p>

    <div class="article-content">

      ${articleHTML}

    </div>

  </article>

</body>

</html>
      `);
    }

    /* =======================================================
       NORMAL VISITORS
    ======================================================= */

    /*
      Normal visitors continue using your existing
      JavaScript SPA.
    */

    return res.redirect(302, spaURL);

  } catch (err) {

    console.error(
      "❌ Article server error:",
      err
    );

    return res.status(500).send("Server error");
  }
});

/* =========================================================
   GLOBAL SITEMAP CACHE
========================================================= */

let cachedSitemap = null;
let lastCacheTime = 0;

const CACHE_DURATION =
  60 * 60 * 1000; // 1 hour

/* =========================================================
   GENERATE SITEMAP
========================================================= */

async function generateSitemap() {

  try {

    const baseURL =
      process.env.BASE_URL.trim();

    const allPosts = [];

    let lastId = null;
    let hasMore = true;

    while (hasMore) {

      const query = JSON.stringify({
        method: "limit",
        values: [100]
      });

      let queryUrl =
        `${process.env.APPWRITE_ENDPOINT}/databases/` +
        `${process.env.APPWRITE_DATABASE_ID}/collections/` +
        `${process.env.APPWRITE_COLLECTION_ID}/documents` +
        `?queries[]=${encodeURIComponent(query)}`;

      if (lastId) {

        queryUrl +=
          `&queries[]=cursorAfter("${lastId}")`;
      }

      const response = await fetch(queryUrl, {

        headers: {

          "X-Appwrite-Project":
            process.env.APPWRITE_PROJECT_ID,

          "X-Appwrite-Key":
            process.env.APPWRITE_API_KEY
        }

      });

      if (!response.ok) {

        throw new Error(
          "Failed to fetch posts from Appwrite"
        );
      }

      const data =
        await response.json();

      const documents =
        data.documents || [];

      allPosts.push(...documents);

      if (documents.length === 100) {

        lastId =
          documents[documents.length - 1].$id;

      } else {

        hasMore = false;
      }
    }

    /* -------------------------------------------------------
       ONLY POSTS WITH SLUGS
    ------------------------------------------------------- */

    const filteredPosts =
      allPosts.filter(
        post => post.slug
      );

    /* -------------------------------------------------------
       CREATE URL ENTRIES
    ------------------------------------------------------- */

    const urls =
      filteredPosts
        .map(post => {

          const lastModified =
            post.$updatedAt ||
            post.$createdAt;

          return `
  <url>
    <loc>${baseURL}/articles.html?slug=${encodeURIComponent(post.slug)}</loc>
    <lastmod>${new Date(lastModified).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
        })
        .join("");

    /* -------------------------------------------------------
       COMPLETE SITEMAP
    ------------------------------------------------------- */

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>

<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>

${urls}

</urlset>`;

    console.log(
      "✅ Sitemap generated:",
      filteredPosts.length,
      "posts"
    );

    return sitemap;

  } catch (err) {

    console.error(
      "❌ Sitemap generation error:",
      err
    );

    return null;
  }
}

/* =========================================================
   PRELOAD SITEMAP WHEN SERVER STARTS
========================================================= */

(async () => {

  cachedSitemap =
    await generateSitemap();

  lastCacheTime =
    Date.now();

})();

/* =========================================================
   ROBOTS.TXT
========================================================= */

app.get("/robots.txt", (req, res) => {

  res
    .type("text/plain")
    .status(200)
    .send(
`User-agent: *
Allow: /

Sitemap: ${process.env.SITE_URL.trim()}/sitemap.xml`
    );

});

/* =========================================================
   SITEMAP ROUTE
========================================================= */

app.get("/sitemap.xml", async (req, res) => {

  try {

    const now = Date.now();

    /* -------------------------------------------------------
       REFRESH CACHE IF EXPIRED
    ------------------------------------------------------- */

    if (
      !cachedSitemap ||
      now - lastCacheTime >
        CACHE_DURATION
    ) {

      console.log(
        "♻️ Regenerating sitemap..."
      );

      const newSitemap =
        await generateSitemap();

      if (newSitemap) {

        cachedSitemap =
          newSitemap;

        lastCacheTime =
          now;
      }
    }

    /* -------------------------------------------------------
       NO SITEMAP AVAILABLE
    ------------------------------------------------------- */

    if (!cachedSitemap) {

      return res
        .status(500)
        .send("Sitemap not available");
    }

    /* -------------------------------------------------------
       SEND SITEMAP
    ------------------------------------------------------- */

    return res
      .status(200)
      .header(
        "Content-Type",
        "application/xml"
      )
      .send(cachedSitemap);

  } catch (err) {

    console.error(
      "❌ Sitemap route error:",
      err
    );

    return res
      .status(500)
      .send(
        "Error generating sitemap"
      );
  }

});

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {

  console.log(
    `🚀 TrendNest server running on port ${PORT}`
  );

});

