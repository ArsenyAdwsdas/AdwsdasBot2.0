// client-side js
// run by the browser each time your view template referencing it is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsForm = document.forms[0];
const code = dreamsForm.elements["code"];
const mode = dreamsForm.elements["mode"];
const dreamsList = document.getElementById("dreams");

// listen for the form to be submitted and add a new dream when it is
dreamsForm.onsubmit = event => {
  // stop our form submission from refreshing the page
  event.preventDefault();
  console.log(mode.value)
  console.log(code.value)

  const data = { code: code.value, mode: mode.value };

  fetch("/addDream", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(response => {
      console.log(JSON.stringify(response));
    });
};
