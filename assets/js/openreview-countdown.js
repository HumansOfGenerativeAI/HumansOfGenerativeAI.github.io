(function () {
  var countdown = document.querySelector("[data-openreview-countdown]");

  if (!countdown) {
    return;
  }

  var cta = countdown.closest("[data-submission-deadline]");
  var deadlineValue = cta && cta.getAttribute("data-submission-deadline");
  var deadlineMs = deadlineValue ? Date.parse(deadlineValue) : NaN;

  if (!Number.isFinite(deadlineMs)) {
    return;
  }

  var daysValue = countdown.querySelector("[data-countdown-days]");
  var hoursValue = countdown.querySelector("[data-countdown-hours]");
  var minutesValue = countdown.querySelector("[data-countdown-minutes]");
  var secondsValue = countdown.querySelector("[data-countdown-seconds]");
  var label = countdown.querySelector("[data-countdown-label]");
  var status = countdown.querySelector("[data-countdown-status]");
  var secondMs = 1000;
  var minuteMs = 60 * secondMs;
  var hourMs = 60 * minuteMs;
  var dayMs = 24 * hourMs;
  var timerId = null;

  if (!daysValue || !hoursValue || !minutesValue || !secondsValue || !label || !status) {
    return;
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function renderCountdown() {
    var remainingMs = deadlineMs - Date.now();

    if (remainingMs <= 0) {
      daysValue.textContent = "00";
      hoursValue.textContent = "00";
      minutesValue.textContent = "00";
      secondsValue.textContent = "00";
      label.textContent = "Submission status";
      status.textContent = "Submission deadline passed.";
      countdown.setAttribute("aria-label", "Submission deadline passed.");
      countdown.classList.add("is-complete");
      countdown.hidden = false;

      if (timerId !== null) {
        window.clearTimeout(timerId);
      }

      return;
    }

    var totalSeconds = Math.floor(remainingMs / secondMs);
    var days = Math.floor(totalSeconds / (24 * 60 * 60));
    var hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    var minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    var seconds = totalSeconds % 60;

    daysValue.textContent = pad(days);
    hoursValue.textContent = pad(hours);
    minutesValue.textContent = pad(minutes);
    secondsValue.textContent = pad(seconds);
    label.textContent = "Time remaining";
    status.textContent = "Time remaining until the submission deadline.";
    countdown.setAttribute("aria-label", "Time remaining: " + days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds.");
    countdown.classList.remove("is-complete");
    countdown.hidden = false;

    var nextTickDelay = secondMs - (Date.now() % secondMs);
    timerId = window.setTimeout(renderCountdown, nextTickDelay || secondMs);
  }

  renderCountdown();
})();
