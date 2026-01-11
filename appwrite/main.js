import { Client, Databases } from "node-appwrite";

export default async ({ req, res, log, error }) => {
  try {
    // Get payload
    let payload = req.body || {};
    if (payload.event && payload.event.payload) {
      payload = payload.event.payload;
    }

    const { $databaseId, $tableId, $id, title, slug: currentSlug } = payload;

    if (!title || !$databaseId || !$tableId || !$id) {
      return res.json({ message: "Missing required fields in payload" });
    }
    // If slug already exists, DO NOT change it
    if (currentSlug && currentSlug.length > 0) {
   return res.json({ message: "Slug already exists. Skipping update." });
}


    // Generate slug (max 10 chars)
    let newSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 30)
      .replace(/-+$/, "");

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    // Update the document
    await databases.updateDocument($databaseId, $tableId, $id, { slug: newSlug });

    return res.json({ success: true, slug: newSlug });
  } catch (err) {
    error("Failed to generate slug: " + err.message);
    return res.json({ success: false, error: err.message });
  }
};
