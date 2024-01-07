"use strict";
const express = require('express');
const app = express();
app.use(express.json());
const port = 3001;
const db = require("./app/models");
db.sequelize.sync()
    .then(() => {
    console.log('Connection has been established successfully.');
})
    .catch((error) => {
    console.error('Unable to connect to the database:', error);
});
app.get("/", (req, res) => {
    res.json({ message: "welcom to nodejs app" });
});

require("./app/routes/authUser.routes")(app);

require("./app/routes/book.routes")(app);
require("./app/routes/publisher.routes")(app);
require("./app/routes/comment.routes")(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
