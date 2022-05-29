const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

exports.create = async (req, res, next) => {
  let dataStr, data;

  const task = {
    ...req.body,
    id: uuidv4(),
    reminded: false,
    dueDateParsed: Date.parse(req.body.dueDate)
  };

  try {
    dataStr = await fs.readFile("./data.json", "utf8");
    data = JSON.parse(dataStr);
  } catch (e) {
    next({ statusCode: 400, message: "bad request" });
  }

  const arr = [];
  arr.push(...data, task);
  fs.writeFile("./data.json", JSON.stringify(arr, undefined, 2));
};

exports.read = async (req, res, next) => {
  try {
    const dataStr = await fs.readFile("./data.json", "utf8");
    res.send(dataStr);
  } catch (e) {
    next({ statusCode: 400, message: "bad request" });
  }
};

exports.update = async (req, res, next) => {
  const data = JSON.parse(await fs.readFile("./data.json", "utf8"));
  const index = data.findIndex((task) => task.id === req.params.id);

  data[index].completed = req.body.completed;

  fs.writeFile("./data.json", JSON.stringify(data, undefined, 2));
  res.json({ error: false, message: "task successfully updated" });
};

exports.delete = async (req, res, next) => {
  let data = JSON.parse(await fs.readFile("./data.json", "utf8"));
  const index = data.findIndex(task => task.id === req.params.id);
  
  data.splice(index, 1);

  fs.writeFile("./data.json", JSON.stringify(data, undefined, 2));

  res.json({ error: false, message: "task successfully deleted" });

};
