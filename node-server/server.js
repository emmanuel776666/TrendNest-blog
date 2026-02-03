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
      ${process.env.APPWRITE_ENDPOINT} +
      /databases/${process.env.APPWRITE_DATABASE_ID} +
      /collections/${process.env.APPWRITE_COLLECTION_ID} +
      /documents?queries[]=${encodeURIComponent(query)};

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

    const pageURL = ${process.env.BASE_URL}/articles.html?slug=${slug};
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
