document.addEventListener("DOMContentLoaded", function () {
  const captureButton = document.getElementById("captureButton");
  const uploadImageButton = document.getElementById("uploadImageButton");
  const dateButton = document.getElementById("dateButton");
  const fromTimeButton = document.getElementById("fromTimeButton");
  const toTimeButton = document.getElementById("toTimeButton");
  const dateInput = document.getElementById("dateInput");
  const fromTimeInput = document.getElementById("fromTimeInput");
  const toTimeInput = document.getElementById("toTimeInput");
  const submitButton = document.getElementById("submitButton");
  const clearButton = document.getElementById("clearButton");
  const resultList = document.getElementById("resultList");

  captureButton.addEventListener("click", function () {
    window.alert(
      "Please wait sometime for the Face Recognition Program to activate. It takes sometime. Please note that you have to press 'Esc' button to exit it."
    );
    // Send a request to the Flask API to run live_face_recognition_attendance.py
    runLiveFaceRecognition();
  });

  uploadImageButton.addEventListener("click", function () {
    window.alert(
      "Please wait sometime for the Face Recognition Program to activate. It takes sometime. Please note that you have to press 'Esc' button to exit it."
    );
    // Open file input dialog
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", function (event) {
      const selectedFile = event.target.files[0];
      // Send a request to the Flask API with the selected image
      runImageFaceRecognition(selectedFile);
    });
    fileInput.click();
  });

  dateButton.addEventListener("click", function () {
    // Set date input to visible and trigger click
    dateInput.style.display = "block";
    dateInput.click();
  });

  fromTimeButton.addEventListener("click", function () {
    // Set from time input to visible and trigger click
    fromTimeInput.style.display = "block";
    fromTimeInput.click();
  });

  toTimeButton.addEventListener("click", function () {
    // Set to time input to visible and trigger click
    toTimeInput.style.display = "block";
    toTimeInput.click();
  });

  // Handle input changes
  dateInput.addEventListener("change", function () {
    dateButton.textContent = dateInput.value;
    dateInput.style.display = "none"; // Hide the input after selection
  });

  fromTimeInput.addEventListener("change", function () {
    fromTimeButton.textContent = fromTimeInput.value;
    fromTimeInput.style.display = "none"; // Hide the input after selection
  });

  toTimeInput.addEventListener("change", function () {
    toTimeButton.textContent = toTimeInput.value;
    toTimeInput.style.display = "none"; // Hide the input after selection
  });

  submitButton.addEventListener("click", function () {
    // Get the date, from time, and to time inputs
    const date = dateInput.value;
    const fromTime = fromTimeInput.value;
    const toTime = toTimeInput.value;

    // Send a request to the Flask API with date, from time, and to time parameters
    runAttendanceQuery(date, fromTime, toTime);
  });
  clearButton.addEventListener("click", function () {
    dateButton.textContent = "Enter the date";
    fromTimeButton.textContent = "Enter the From Time";
    toTimeButton.textContent = "Enter the To Time";
    resultList.innerHTML = "";
  });

  function runLiveFaceRecognition() {
    // Make a Fetch API request to the Flask API
    fetch("http://localhost:5000/run_live_face_recognition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => displayResult(data.results))
      .catch((error) => console.error("Error:", error));
  }

  function runImageFaceRecognition(imageFile) {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("image", imageFile);

    // Make a Fetch API request to the Flask API
    fetch("http://localhost:5000/run_image_face_recognition", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => displayResult(data.results))
      .catch((error) => console.error("Error:", error));
  }

  function runAttendanceQuery(date, fromTime, toTime) {
    // Make a Fetch API request to the Flask API with date, from time, and to time parameters
    fetch(
      `http://localhost:5000/query_attendance?date=${date}&fromTime=${fromTime}&toTime=${toTime}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => displayResult(data.results))
      .catch((error) => console.error("Error:", error));
  }

  function displayResult(results) {
    // Clear previous results
    resultList.innerHTML = "";

    // Display new results
    results.forEach((result) => {
      const listItem = document.createElement("li");
      listItem.textContent = result;
      resultList.appendChild(listItem);
    });
  }
});
