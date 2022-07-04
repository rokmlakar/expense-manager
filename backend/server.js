const express = require("express");
const session = require("express-session");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const path = require("path");

//ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes")
const transactionRoutes = require('./routes/transactionRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');

const app = express();
const port = process.env.PORT || 5000;
const { prisma } = require("./constants/config");
const PrismaStore = require("./lib/index")(session);

//SERVER CLIENT FOLDER IE REACT BUILD
app.use(express.static(path.join(__dirname, 'client')));

//CORS
//ADD URL HERE
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://localhost:5000",
      'http://expenseTracker20/5000',
      'http://expenseTracker20'
    ],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE", "PATCH"],
    credentials: true,
  })
);

//SESSIONS
app.use(
  session({
    name: "sess",
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new PrismaStore({ client: prisma }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//ROUTES
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", transactionRoutes);
app.use("/api", categoriesRoutes);
app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(port, () => {
  console.log(`SERVER STARTED : ${port}`);
});