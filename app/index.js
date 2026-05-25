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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderTaskList(items) {
  return items
    .map((task) => {
      const status = task.done ? "done" : "open";
      return `<li><strong>${escapeHtml(task.title)}</strong> <span>(${status})</span></li>`;
    })
    .join("");
}

app.get("/", (req, res) => {
  res.json({
    message: "Task API is running",
  });
});

app.get("/ui", (req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Docker Lab</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        background: linear-gradient(135deg, #0f172a, #1e293b);
        color: #e2e8f0;
      }
      main {
        max-width: 720px;
        margin: 0 auto;
        padding: 48px 24px;
      }
      .card {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 12px 40px rgba(15, 23, 42, 0.35);
      }
      h1 {
        margin: 0 0 8px;
        font-size: 2rem;
      }
      p {
        margin: 0 0 20px;
        color: #cbd5e1;
      }
      ul {
        margin: 0;
        padding-left: 20px;
      }
      li {
        margin: 10px 0;
      }
      .badge {
        display: inline-block;
        margin-bottom: 16px;
        padding: 6px 10px;
        border-radius: 999px;
        background: #38bdf8;
        color: #082f49;
        font-size: 0.85rem;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <main>
      <section class="card">
        <div class="badge">Playwright demo</div>
        <h1>Docker Lab</h1>
        <p>GitHub Actions で画面テストを回すための最小 UI です。</p>
        <ul>
          ${renderTaskList(tasks)}
        </ul>
      </section>
    </main>
  </body>
</html>`);
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
