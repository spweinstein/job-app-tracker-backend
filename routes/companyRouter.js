import { Router } from "express";
import * as companyControllers from "../controllers/companyControllers.js";
import verifyToken from "../middleware/verifyToken.js";
import validateBody from "../middleware/validateBody.js";
import { companyBodySchema } from "../schemas/companySchemas.js";

const companyRouter = Router();
companyRouter.use(verifyToken); // Apply to all routes below

companyRouter.get("/", companyControllers.getCompanies);

companyRouter.get("/:id", companyControllers.getCompany);

companyRouter.post(
  "/",
  validateBody(companyBodySchema),
  companyControllers.createCompany,
);

companyRouter.delete("/:id", companyControllers.deleteCompany);

companyRouter.put(
  "/:id",
  validateBody(companyBodySchema),
  companyControllers.updateCompany,
);

export default companyRouter;
