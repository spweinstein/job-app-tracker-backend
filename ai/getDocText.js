export function getDocumentText(document) {
  if (!document) return "";

  // Prefer any existing plain-text style exports if present
  if (document.plainTextExport) return document.plainTextExport;
  if (document.text) return document.text;
  if (document.markdown) return document.markdown;

  const lines = [];

  if (document.name) {
    lines.push(`Title: ${document.name}`);
  }

  if (document.summary) {
    lines.push("");
    lines.push("Summary:");
    lines.push(document.summary);
  }

  if (Array.isArray(document.experience) && document.experience.length > 0) {
    lines.push("");
    lines.push("Experience:");
    document.experience.forEach((exp) => {
      const companyName =
        (exp.company && exp.company.name) || exp.companyName || "";
      const title = exp.title || "";
      const start = exp.startDate
        ? new Date(exp.startDate).toISOString().slice(0, 10)
        : "";
      const end = exp.endDate
        ? new Date(exp.endDate).toISOString().slice(0, 10)
        : "";
      const dates = [start, end].filter(Boolean).join(" - ");

      lines.push(`- ${title}${companyName ? ` @ ${companyName}` : ""}${dates ? ` (${dates})` : ""}`);
      if (exp.description) {
        lines.push(`  ${exp.description}`);
      }
    });
  }

  if (Array.isArray(document.projects) && document.projects.length > 0) {
    lines.push("");
    lines.push("Projects:");
    document.projects.forEach((proj) => {
      const companyName =
        (proj.company && proj.company.name) || proj.companyName || "";
      const title = proj.title || "";
      const year = proj.year || "";
      const headerParts = [title, companyName, year].filter(Boolean);
      if (headerParts.length) {
        lines.push(`- ${headerParts.join(" — ")}`);
      }
      if (proj.description) {
        lines.push(`  ${proj.description}`);
      }
    });
  }

  if (Array.isArray(document.education) && document.education.length > 0) {
    lines.push("");
    lines.push("Education:");
    document.education.forEach((edu) => {
      const degree = edu.degree || "";
      const school = edu.school || "";
      const year = edu.year || "";
      const headerParts = [degree, school, year].filter(Boolean);
      if (headerParts.length) {
        lines.push(`- ${headerParts.join(" — ")}`);
      }
    });
  }

  if (Array.isArray(document.certifications) && document.certifications.length > 0) {
    lines.push("");
    lines.push("Certifications:");
    document.certifications.forEach((cert) => {
      const title = cert.title || "";
      const companyName =
        (cert.company && cert.company.name) || cert.companyName || "";
      const year = cert.year || "";
      const headerParts = [title, companyName, year].filter(Boolean);
      if (headerParts.length) {
        lines.push(`- ${headerParts.join(" — ")}`);
      }
      if (cert.description) {
        lines.push(`  ${cert.description}`);
      }
    });
  }

  if (Array.isArray(document.skills) && document.skills.length > 0) {
    lines.push("");
    lines.push("Skills:");
    lines.push(document.skills.join(", "));
  }

  if (document.body) {
    lines.push("");
    lines.push("Cover Letter:");
    lines.push(document.body);
  }

  if (document.notes) {
    lines.push("");
    lines.push("Notes:");
    lines.push(document.notes);
  }

  return lines.join("\n").trim();
}

