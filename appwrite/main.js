import { Client, Databases } from "node-appwrite";

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] || process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  let document = req.body;
  if (typeof document === 'string') document = JSON.parse(document);

  const { $databaseId, $collectionId, $id, title, slug: currentSlug } = document;

  if (!title) {
    return res.json({ message: "Slug not generated: title missing" });
  }

  const newSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  if (currentSlug === newSlug) {
    return res.json({ message: "Slug already up to date" });
  }

  try {
    await databases.updateDocument($databaseId, $collectionId, $id, { slug: newSlug });
    return res.json({ success: true, slug: newSlug });
  } catch (err) {
    error("Failed to update document: " + err.message);
    return res.json({ success: false, error: err.message });
  }
};
