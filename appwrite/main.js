export default async ({ req, res, log, error }) => {
  let payload = req.body || {};

  // Appwrite automatic trigger sends event data inside "payload"
  if (payload.event) {
    payload = payload.event.payload; 
  }

  const { $databaseId, $collectionId, $id, title, slug: currentSlug } = payload;

  if (!title) return res.json({ message: "Slug missing" });

  let newSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 10)
    .replace(/-+$/, "");

  if (currentSlug === newSlug) return res.json({ message: "Slug already up to date" });

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    await databases.updateDocument($databaseId, $collectionId, $id, { slug: newSlug });
    return res.json({ success: true, slug: newSlug });
  } catch (err) {
    error("Failed to update document: " + err.message);
    return res.json({ success: false, error: err.message });
  }
};
