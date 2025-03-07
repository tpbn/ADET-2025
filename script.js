document.getElementById("subjectsButton").addEventListener("click", function () {
    let container = document.getElementById("subjectsContainer");

    // Show container if already loaded
    if (container.innerHTML.trim() !== "") {
        container.classList.remove("hidden");
        return;
    }

    // Fetch 
    fetch("https://tpbn.github.io/ADET-2025/courses.json")
        .then(response => response.json())
        .then(data => {
            displaySubjects(data.courses);
            container.classList.remove("hidden");
        })
        .catch(error => console.error("❌ Error fetching JSON:", error));
});

function displaySubjects(coursesArray) {
    let container = document.getElementById("subjectsContainer");
    container.innerHTML = ""; // Clear previous content

    let groupedSubjects = {};

    // Group subjects by year level and semester
    coursesArray.forEach(subject => {
        let key = `${subject.year_level} - ${subject.sem}`;
        if (!groupedSubjects[key]) {
            groupedSubjects[key] = [];
        }
        groupedSubjects[key].push(subject);
    });

    // Create card container
    let card = document.createElement("div");
    card.classList.add("card");

    Object.keys(groupedSubjects).forEach((group, index) => {
        let groupDiv = document.createElement("div");
        groupDiv.classList.add("subject-group");

        // separator
        if (index > 0) {
            let separator = document.createElement("hr");
            separator.classList.add("separator");
            card.appendChild(separator);
        }

        let groupTitle = document.createElement("h3");
        groupTitle.textContent = group;
        groupTitle.classList.add("group-title");
        groupDiv.appendChild(groupTitle);

        let subjectContainer = document.createElement("div");
        subjectContainer.classList.add("subject-container");

        groupedSubjects[group].forEach(sub => {
            let subjectDiv = document.createElement("div");
            subjectDiv.classList.add("subject-item");
            subjectDiv.innerHTML = `
                <div class="subject-content">
                    <span class="subject-code">${sub.code}</span>
                    <span class="subject-description">${sub.description}</span>
                    <span class="subject-units">${sub.credit} units</span>
                </div>
            `;
            subjectContainer.appendChild(subjectDiv);
        });

        groupDiv.appendChild(subjectContainer);
        card.appendChild(groupDiv);
    });

    // hide subject
    let hideButton = document.createElement("button");
    hideButton.textContent = "Hide Subjects";
    hideButton.classList.add("hide-button");
    hideButton.addEventListener("click", () => container.classList.add("hidden"));

    container.appendChild(card);
    container.appendChild(hideButton);
}

// search for a course
document.getElementById("searchBar").addEventListener("input", searchSubjects);

function searchSubjects() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    document.querySelectorAll(".subject-item").forEach(item => {
        let subjectCode = item.querySelector(".subject-code").textContent.toLowerCase();
        let subjectDesc = item.querySelector(".subject-description").textContent.toLowerCase();

        item.style.display = subjectCode.includes(input) || subjectDesc.includes(input) ? "block" : "none";
    });
}
