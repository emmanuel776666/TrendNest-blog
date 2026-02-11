import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

/* ===============================
   GLOBAL SITEMAP CACHE
================================ */
let cachedSitemap = null;
let lastCacheTime = 0;
const CACHE_DURATION = 3600000; // 1 hour

/* ===============================
   ROBOTS
================================ */
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`
User-agent: *
Allow: /

Sitemap: ${process.env.BASE_URL}/sitemap.xml
`);
});

/* ===============================
   SITEMAP
================================ */
app.get("/sitemap.xml", async (req, res) => {
  const now = Date.now();

  // Serve cached version
  if (cachedSitemap && (now - lastCacheTime < CACHE_DURATION)) {
    res.header("Content-Type", "application/xml");
    return res.send(cachedSitemap);
  }

  try {
    const baseURL = process.env.BASE_URL;
    const allPosts = [];
    let lastId = null;
    let hasMore = true;

    while (hasMore) {
      let queryUrl = `${process.env.APPWRITE_ENDPOINT}/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_COLLECTION_ID}/documents?queries[]=limit(100)`;

      if (lastId) {
        queryUrl += `&queries[]=cursorAfter("${lastId}")`;
      }

      console.log("Fetching posts from:", queryUrl);

      const response = await fetch(queryUrl, {
        headers: {
          "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID,
          "X-Appwrite-Key": process.env.APPWRITE_API_KEY
        }
      });

      const data = await response.json();
      const documents = data.documents || [];

      allPosts.push(...documents);

      if (documents.length === 100) {
        lastId = documents[documents.length - 1].$id;
      } else {
        hasMore = false;
      }
    }

    console.log("Total posts fetched:", allPosts.length);
    console.log("Slugs:", allPosts.map(p => p.slug));

    const urls = allPosts
      .filter(post => post.slug)
      .map(post => `
  <url>
    <loc>${baseURL}/articles.html?slug=${encodeURIComponent(post.slug)}</loc>
    <lastmod>${new Date(post.$updatedAt || post.$createdAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`)
      .join("");

    const latestUpdate = allPosts.length
      ? new Date(
          Math.max(...allPosts.map(p =>
            new Date(p.$updatedAt || p.$createdAt)
          ))
        ).toISOString()
      : new Date().toISOString();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseURL}</loc>
    <lastmod>${latestUpdate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls}
</urlset>`;

    cachedSitemap = sitemap;
    lastCacheTime = now;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);

  } catch (err) {
    console.error("Sitemap error:", err);
    res.status(500).send("Error generating sitemap");
  }
});

/* ===============================
   OG ARTICLE PAGE
================================ */
app.get("/articles.html", async (req, res) => {
  const slug = req.query.slug;
  if (!slug) return res.status(400).send("No slug");

  try {
    const query = JSON.stringify({
      method: "equal",
      attribute: "slug",
      values: [slug]
    });

    const url = `${process.env.APPWRITE_ENDPOINT}/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_COLLECTION_ID}/documents?queries[]=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: {
        "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID,
        "X-Appwrite-Key": process.env.APPWRITE_API_KEY
      }
    });

    const data = await response.json();
    const post = data.documents?.[0];

    if (!post) return res.status(404).send("Post not found");

    const pageURL = `${process.env.BASE_URL}/articles.html?slug=${slug}`;

    res.setHeader("Cache-Control", "public, max-age=600");

    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>${post.title} | TrendNest</title>

  <meta property="og:title" content="${post.subheading}">
  <meta property="og:description" content="${post.description || ""}">
  <meta property="og:image" content="${post.image}">
  <meta property="og:url" content="${pageURL}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="TrendNest">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${post.subheading}">
  <meta name="twitter:image" content="${post.image}">
</head>
<body>

<script>
if (!/facebookexternalhit|facebot|meta-externalagent|twitterbot|whatsapp|linkedinbot/i.test(navigator.userAgent)) {
  window.location.href = "${process.env.SPA_URL}/articles.html?slug=${slug}";
}
</script>

</body>
</html>
`);
  } catch (err) {
    console.error("OG error:", err);
    res.status(500).send("Server error");
  }
});

/* ===============================
   START SERVER
================================ */
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
