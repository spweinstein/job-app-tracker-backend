import mongoose from "mongoose";
import Document from "./documentModel.js";
const experienceSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },

  description: String,
});

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
  },

  school: {
    type: String,
    required: true,
  },

  year: Number,
});

const projectSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },

  year: Number,

  title: {
    type: String,
    required: true,
  },

  link: String,

  description: String,
});

const certificationSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },

  year: Number,

  title: {
    type: String,
  },

  description: String,
});

const resumeSchema = new mongoose.Schema(
  {
    // // Tree structure & metadata
    // parent: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Resume",
    //   // required: true,
    // },
    // root: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Resume",
    //   // required: true,
    // },
    // owner: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    // version: {
    //   type: Number,
    //   default: 0,
    // },
    // isDraft: {
    //   type: Boolean,
    //   default: true,
    // },
    // name: {
    //   type: String,
    // },

    // Resume Info
    experience: [experienceSchema],
    education: [educationSchema],
    projects: [projectSchema],
    certifications: [certificationSchema],
    skills: [String],
    link: {
      type: String,
    },

    summary: String,

    notes: String,
  });

// // Prevent circular references
// resumeSchema.pre("save", async function (next) {
//   // Can't be your own parent
//   if (this.parent && this.parent.equals(this._id)) {
//     throw new Error("Resume cannot be its own parent");
//   }

//   // Can't set parent to one of your children (prevents cycles)
//   if (this.isModified("parent") && this.parent) {
//     const Resume = mongoose.model("Resume");
//     const descendants = await Resume.find({
//       parent: this._id,
//       user: this.user,
//     }).select("_id");

//     const descendantIds = descendants.map((d) => d._id.toString());
//     if (descendantIds.includes(this.parent.toString())) {
//       throw new Error("Circular reference detected");
//     }
//   }
// });

// // Get direct children of this resume
// resumeSchema.methods.getChildren = async function (limit = 10) {
//   const Resume = mongoose.model("Resume");
//   return await Resume.find({
//     parent: this._id,
//     user: this.user,
//   })
//     .select("name updatedAt")
//     .sort({ updatedAt: -1 })
//     .limit(limit);
// };

// // Get lineage from root to current resume
// resumeSchema.methods.getLineage = async function () {
//   const Resume = mongoose.model("Resume");
//   const lineage = [this];
//   let current = this;

//   // Walk backwards max 10 levels to prevent infinite loops
//   for (let i = 0; i < 10 && current.parent; i++) {
//     current = await Resume.findById(current.parent);
//     if (current) {
//       lineage.unshift(current);
//     } else {
//       break;
//     }
//   }

//   return lineage;
// };

export default Document.discriminator("Resume", resumeSchema);
