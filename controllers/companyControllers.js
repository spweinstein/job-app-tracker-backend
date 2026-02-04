import Company from "../models/companyModel.js";

// GET /companies/
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (e) {
    console.log(`Error at getCompanies: ${e}`);
    res.status(500).json({ error: e.message });
  }
};

// GET /companies/:id
export const getCompany = async (req, res) => {
  try {
    const company = await Company.find({ _id: req.params.id });
  } catch (e) {
    if (res.statusCode === 404) {
      res.json({ error: e.message });
    } else {
      console.log(`Error at getCompany: ${e}`);
      res.status(500).json({ error: e.message });
    }
  }
};

// POST /companies/
export const createCompany = async (req, res) => {
  try {
    const createdCompany = await Company.create(req.body);
    res.status(201).json(createdCompany);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// DELETE /companies/:id
export const deleteCompany = async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      res.status(404);
      throw new Error("Company not found");
    }
    res.json(deletedCompany);
  } catch (e) {
    if (res.statusCode === 404) {
      res.json({ error: e.message });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
};

// UPDATE /companies/:id
export const updateCompany = async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
    );
    if (!updatedCompany) {
      res.status(404);
      throw new Error("Company not found");
    }
    res.status(200).json(updatedCompany);
  } catch (e) {
    if (res.statusCode === 404) {
      res.json({ error: e.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};
