
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`
User-agent: *
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Facebot
Allow: /

User-agent: meta-externalagent
Allow: /
`);
});


app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`
User-agent: *
Allow: /

Sitemap: https://og.trend-nest-latest-blog.name.ng/sitemap.xml
  `);
});


app.get("/sitemap.xml", async (req, res) => {
  const now = Date.now();
  const CACHE_DURATION = 3600000; // 1 hour
  if (cachedSitemap && (now - lastCacheTime < CACHE_DURATION)) {
    res.header("Content-Type", "application/xml");
    return res.send(cachedSitemap);
  }

  try {
    const baseURL = "https://og.trend-nest-latest-blog.name.ng"; // change to www if needed
    const allPosts = [];
    let lastId = null;
    let hasMore = true;

    while (hasMore) {
      let queryUrl = `${process.env.APPWRITE_ENDPOINT}/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_COLLECTION_ID}/documents?queries[]=limit(100)`;
      if (lastId) queryUrl += `&queries[]=cursorAfter("${lastId}")`;

      const response = await fetch(queryUrl, {
        headers: {
          "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID,
          "X-Appwrite-Key": process.env.APPWRITE_API_KEY
        }
      });

      console.log("Fetching posts from Appwrite...");
console.log("API URL:", queryUrl);


      const data = await response.json();
      const documents = data.documents || [];
      allPosts.push(...documents);

      if (documents.length === 100) {
        lastId = documents[documents.length - 1].$id;
      } else {
        hasMore = false;
      }
    }

    // Generate URLs for each post
    const urls = allPosts.map(post => `
  <url>
    <loc>${baseURL}/articles.html?slug=${encodeURIComponent(post.slug)}</loc>
    <lastmod>${new Date(post.$updatedAt || post.$createdAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join("");

    // Latest homepage update
    const latestUpdate = allPosts.length
      ? new Date(Math.max(...allPosts.map(p => new Date(p.$updatedAt || p.$createdAt)))).toISOString()
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
    if (cachedSitemap) {
      res.header("Content-Type", "application/xml");
      return res.send(cachedSitemap);
    }
    res.status(500).send("Error generating sitemap");
  }
});






app.get("/articles.html", async (req, res) => {
  const slug = req.query.slug;
  if (!slug) return res.status(400).send("No slug");

  try {
    const query = JSON.stringify({
      method: "equal",
      attribute: "slug",
      values: [slug]
    });

    const url =
      `${process.env.APPWRITE_ENDPOINT}` +
      `/databases/${process.env.APPWRITE_DATABASE_ID}` +
      `/collections/${process.env.APPWRITE_COLLECTION_ID}` +
      `/documents?queries[]=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: {
        "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID,
        "X-Appwrite-Key": process.env.APPWRITE_API_KEY
      }
    });

    const data = await response.json();
    console.log("Appwrite:", JSON.stringify(data, null, 2));

    const post = data.documents?.[0];
    if (!post) return res.status(404).send("Post not found");

    const pageURL = `${process.env.BASE_URL}/articles.html?slug=${slug}`;
    res.setHeader("Cache-Control", "public, max-age=600");
res.status(200);


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
    if (!/facebookexternalhit|facebot|meta-externalagent|twitterbot|whatsapp|linkedinbot/i
.test(navigator.userAgent)) {
      window.location.href = "${process.env.SPA_URL}/articles.html?slug=${slug}";
    }
  </script>
</body>
</html>
`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => console.log("OG server running on port", PORT));
const server = app.listen(3000);
server.timeout = 120000; // Sets timeout to 2 minutes















