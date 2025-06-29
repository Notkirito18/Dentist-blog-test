//---------------------------------------------------
//---------------------------------------------------
// APPOIINTMENT FORM

$(document).ready(function () {
  //* appointment Form
  const appointmentForm = $("#appointment-form");
  const appointmentFormHero = $("#appointment-form-hero");

  const appointmentFormSubmit = $("#appointment-submit-btn");
  const appointmentFormSubmitHero = $("#appointment-hero-submit-btn");

  // 1) Disable past dates in the native date picker
  const dateInput = $("input[type='date']");
  const todayISO = new Date().toISOString().split("T")[0];
  dateInput.attr("min", todayISO);

  // 2) Snap any entered time up to the next half‑hour
  const timeInput = $("input[type='time']");
  timeInput.on("blur change", function () {
    if (!this.value) return;
    let [h, m] = this.value.split(":").map(Number);
    const total = h * 60 + m;
    let snapped = Math.ceil(total / 30) * 30;
    if (snapped >= 24 * 60) snapped = 23 * 60 + 30;

    const nh = String(Math.floor(snapped / 60)).padStart(2, "0");
    const nm = String(snapped % 60).padStart(2, "0");
    this.value = `${nh}:${nm}`;
  });

  // Reset previous error messages and reset form
  resetErrorMessages();
  appointmentForm.trigger("reset");
  appointmentFormHero.trigger("reset");

  // Add event listener for form submission
  appointmentFormSubmit.on("click", (e) => {
    e.preventDefault(); // Just in case
    appointmentFormSubmission(appointmentForm, false);
  });
  appointmentFormSubmitHero.on("click", (e) => {
    e.preventDefault(); // Just in case
    appointmentFormSubmission(appointmentFormHero, true);
  });

  appointmentFormSubmission = (form, isHeroForm) => {
    console.log("clicked submit", form, isHeroForm);

    // variables
    var nameValue = $("#name-input").val();
    var emailValue = $("#email-input").val();
    var phoneValue = $("#phone-input").val();
    var dateValue = $("#date-input").val();
    var timeValue = $("#time-input").val();
    // errors
    var nameError = $("#name-error");
    var emailError = $("#email-error");
    var phoneError = $("#phone-error");
    var dateError = $("#date-error");
    var timeError = $("#time-error");

    if (isHeroForm) {
      // variables
      nameValue = $("#name-hero-input").val();
      emailValue = $("#email-hero-input").val();
      phoneValue = $("#phone-hero-input").val();
      dateValue = $("#date-hero-input").val();
      timeValue = $("#time-hero-input").val();
      // errors
      nameError = $("#name-hero-error");
      emailError = $("#email-hero-error");
      phoneError = $("#phone-hero-error");
      dateError = $("#date-hero-error");
      timeError = $("#time-hero-error");
    }

    var formIsValid = true;

    // Reset previous error messages
    resetErrorMessages();

    // Name validation
    if (nameValue.length < 2) {
      nameError.text("Name must be at least 2 characters");
      nameError.css("display", "block");
      formIsValid = false;
    }

    // Email and phone validation using regular expressions
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phonePattern = /^\+?[0-9]+$/;

    var isEmailValid = emailValue.match(emailPattern);
    var isPhoneValid = phoneValue.length >= 8 && phoneValue.match(phonePattern);

    // Check if at least one valid contact method is provided
    if (!isEmailValid && !isPhoneValid) {
      emailError.text("Please enter a valid email or phone number.");
      emailError.css("display", "block");
      phoneError.text("Please enter a valid email or phone number.");
      phoneError.css("display", "block");
      formIsValid = false;
    } else {
      // Show specific error only if one is present but invalid
      if (emailValue.length > 0 && !isEmailValid) {
        emailError.text("Invalid email format");
        emailError.css("display", "block");
        formIsValid = false;
      }
      if (phoneValue.length > 0 && !isPhoneValid) {
        phoneError.text("Enter a valid phone number or leave empty");
        phoneError.css("display", "block");
        formIsValid = false;
      }
    }

    // --- DATE validation ---
    if (!dateValue) {
      dateError.text("Date is required").css("display", "block");
      formIsValid = false;
    } else {
      const selectedDate = new Date(dateValue); // "yyyy-mm-dd" → Date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // strip time

      if (selectedDate <= today) {
        dateError.text("Please select a future date").css("display", "block");
        formIsValid = false;
      }
    }

    // --- TIME validation ---
    if (!timeValue) {
      timeError.text("Time is required").css("display", "block");
      formIsValid = false;
    } else if (formIsValid) {
      // only if date passed
      const [h, m] = timeValue.split(":").map(Number);
      const totalMinutes = h * 60 + m;

      const selectedDate = new Date(dateValue);
      const dow = selectedDate.getDay(); // 0=Sun,...,6=Sat
      let weekDay = "Monday - Friday";

      let minMins, maxMins;
      if (dow >= 1 && dow <= 5) {
        // Mon–Fri
        minMins = 8 * 60;
        maxMins = 19 * 60;
      } else if (dow === 6) {
        // Sat
        minMins = 10 * 60;
        maxMins = 17 * 60;
        weekDay = "Saturday";
      } else {
        // Sun
        minMins = 10 * 60;
        maxMins = 14 * 60;
        weekDay = "Sunday";
      }

      if (totalMinutes < minMins || totalMinutes > maxMins) {
        const fmt = (mins) => {
          const H = String(Math.floor(mins / 60)).padStart(2, "0");
          const M = String(mins % 60).padStart(2, "0");
          return `${H}:${M}`;
        };
        timeError
          .text(
            `Please select a time between ${fmt(minMins)} and ${fmt(
              maxMins
            )} for ${weekDay}.`
          )
          .css("display", "block");
        formIsValid = false;
      }
    }

    // Prevent form submission if validation fails
    if (formIsValid) {
      $.ajax({
        url: form.attr("action"),
        method: form.attr("method"),
        data: form.serialize(),
        success: () => {
          // show the notification
          $("#success-notif")
            .fadeIn(300)
            // after 1.5s, fade out & reload
            .delay(1500)
            .fadeOut(300, () => {
              window.scrollTo(0, 0);
            });
          $("#modalRequest").modal("hide");
          form.trigger("reset");
        },
        error: () => {
          $("#modalRequest").modal("hide");
          // you can handle errors here if you want
          alert("Something went wrong. Please try again.");
        },
      });
    }
  };

  $("#modalRequest").on("hidden.bs.modal", function () {
    appointmentForm.trigger("reset");
    resetErrorMessages();
  });
});

