import { Router } from "express";
import * as companyControllers from "../controllers/companyControllers.js";

const companyRouter = Router();

companyRouter.get("/", companyControllers.getCompanies);

companyRouter.get("/:id", companyControllers.getCompany);

companyRouter.post("/", companyControllers.createCompany);

companyRouter.delete("/:id", companyControllers.deleteCompany);

companyRouter.put("/:id", companyControllers.updateCompany);

export default companyRouter;
