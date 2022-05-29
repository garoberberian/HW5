const express = require("express");
const fs = require("fs/promises");
const bodyParser = require("body-parser");
const cors = require('cors');
const tasksRoute = require("./routes/tasksRoute.js");

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/tasks", tasksRoute);

app.use((err, req, res, next) => {
  const status = err.statusCode ? err.statusCode : 500;
  res
    .status(status)
    .json({ message: status === 500 ? "something went wrong" : err.message });
});

app.listen(port, () => {
  console.log("listening to the server");
});

const shouldRemind = task => {
  return task.dueDateParsed - Date.now() < 120000 &&
        task.dueDateParsed - Date.now() > 0 &&
        !task.reminded &&
        !task.completed
}

setInterval( async () => {
  let data, dataStr;
  try {
    dataStr = await fs.readFile('./data.json');
    data = JSON.parse(dataStr)
  } catch(err) {
    console.log(err);
  }
  
  data.forEach(task => {
    if(shouldRemind(task) ) {
      console.log(`2 minutes left for ${task.title}`);
      task.reminded = true;
      fs.writeFile('./data.json', JSON.stringify(data, undefined, 2));
    }
  })

}, 2000);


