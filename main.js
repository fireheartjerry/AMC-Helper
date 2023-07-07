// ==UserScript==
// @name         AMC 8/10/12 Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Solve AMC 8/10/12 questions inside AOPS website and get score and results calculated.
// @author       fireheartjerry
// @match        https://artofproblemsolving.com/wiki/index.php/*Problems
// @icon         https://i0.wp.com/maa-amc.org/wp-content/uploads/2020/09/cropped-LOGO-Large-transparent.png?fit=512%2C512&ssl=1
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const answerchoices = {
        1: 'No answer',
        2: 'A',
        3: 'B',
        4: 'C',
        5: 'D',
        6: "E"
    };

    async function getAnswers() {
        try {
            const response = await fetch(window.location.href.replace("Problems", "Answer_Key"));
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const answerElements = doc.querySelectorAll("li");

            const answers = Array.from(answerElements).map(element => element.textContent.trim());
            return answers;
        } catch (error) {
            throw new Error("Error retrieving answer key: " + error);
        }
    }

    // Create the sidebar element
    const sidebar = document.createElement("div");
    sidebar.id = "answerSelector";
    sidebar.textContent = "Answer Selector";

    // Apply styles to the sidebar
    sidebar.style.position = "fixed";
    sidebar.style.top = "0";
    sidebar.style.left = "0";
    sidebar.style.width = "190px";
    sidebar.style.height = "12vh";
    sidebar.style.backgroundColor = "#009FAD";
    sidebar.style.color = "white";
    sidebar.style.padding = "5px";
    sidebar.style.zIndex = "1";
    sidebar.style.opacity = "0.1";
    sidebar.style.font = "Arial";
    sidebar.style.fontWeight = "bold"; // Make text bold
    sidebar.style.fontSize = "20px"; // Set font size
    sidebar.style.textAlign = "center";
    sidebar.style.overflow = "auto";

    const header = document.createElement("div");
    header.textContent = "Hover over the left sidebar to select answers. Press start to expand sidebar.";
    header.style.position = "fixed";
    header.style.top = "0px";
    header.style.width = "100%";
    header.style.height = "50px";
    header.style.backgroundColor = "orange";
    header.style.color = "black";
    header.style.padding = "10px";
    header.style.zIndex = "9999";
    header.style.opacity = "1";
    header.style.fontSize = "20px";
    header.style.textAlign = "center";
    header.style.fontWeight = "bold";

    const start = document.createElement("button");
    start.textContent = "Start";
    start.style.position = "sticky";
    start.style.right = "110px";
    start.style.marginTop = "10px";
    start.style.marginLeft = "7px";
    start.style.fontSize = "15px";
    start.style.color = "white";
    start.style.border = "none";
    start.style.backgroundColor = "#1B365D";
    start.style.padding = "6px 17px";
    start.style.fontFamily = "Arial";
    start.style.fontWeight = "bold";

    const stop = document.createElement("button");
    stop.textContent = "Stopped";
    stop.style.position = "sticky";
    stop.style.right = "7px";
    stop.style.marginTop = "10px";
    stop.style.marginLeft = "10px";
    stop.style.fontSize = "15px";
    stop.style.color = "#CCCCCC";
    stop.style.border = "none";
    stop.style.backgroundColor = "#8F8F8F";
    stop.style.padding = "6px 6px";
    stop.style.fontFamily = "Arial";
    stop.style.fontWeight = "bold";
    stop.style.cursor = "not-allowed";

    const showHide = document.createElement("button");
    showHide.textContent = "Expand";
    showHide.style.position = "sticky";
    showHide.style.backgroundColor = "#1B365D";
    showHide.style.color = "white";
    showHide.style.padding = "6px 16px";
    showHide.style.border = "none";
    showHide.style.fontSize = "25px";
    showHide.style.fontWeight = "bold";
    showHide.style.fontFamily = "Arial";
    showHide.style.cursor = "pointer";
    showHide.style.marginTop = "10px";
    showHide.style.marginBottom = "7px";

    const timer = document.createElement("span");
    timer.textContent = "00:00:02";
    timer.style.fontWeight = "bold";
    timer.style.display = "block";
    timer.style.textAlign = "center";
    timer.style.color = "white";
    timer.style.marginTop = "10px";
    timer.style.marginBottom = "2px";
    timer.style.fontSize = "30px";
    timer.style.opacity = "1";
    timer.style.zIndex = "10";

    let selectors = [], userAnswerChoices = Array(25).fill("No answer");
    for (let i = 0; i < 25; i++) {
        const selectContainer = document.createElement("div");
        selectContainer.setAttribute("id", "selectContainer")
        selectContainer.style.display = "flex";
        selectContainer.style.align = "center";
        selectContainer.style.borderBottom = `3px solid white`;

        const select = document.createElement("select");
        select.setAttribute("id", "select-question");
        select.addEventListener("change", function() { userAnswerChoices[i] = answerchoices[select.value]; }); // Add event listener with index
        for (let choice in answerchoices) {
            const option = document.createElement("option");
            option.setAttribute("id", "option-select")
            option.value = choice;
            option.text = answerchoices[choice];
            select.appendChild(option);
        }

        const label = document.createElement("span");
        label.setAttribute("id", "question-number");
        label.textContent = (i + 1).toString().padStart(2, "0");
        label.style.color = "white";
        label.style.fontWeight = "bold";
        label.style.fontSize = "16px";
        label.style.marginTop = "10px";
        label.style.marginLeft = "10px";

        select.style.marginTop = "8px";
        select.style.padding = "4px 9px";
        select.style.fontSize = "15px";
        select.style.backgroundColor = "#1B365D";
        select.style.border = "1px solid white";
        select.style.borderRadius = "5px";
        select.style.color = "white";
        select.style.fontFamily = "Arial, sans-serif";
        select.style.fontWeight = "bold";
        select.style.marginLeft = "15px";
        select.style.marginBottom = "8px";
        select.style.cursor = "pointer";

        selectContainer.appendChild(label);
        selectContainer.appendChild(select);
        selectors.push(selectContainer);
    }

    function calcTime() {
        const contest = parseInt(String(window.location.href).split("/").pop().slice(9, -9).replace(/[a-zA-Z]/g, ""));
        if (contest == 8) {
            return "00:40:00";
        } else if (contest == 10 || contest == 12) {
            return "01:15:00";
        }
    }

    function startTimer() {
        const contestTime = timer.textContent;
        const [hours, minutes, seconds] = contestTime.split(":").map(Number);

        // Convert the total contest time to seconds
        let totalSeconds = (hours*3600)+(minutes*60)+seconds, stopped = false;

        // Update the timer display initially
        requestAnimationFrame(() => {
            timer.textContent = formatTime(hours, minutes, seconds);
            timer.style.color = "#ff0000";
            start.textContent = "Started";
            start.style.fontSize = "15px";
            start.style.padding = "6px 8px";
            start.style.right = "100px";
            start.style.backgroundColor = "#8F8F8F";
            start.style.color = "#CCCCCC";
            start.style.cursor = "not-allowed";
            stop.textContent = "Stop";
            stop.style.padding = "6px 17px";
            stop.style.backgroundColor = "#1B365D";
            stop.style.color = "white";
            stop.style.cursor = "pointer";
        });

        start.addEventListener("mouseover", function() { requestAnimationFrame(() => {this.style.backgroundColor = (stopped) ? "#135B7B" : "#8F8F8F"; });});
        start.addEventListener("mouseout", function() { requestAnimationFrame(() => {this.style.backgroundColor = (stopped) ? "#1B365D" : "#8F8F8F"; });});

        // Set an interval to update the timer display every second
        const interval = setInterval(() => {
            timer.style.color = "#98FA98";
            stop.addEventListener("click", function() { stopped = true; });
            totalSeconds--;

            // Check if the timer has reached zero
            if (totalSeconds < 0 || stopped) {
                if (!stopped) timer.textContent = "00:00:00";
                if (window.confirm("Time is up! Do you want to grade your answers (OK), or continue working (Cancel).")) {
                    getAnswers()
                        .then(answers => {
                        const message = `${answers.join(", ")} ----- ${userAnswerChoices.join(", ")}`;
                        alert(message);
                    })
                        .catch(error => {
                        alert(`An error occurred: ${error}`);
                    });
                } else {
                    alert("Feel free to continue working.")
                }
                clearInterval(interval);
                requestAnimationFrame(() => {
                    timer.textContent = calcTime();
                    timer.style.color = "white";
                    stop.textContent = "Stopped";
                    stop.style.backgroundColor = "#8F8F8F";
                    stop.style.color = "#CCCCCC";
                    stop.style.cursor = "not-allowed";
                    stop.style.padding = "6px 6px";
                    start.textContent = "Start";
                    start.style.backgroundColor = "#1B365D";
                    start.style.color = "white";
                    start.style.right = "110px";
                    start.style.cursor = "pointer";
                    start.style.marginTop = "10px";
                    start.style.marginLeft = "7px";
                    start.style.fontSize = "15px";
                    start.style.padding = "6px 17px";
                });
                if (!stopped) stopped = true;
                return;
            }

            // Calculate the remaining hours, minutes, and seconds
            const remainingHours = Math.floor(totalSeconds / 3600);
            const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
            const remainingSeconds = totalSeconds % 60;

            // Update the timer display
            timer.textContent = formatTime(remainingHours, remainingMinutes, remainingSeconds);
        }, 1000); // Update every second

        // Function to format the time as HH:MM:SS
        function formatTime(hours, minutes, seconds) {
            return (
                String(hours).padStart(2, "0") +
                ":" +
                String(minutes).padStart(2, "0") +
                ":" +
                String(seconds).padStart(2, "0")
            );
        }

        if (stopped) {
            return;
        }
    }

    start.addEventListener("mouseover", function() {
        this.style.backgroundColor = "#135B7B";
    });

    start.addEventListener("mouseout", function() {
        this.style.backgroundColor = "#1B365D";
    });

    start.addEventListener("click", startTimer);
    showHide.addEventListener("click", function() {
        let h = sidebar.style.height;
        sidebar.style.height = (h == "100vh") ? "12vh" : "100vh";
        this.textContent = (h == "100vh") ? "Expand" : "Collapse";
        this.style.padding = (h == "100vh") ? "6px 16px" : "6px 9px";
    });


    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Add a mousemove event listener to the document
    document.addEventListener("mousemove", function(event) {
        // Check if the mouse position is within the specified range
        if (event.clientX <= 190+scrollbarWidth) {
            sidebar.style.opacity = "1";
            header.style.opacity = "0";
        } else {
            sidebar.style.opacity = "0.1";
        }
    });

    sidebar.appendChild(showHide);
    sidebar.appendChild(start);
    sidebar.appendChild(stop);
    sidebar.appendChild(timer);
    selectors.forEach(selector => { sidebar.appendChild(selector) });
    document.body.appendChild(header);
    document.body.appendChild(sidebar);

})();
