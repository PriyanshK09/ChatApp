const form = document.querySelector(".fields_container");
const submitButton = form.querySelector(".submit_button");

// * handling the api request
async function sendRequestToServer(e) {
  e.preventDefault();
  // make sure when the response is sent, the user can't send the response again and again till the previous response is end
  submitButton.setAttribute("disabled", "");

  // remove all the error placeholders if no error exists with the corresponding field
  const errorPlaceholders = document.querySelectorAll("p.error");
  errorPlaceholders.forEach((errorPlaceholder) => (errorPlaceholder.style.display = "none"));

  // remove all the error styles from the input's
  const inputErrors = document.querySelectorAll("input.error_input");
  inputErrors.forEach((inputError) => inputError.classList.remove("error_input"));

  const formData = new FormData(form);

  // send request
  const res = await fetch("/signup", {
    method: "POST",
    body: formData,
  });
  const { errors, message } = await res.json();

  if (errors) {
    submitButton.removeAttribute("disabled");

    Object.keys(errors).forEach((fieldName) => {
      const errorDomElement = document.querySelector(`.${fieldName}_error`);

      // show up the error and add styles
      form[fieldName].classList.add("error_input");
      errorDomElement.textContent = errors[fieldName].msg;
      errorDomElement.style.display = "block";
    });
  } else {
    Swal.fire({ position: "center", icon: "success", title: message, showConfirmButton: false, timer: 1500 });
    document.querySelectorAll("p.error").forEach((p) => (p.style.display = "none"));
    setTimeout(() => {
      window.location.replace("/inbox");
    }, 1500);
  }
}

form.addEventListener("submit", sendRequestToServer);
