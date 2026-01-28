
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




let cachedSitemap = null;
let lastCacheTime = 0;

app.get("/sitemap.xml", async (req, res) => {
  // Cache for 1 hour (3600000 ms) to save Appwrite credits/load
  if (cachedSitemap && (Date.now() - lastCacheTime < 3600000)) {
    res.header("Content-Type", "application/xml");
    return res.send(cachedSitemap);
  }

  try {
    // FIX: Added limit query to get more than 25 documents
    const url = `${process.env.APPWRITE_ENDPOINT}/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_COLLECTION_ID}/documents?queries[]=limit(40000)`;

    const response = await fetch(url, {
      headers: {
        "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID,
        "X-Appwrite-Key": process.env.APPWRITE_API_KEY
      }
    });

    const data = await response.json();
    const posts = data.documents || [];
    const baseURL = "https://www.trend-nest-latest-blog.name.ng";

    const urls = posts.map(post => `
  <url>
    <loc>${baseURL}/articles.html?slug=${encodeURIComponent(post.slug)}</loc>
    <lastmod>${new Date(post.$updatedAt || post.$createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseURL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls}
</urlset>`;

    cachedSitemap = sitemap;
    lastCacheTime = Date.now();

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (err) {
    res.status(500).send("Error");
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








