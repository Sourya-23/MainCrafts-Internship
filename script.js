document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        alert("All fields are required!");
        return;
      }

      const submission = { name, email, message };

      const existing = JSON.parse(localStorage.getItem("contacts")) || [];
      existing.push(submission);

      localStorage.setItem("contacts", JSON.stringify(existing));

      alert("Form submitted successfully!");

      form.reset();
    });
  }

  const listContainer = document.getElementById("submissionList");

  if (listContainer) {
    const submissions = JSON.parse(localStorage.getItem("contacts")) || [];

    if (submissions.length === 0) {
      listContainer.innerHTML = "<p>No submissions yet.</p>";
      return;
    }

    submissions.forEach((entry) => {
      const item = document.createElement("div");
      item.classList.add("submission-card");

      item.innerHTML = `
        <h3>${entry.name}</h3>
        <p><strong>Email:</strong> ${entry.email}</p>
        <p>${entry.message}</p>
      `;

      listContainer.appendChild(item);
    });
  }

});

// ================= TASK DASHBOARD =================

function initDashboard() {
  const addBtn = document.getElementById("addTaskBtn");
  if (!addBtn) return;

  addBtn.addEventListener("click", addTask);
  document.getElementById("searchBox").addEventListener("input", searchTasks);
  document.getElementById("filterBox").addEventListener("change", displayTasks);
  displayTasks();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (!text) return alert("Task cannot be empty!");

  const tasks = getTasks();

  tasks.push({
    id: Date.now(),
    name: text,
    completed: false
  });

  saveTasks(tasks);
  input.value = "";
  displayTasks();
}

function displayTasks() {
  const list = document.getElementById("taskList");
  if (!list) return;

  const tasks = getTasks();
  const filter = document.getElementById("filterBox")?.value || "all";

  list.style.opacity = "0.5";
  setTimeout(() => {
  list.style.opacity = "1";
  }, 100);
  list.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    list.innerHTML = "<p>No tasks found.</p>";
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="task-text ${task.completed ? "completed" : ""}">
        ${task.name}
      </span>

      <div>
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="editTask(${task.id})">✏</button>
        <button onclick="deleteTask(${task.id})">✖</button>
      </div>
    `;

    list.appendChild(li);
  });
}

function deleteTask(id) {
  const listItems = document.querySelectorAll("#taskList li");

  listItems.forEach(li => {
    if (li.innerHTML.includes(id)) {
      li.classList.add("removing");

      setTimeout(() => {
        const tasks = getTasks().filter(t => t.id !== id);
        saveTasks(tasks);
        displayTasks();
      }, 200);
    }
  });
}

function toggleTask(id) {
  const tasks = getTasks().map(t => {
    if (t.id === id) t.completed = !t.completed;
    return t;
  });

  saveTasks(tasks);
  displayTasks();
}

function editTask(id) {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);

  const updated = prompt("Edit task:", task.name);
  if (!updated) return;

  task.name = updated;
  saveTasks(tasks);
  displayTasks();
}

function searchTasks() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const items = document.querySelectorAll("#taskList li");

  items.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(query)
      ? ""
      : "none";
  });
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", initDashboard);

// Expose functions globally (for inline onclick)
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.editTask = editTask;