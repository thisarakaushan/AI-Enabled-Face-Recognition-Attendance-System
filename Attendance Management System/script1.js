document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners
  const buttons = document.querySelectorAll(".buttons button");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const method = this.textContent.trim();
      if (method === "Turn On Camera") {
        window.alert(
          "Please wait sometime for the Face Recognition Program to activate. It takes sometime. Please note that you have to press 'Esc' button to exit it."
        );
        // Send a request to the Flask API to run live_face_recognition_attendance.py
        runLiveFaceRecognition();
      } else if (method === "Upload an Image(s)") {
        window.alert(
          "Please wait sometime for the Face Recognition Program to activate. It takes sometime. Please note that you have to press 'Esc' button to exit it."
        );
        // Open file input dialog
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.id = "fileInput";
        fileInput.accept = "image/*";
        fileInput.multiple = true; //changed
        fileInput.addEventListener("change", function (event) {
          //   const selectedFile = event.target.files[0];
          const selectedFiles = event.target.files;
          // Send a request to the Flask API with the selected image
          runImageFaceRecognition(selectedFiles);
        });
        fileInput.click();
      }
    });
  });

  const submitButton = document.querySelector(".checkattendance button");
  submitButton.addEventListener("click", function () {
    const date = document.querySelector(".datepicking input").value;
    const fromTime = document.querySelector(".fromtimepicking input").value;
    const toTime = document.querySelector(".totimepicking input").value;
    // Send a request to the Flask API with date, from time, and to time parameters
    runAttendanceQuery(date, fromTime, toTime);
  });

  // Functions
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

  function runImageFaceRecognition(imageFiles) {
    // Create a FormData object to send the file
    const formData = new FormData();
    for (const file of imageFiles) {
      formData.append("images[]", file);
    }
    // formData.append("image", imageFiles);

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
    if (date == "" || fromTime == "" || toTime == "")
      window.alert("Please enter all the details");
    else {
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
  }

  function displayResult(results) {
    const resultsContainer = document.querySelector(".results");
    // Clear previous results
    resultsContainer.innerHTML = "";
    let counter = 0;
    var h3 = document.createElement("h3");
    var text = document.createTextNode("Students Attended");
    h3.appendChild(text);
    resultsContainer.appendChild(h3);
    // Display new results
    results.forEach((result) => {
      const listItem = document.createElement("div");
      if (!(result == "No Students Found")) {
        listItem.textContent = counter + 1 + ") " + result;
        counter = counter + 1;
      } else listItem.textContent = result;
      resultsContainer.appendChild(listItem);
    });
  }
});