resetErrorMessages = () => {
  const messages = document.getElementsByClassName("error-msg");
  if (messages && messages.length > 0) {
    Array.from(messages).forEach((element) => {
      element.style.display = "none";
    });
  }
};

//---------------------------------------------------
//---------------------------------------------------
// CONTACT FORM

$(document).ready(function () {
  const contactForm = $("#contact-form");
  const contactSubmitBtn = $("#contact-submit-btn");

  // Reset any error messages
  resetErrorMessages();

  // Reset form on load
  contactForm.trigger("reset");

  contactSubmitBtn.on("click", function (e) {
    e.preventDefault();

    const nameValue = $("#name-contact-input").val().trim();
    const emailValue = $("#email-contact-input").val().trim();
    const subjectValue = $("#subject-contact-input").val().trim();
    const messageValue = $("#message-contact-input").val().trim();

    const nameError = $("#name-contact-error");
    const emailError = $("#email-contact-error");
    const subjectError = $("#subject-contact-error");
    const messageError = $("#message-contact-error");

    let formIsValid = true;

    resetErrorMessages();

    // Validate name
    if (nameValue.length < 2) {
      nameError.text("Name must be at least 2 characters");
      nameError.css("display", "block");
      formIsValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue || !emailPattern.test(emailValue)) {
      emailError.text("Please enter a valid email address");
      emailError.css("display", "block");
      formIsValid = false;
    }

    // Validate subject
    if (subjectValue.length < 8) {
      subjectError.text("Subject must be at least 8 characters");
      subjectError.css("display", "block");
      formIsValid = false;
    }

    // Validate message
    if (messageValue.length < 20) {
      messageError.text("Message must be at least 20 characters");
      messageError.css("display", "block");
      formIsValid = false;
    }

    // If form is valid, submit via AJAX
    if (formIsValid) {
      $.ajax({
        url: contactForm.attr("action"),
        method: contactForm.attr("method"),
        data: contactForm.serialize(),
        success: () => {
          contactForm.trigger("reset");
          $("#contact-success-notif")
            .fadeIn(300)
            // after 1.5s, fade out & reload
            .delay(1500)
            .fadeOut(300, () => {
              window.scrollTo(0, 0);
            });
        },
        error: () => {
          alert("Something went wrong. Please try again later.");
        },
      });
    }
  });
});

//---------------------------------------------------
//---------------------------------------------------
// NEWSLETTER SUBSCRIBE FORM

$(document).ready(function () {
  const subscribeForm = $("#subscribe-form");
  const subscribeSubmitBtn = $("#subscribe-submit-btn");

  // Reset any error messages
  resetErrorMessages();

  // Reset form on load
  subscribeForm.trigger("reset");

  subscribeSubmitBtn.on("click", function (e) {
    e.preventDefault();
    const emailValue = $("#email-subscribe-input").val().trim();
    const emailError = $("#email-subscribe-error");

    let formIsValid = true;

    resetErrorMessages();

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue || !emailPattern.test(emailValue)) {
      emailError.text("Please enter a valid email address");
      emailError.css("display", "block");
      formIsValid = false;
    }

    // If form is valid, submit via AJAX
    if (formIsValid) {
      $.ajax({
        url: subscribeForm.attr("action"),
        method: subscribeForm.attr("method"),
        data: subscribeForm.serialize(),
        success: () => {
          subscribeForm.trigger("reset");
          $("#subscribe-success-notif")
            .fadeIn(300)
            // after 1.5s, fade out & reload
            .delay(1500)
            .fadeOut(300, () => {
              window.scrollTo(0, 0);
            });
        },
        error: () => {
          alert("Something went wrong. Please try again later.");
        },
      });
    }
  });
});
