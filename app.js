const express = require("express");
const { initializeRoutes } = require("./routes");
const { createServer } = require("http")
const { Server } = require("socket.io")
const jwt = require("jsonwebtoken");
const db = require("./models");
let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app = initializeRoutes(app);

app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "welcome to the beginning of greatness",
  });
});

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.use((socket, next) => {
  if(socket.handshake.headers.token) {
    const { token } = socket.handshake.headers

    jwt.verify(token, process.env.JWT_SECRET_KEY,async(err, decodedToken) => {
      if (err) {
        console.error("Authentication error, Invalid Token supplied");
      }

      const theUser = await db.User.findByPk(decodedToken.id);
      if (!theUser)
        console.error(
          "Invalid Email or Password, Kindly contact the admin if this is an anomaly"
        );

      socket.theUser = theUser;

      console.log(theUser)
      next()
    })
  } else {
    const error = new Error("Authentication error!")
    error.data = {content: "Please retry later"}
    console.error(error);
  }
})

io.on('connection', (socket) => {
  /*  */
  console.log('socket')
})

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
