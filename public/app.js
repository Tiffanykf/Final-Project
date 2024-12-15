window.addEventListener('load', () => {

  console.log("Client side js is loaded!");

    //Show story form if story house is clicked. I was having a hard time with this form toggling, so ChatGPT helped suggest console logs to see where in the process it stopped functioning.
    AFRAME.registerComponent("storyhouse-click", {
      init: function () {
        this.el.addEventListener("click", () => {
          console.log("storyhouse clicked");
          let storyForm = document.getElementById("storyForm");
          if (storyForm) {
            storyForm.style.display =
              storyForm.style.display === "none" ||
              storyForm.style.display === ""
                ? "block"
                : "none";
            console.log(
              "Toggled storyForm visibility:",
              storyForm.style.display
            );
          } else {
            console.error("storyForm element not found");
          }
        });
      },
    });

    //Show uploaded stories on click
    AFRAME.registerComponent("stories", {
      schema: {
        story_tale: { type: "string", default: "I love Jackson Heights" },
        story_by: { type: "string", default: "a Jackson Heights Local" },
      },
      init: function () {
        this.el.addEventListener("click", () => {
          let storyText = this.el.querySelector(".story-text");

          if (storyText) {
            // If story-text exists, toggle visibility
            let isVisible = storyText.getAttribute("visible");
            storyText.setAttribute("visible", !isVisible); // Toggle visibility

            // Align with the camera when made visible
            if (!isVisible) {
              this.alignWithCamera(storyText);
            }
          } else {
            // If story-text doesn't exist, create and show it
            storyText = document.createElement("a-text");
            storyText.setAttribute(
              "value",
              this.data.story_tale + " by " + this.data.story_by
            );
            storyText.setAttribute("position", "-1 2.7 .5");
            storyText.setAttribute("color", "black");
            storyText.setAttribute("width", "6");
            storyText.classList.add("story-text");

            // Align with the camera initially
            this.alignWithCamera(storyText);

            // Append the text element as a child of the entity
            this.el.appendChild(storyText);
          }
        });
      },
      alignWithCamera: function (storyText) {
        // Ensure the text aligns with the current camera position
        let camera = this.el.sceneEl.camera;
        let cameraWorldPos = new THREE.Vector3();
        camera.getWorldPosition(cameraWorldPos); // Get the camera's world position

        // Make the storyText face the camera
        let object3D = storyText.object3D;
        object3D.lookAt(cameraWorldPos);
      },
    });

    //Form submission
      let cursor = document.querySelector("#cursorSphere");

      // Add event listeners to clickable objects
      document.querySelectorAll(".clickable").forEach((clickable) => {
        clickable.addEventListener("mouseenter", () => {
          cursor.setAttribute("material", "color", "#FFF44F"); // Change to red on hover
        });

        clickable.addEventListener("mouseleave", () => {
          cursor.setAttribute("material", "color", "#d8b9ff"); // Reset to original color
        });
      });

      document
      .getElementById("storyForm")
      .addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent page reload
        let storyInput = document.getElementById("storyInput").value.trim();
        let storyAuthor = document.getElementById("storyAuthor").value.trim();
        let storyPlace = document.getElementById("storyPlace").value.trim();
    
        if (storyInput && storyAuthor && storyPlace) {
          try {
            // Send the story to the server
            let response = await fetch("/submit-story", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ 
                story: storyInput,
                author: storyAuthor,
                place: storyPlace,
               }),
            });
    
            if (response.ok) {
              let result = await response.json();
              alert(`Story submitted successfully: ${result.message}`);
              document.getElementById("storyForm").style.display = "none";
              document.getElementById("storyInput").value = ""; // Clear the input
              document.getElementById("storyAuthor").value = "";
              document.getAnimations("storyPlace").value = "";
            } else {
              alert("Failed to submit the story. Please try again.");
            }
          } catch (error) {
            console.error("Error submitting story:", error);
            alert("An error occurred while submitting your story.");
          }
        } else {
          alert("Please fill out all fields before submitting. Write N/A if not applicable.");
        }
      });
    

        let welcomeInstructions = document.getElementById("welcomeInstructions");
        let closeInfo = document.getElementById("closeInfo");
        let infoBox = document.getElementById("infoBox");

        // Close the info screen when "Got it!" button is clicked
        closeInfo.addEventListener("click", () => {
          welcomeInstructions.style.display = "none";
        });

        // Show the screen again when the info box is clicked
        AFRAME.registerComponent("info-box-click", {
          init: function () {
            this.el.addEventListener("click", () => {
              welcomeInstructions.style.display = "block";
            });
          },
        });

        // Add the component to the info box
        infoBox.setAttribute("info-box-click", "");
});
