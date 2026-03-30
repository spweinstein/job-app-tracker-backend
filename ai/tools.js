// ai/tools.js

export const TOOL_DEFINITIONS = [
    {
      type: "function",
      name: "get_applications",
      description: "Get a list of job applications. Can filter by status, company, or search by title.",
      parameters: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["Applied", "Interviewing", "Accepted", "Offer", "Rejected", "Withdrawn"],
            description: "Filter applications by status"
          },
          company: {
            type: "string",
            description: "Filter by company ID (ObjectId)"
          },
          search: {
            type: "string",
            description: "Search applications by title"
          },
          limit: {
            type: "number",
            description: "Maximum number of results (default: 10, max: 50)",
            default: 10
          }
        }
      }
    },
    {
      type: "function",
      name: "get_application",
      description: "Get details of a specific job application by ID.",
      parameters: {
        type: "object",
        properties: {
          applicationId: {
            type: "string",
            description: "The application ID (ObjectId)"
          }
        },
        required: ["applicationId"]
      }
    },
    {
      type: "function",
      name: "get_resumes",
      description: "Get a list of resumes. Can search by name.",
      parameters: {
        type: "object",
        properties: {
          search: {
            type: "string",
            description: "Search resumes by name"
          },
          limit: {
            type: "number",
            description: "Maximum number of results (default: 10, max: 50)",
            default: 10
          }
        }
      }
    },
    {
      type: "function",
      name: "get_resume",
      description: "Get details of a specific resume by ID.",
      parameters: {
        type: "object",
        properties: {
          resumeId: {
            type: "string",
            description: "The resume ID (ObjectId)"
          }
        },
        required: ["resumeId"]
      }
    },
    {
      type: "function",
      name: "get_cover_letters",
      description: "Get a list of cover letters. Can search by name.",
      parameters: {
        type: "object",
        properties: {
          search: {
            type: "string",
            description: "Search cover letters by name"
          },
          limit: {
            type: "number",
            description: "Maximum number of results (default: 10, max: 50)",
            default: 10
          }
        }
      }
    },
    {
      type: "function",
      name: "get_cover_letter",
      description: "Get details of a specific cover letter by ID.",
      parameters: {
        type: "object",
        properties: {
          coverLetterId: {
            type: "string",
            description: "The cover letter ID (ObjectId)"
          }
        },
        required: ["coverLetterId"]
      }
    }
  ];