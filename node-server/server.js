import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { marked } from "marked";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
 
/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.status(200).send("TrendNest server is running 🚀");
});

/* ===============================
   GLOBAL SITEMAP CACHE
================================ */
let cachedSitemap = null;
let lastCacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // ✅ 1 hours

/* ===============================
   GENERATE SITEMAP (FAST + SAFE)
================================ */
async function generateSitemap() {
  try {
    const baseURL = process.env.BASE_URL.trim();
    const allPosts = [];
    let lastId = null;
    let hasMore = true;

    while (hasMore) {
      const query = JSON.stringify({ method: "limit", values: [100] });

      let queryUrl = `${process.env.APPWRITE_ENDPOINT}/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_COLLECTION_ID}/documents?queries[]=${encodeURIComponent(query)}`;

      if (lastId) {
        queryUrl += `&queries[]=cursorAfter("${lastId}")`;
      }

      const response = await fetch(queryUrl, {
        headers: {
          "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID,
          "X-Appwrite-Key": process.env.APPWRITE_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from Appwrite");
      }

      const data = await response.json();
      const documents = data.documents || [];

      allPosts.push(...documents);

      if (documents.length === 100) {
        lastId = documents[documents.length - 1].$id;
      } else {
        hasMore = false;
      }
    }

    const filteredPosts = allPosts.filter(post => post.slug);

    const urls = filteredPosts.map(post => `
  <url>
    <loc>${baseURL}/articles.html?slug=${encodeURIComponent(post.slug)}</loc>
    <lastmod>${new Date(post.$updatedAt || post.$createdAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    console.log("✅ Sitemap generated:", filteredPosts.length, "posts");

    return sitemap;

  } catch (err) {
    console.error("❌ Sitemap generation error:", err);
    return null;
  }
}

/* ===============================
   PRELOAD SITEMAP ON START
================================ */
(async () => {
  cachedSitemap = await generateSitemap();
  lastCacheTime = Date.now();
})();

/* ===============================
   ROBOTS.TXT (CLEAN)
================================ */
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.status(200).send(
`User-agent: *
Allow: /

Sitemap: ${process.env.SITE_URL.trim()}/sitemap.xml`
  );
});

/* ===============================
   SITEMAP ROUTE (SUPER FAST)
================================ */
app.get("/sitemap.xml", async (req, res) => {
  try {
    const now = Date.now();

    // Refresh cache if expired
    if (!cachedSitemap || now - lastCacheTime > CACHE_DURATION) {
      console.log("♻️ Regenerating sitemap...");
      const newSitemap = await generateSitemap();

      if (newSitemap) {
        cachedSitemap = newSitemap;
        lastCacheTime = now;
      }
    }

    if (!cachedSitemap) {
      return res.status(500).send("Sitemap not available");
    }

    res
      .status(200)
      .header("Content-Type", "application/xml")
      .send(cachedSitemap);

  } catch (err) {
    console.error("❌ Sitemap route error:", err);
    res.status(500).send("Error generating sitemap");
  }
});

/* ===============================
   OG ARTICLE PAGE
================================ */
app.get("/test", (req, res) => {
  res.send("TEST ROUTE WORKS");
});
app.get("/articles.html", async (req, res) => {
  console.log("🟢 NEW ARTICLE ROUTE IS RUNNING");
  console.log("🔥 SERVER ARTICLE ROUTE WAS CALLED");

  const slug = req.query.slug;

  if (!slug) {
    return res.status(400).send("No slug");
  }

  try {
    // Get article from Appwrite
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

    if (!response.ok) {
      throw new Error("Failed to fetch article from Appwrite");
    }

    const data = await response.json();
    const post = data.documents?.[0];

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Convert Markdown content to HTML
    const articleHTML = marked.parse(post.content || "");

    // Read your existing articles.html
    const filePath = path.join(__dirname, "..", "articles.html");
let html = fs.readFileSync(filePath, "utf8");

console.log("📄 HTML FILE:", filePath);
console.log("📏 HTML LENGTH:", html.length);

    // Put article data into the existing HTML
    html = html
      .replace('<title id="page-title">Loading</title>',
        `<title id="page-title">${post.title} | TrendNest</title>`)

      .replace(
        '<meta name="description" id="meta-description" content="">',
        `<meta name="description" id="meta-description" content="${post.description || ""}">`
      )

      .replace(
        '<meta name="keywords" id="meta-keywords" content="">',
        `<meta name="keywords" id="meta-keywords" content="${post.keyword || ""}">`
      )

      .replace(
        '<link rel="canonical" id="canonical-link" href="">',
        `<link rel="canonical" id="canonical-link" href="${process.env.BASE_URL}/articles.html?slug=${encodeURIComponent(post.slug)}">`
      )

      .replace(
        '<meta property="og:title" id="og-title" content="">',
        `<meta property="og:title" id="og-title" content="${post.title}">`
      )

      .replace(
        '<meta property="og:image" id="og-image" content="">',
        `<meta property="og:image" id="og-image" content="${post.image || ""}">`
      )

      .replace(
        '<meta property="og:url" id="og-url" content="">',
        `<meta property="og:url" id="og-url" content="${process.env.BASE_URL}/articles.html?slug=${encodeURIComponent(post.slug)}">`
      )

      .replace(
        '<meta property="og:description" id="og-description" content="">',
        `<meta property="og:description" id="og-description" content="${post.description || ""}">`
      )

      .replace(
        '<meta name="twitter:title" id="twitter-title" content="">',
        `<meta name="twitter:title" id="twitter-title" content="${post.title}">`
      )

      .replace(
        '<meta name="twitter:image" id="twitter-image" content="">',
        `<meta name="twitter:image" id="twitter-image" content="${post.image || ""}">`
      )

      .replace(
        '<h2 class="post-title" id="post-title">Loading...</h2>',
        `<h2 class="post-title" id="post-title">${post.title}</h2>`
      )

      .replace(
        '<img src="whiteimageforloading.webp" id="post-image" alt="" width="665" height="443" loading="eager" fetchpriority="high" decoding="async">',
        `<img src="${post.image || ""}" id="post-image" alt="${post.title}" width="665" height="443" loading="eager" fetchpriority="high" decoding="async">`
      )

      .replace(
        '<p class="publish-date" id="publish-date">Published Loading...</p>',
        `<p class="publish-date" id="publish-date">Published ${new Date(post.$createdAt).toLocaleDateString()}</p>`
      )

      .replace(
        '<div class="post-body" id="post-body">Loading content...</div>',
        `<div class="post-body" id="post-body">${articleHTML}</div>`
      );

    // Send the completed page
    res.status(200).send(html);

  } catch (err) {
    console.error("❌ Article error:", err);
    res.status(500).send("Server error");
  }
});
app.use(express.static(path.join(__dirname, "..")));
/* ===============================
   START SERVER
================================ */
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
