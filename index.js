"use strict";
const app = require("./api/server.js");
const PORT = 24500;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
