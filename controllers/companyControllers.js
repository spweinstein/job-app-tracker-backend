import Company from "../models/companyModel.js";

// GET /companies/
export const getCompanies = async (req, res) => {
  try {
    // const companies = await Company.find({ author: req.user._id });
    const companies = await Company.paginate(req, { author: req.user._id });
    res.json(companies);
  } catch (error) {
    console.log(`Error at getCompanies: ${error}`);
    res.status(500).json({ error: error.message });
  }
};

// GET /companies/:id
export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    if (!company?.author?.equals(req.user?._id)) {
      return res.status(403).send("Action not allowed!");
    }
    res.json(company || {});
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message });
    } else {
      console.log(`Error at getCompany: ${error}`);
      res.status(500).json({ error: error.message });
    }
  }
};

// POST /companies/
export const createCompany = async (req, res) => {
  try {
    req.body.author = req.user._id;
    // Ensure company name is unique for the user
    const companyInDatabase = await Company.findOne({
      author: req.user._id,
      name: req.body.name,
    });
    if (companyInDatabase) {
      return res
        .status(409)
        .json({ error: `Company ${req.body.name} already in database!` });
    }
    const createdCompany = await Company.create(req.body);
    res.status(201).json(createdCompany);
  } catch (error) {
    console.log(`Error at createCompany: ${error}`);
    res.status(500).json({ error: error.message });
  }
};

// DELETE /companies/:id
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company?.author?.equals(req.user?._id)) {
      return res.status(403).send("Action not allowed!");
    }
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(deletedCompany);
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// UPDATE /companies/:id
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company?.author?.equals(req.user?._id)) {
      return res.status(403).send("Action not allowed!");
    }
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
    );
    if (!updatedCompany) {
      res.status(404);
      throw new Error("Company not found");
    }
    res.status(200).json(updatedCompany);
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};
