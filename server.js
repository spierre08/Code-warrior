import app from "./app.js";
import "./common/config/db.js";
import Utils from "./common/utils/utils.js";

app.listen(Utils.PORT, () => {
  console.log(
    `Serveur démarré sur le port --${Utils.PORT} et l'url est http://localhost:${Utils.PORT}/`
  );
});
