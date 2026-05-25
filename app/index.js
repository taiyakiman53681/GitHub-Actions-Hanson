const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let nextId = 2;

let tasks = [
  {
    id: 1,
    title: "DockerとTerraformを勉強する",
    done: false,
  },
];

app.get("/", (req, res) => {
  res.json({
    message: "Task API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "docker-lab",
  });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  res.json(task);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({
      error: "title is required",
    });
  }

  const task = {
    id: nextId,
    title,
    done: false,
  };

  nextId += 1;
  tasks.push(task);

  res.status(201).json(task);
});

app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  const { title, done } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string") {
      return res.status(400).json({
        error: "title must be a string",
      });
    }

    task.title = title;
  }

  if (done !== undefined) {
    if (typeof done !== "boolean") {
      return res.status(400).json({
        error: "done must be a boolean",
      });
    }

    task.done = done;
  }

  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const beforeLength = tasks.length;

  tasks = tasks.filter((task) => task.id !== id);

  if (tasks.length === beforeLength) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});