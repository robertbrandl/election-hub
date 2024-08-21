import presidentRoutes from "./president.js";
import upcomingElectionsRoutes from "./upcomingelections.js";
import senateRoutes from "./senate.js"
const configRoutes = (app) => {
  app.use('/president', presidentRoutes);
  app.use('/upcomingelections', upcomingElectionsRoutes);
  app.use('/senate', senateRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default configRoutes;
