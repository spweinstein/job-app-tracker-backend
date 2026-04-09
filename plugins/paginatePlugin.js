const paginatePlugin = (schema) => {
  schema.statics.paginate = async function (
    req,
    baseFilter = {},
    options = {},
  ) {
    const {
      q,
      sort = "updatedAt",
      sortDir = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const sortAllowList = options.sortAllowList ?? [
      "updatedAt",
      "createdAt",
      "name",
      "version",
      "appliedAt",
    ];
    if (!sortAllowList.includes(sort)) {
      const e = new Error("Invalid sort");
      e.statusCode = 400;
      throw e;
    }

    const parsedPage = Math.max(1, Number(page));
    const parsedLimit = Math.min(100, Math.max(1, Number(limit)));

    if (!Number.isFinite(parsedPage) || parsedPage < 1) {
      const e = new Error("Invalid page");
      e.statusCode = 400;
      throw e;
    }

    if (!Number.isFinite(parsedLimit) || parsedLimit < 1) {
      const e = new Error("Invalid limit");
      e.statusCode = 400;
      throw e;
    }

    const filter = { ...baseFilter };
    if (q?.trim()) {
      filter.$or = (options.searchFields ?? ["name"]).map((field) => ({
        [field]: { $regex: q.trim(), $options: "i" },
      }));
    }

    let query = this.find(filter)
      .sort({ [sort]: sortDir === "asc" ? 1 : -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    for (const pop of options.populate ?? []) {
      query = query.populate(pop);
    }

    const [data, total] = await Promise.all([
      query,
      this.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    };
  };
};

export default paginatePlugin;
