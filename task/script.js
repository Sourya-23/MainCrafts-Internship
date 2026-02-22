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