const app = require("./api/server.js");
const PORT = 25000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
