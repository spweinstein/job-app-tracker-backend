// Migration script to add parent and root fields to existing resumes
const mongoose = require("mongoose");
require("dotenv").config();

async function migrateResumes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database");

    const Resume = require("../models/resume.js");

    // Update all resumes that don't have parent/root fields
    const result = await Resume.updateMany(
      {
        $or: [{ parent: { $exists: false } }, { root: { $exists: false } }],
      },
      { $set: { parent: null, root: null } },
    );

    console.log(`Migration complete: ${result.modifiedCount} resumes updated`);

    await mongoose.disconnect();
    console.log("Disconnected from database");
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

migrateResumes();
