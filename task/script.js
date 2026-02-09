function validateForm() {
  const name = document.forms["contactForm"]["name"].value.trim();
  const email = document.forms["contactForm"]["email"].value.trim();

    if (name === "" || email === "") {
    alert("Name and Email must be filled out!");
    return false;
    }

    alert("Thank you! Your message has been submitted.");
    return true;
}