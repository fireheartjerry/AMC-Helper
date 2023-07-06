// ==UserScript==
// @name         AMC 8/10/12 Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Solve AMC 8/10/12 questions inside AOPS website and get score and results calculated.
// @author       fireheartjerry
// @match        https://artofproblemsolving.com/wiki/index.php/*Problems
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const answerchoices = {
        1: 'A',
        2: 'B',
        3: 'C',
        4: 'D',
        5: 'E'
    };

    var answers;
    fetch(window.location.href.replace("Problems", "Answer_Key"))
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const answerElements = doc.querySelectorAll("li");

            answers = Array.from(answerElements).map(element => { return element.textContent.trim(); });

        })
        .catch(error => {
            alert("Error retrieving answer key: " + error);
        });
    //alert("Answers: " + answers.join(", "))
    var $ = window.jquery

    // Create the sidebar element
    const sidebar = document.createElement("div");
    sidebar.id = "answerSelector";
    sidebar.textContent = "Answer Selector";

    // Apply styles to the sidebar
    sidebar.style.position = "fixed";
    sidebar.style.top = "0";
    sidebar.style.right = "0";
    sidebar.style.width = "175px";
    sidebar.style.height = "100vh";
    sidebar.style.backgroundColor = "#009FAD";
    sidebar.style.color = "white";
    sidebar.style.padding = "10px";
    sidebar.style.zIndex = "1";
    sidebar.style.opacity = "0.1";
    sidebar.style.font = "Arial";
    sidebar.style.fontWeight = "bold"; // Make text bold
    sidebar.style.fontSize = "25px"; // Set font size
    sidebar.style.textAlign = "center"

    const header = document.createElement("div");
    header.id = "infoHeader";
    header.textContent = "Hover over the right sidebar to select answers.";

    // Apply styles to the sidebar
    header.style.position = "fixed";
    header.style.top = "0";
    header.style.width = "100%";
    header.style.height = "50px";
    header.style.backgroundColor = "orange";
    header.style.color = "black";
    header.style.padding = "10px";
    header.style.zIndex = "9999";
    header.style.opacity = "1";
    header.style.fontSize = "20px";
    header.style.textAlign = "center"
    header.style.fontWeight = "bold";

    function calcTime() {
        const contest = parseInt(String(window.location.href).split("/").pop().slice(9, -9).replace(/[a-zA-Z]/g, ""));
        if (contest == 8) {
            return 40;
        } else if (contest == 10 || contest == 12) {
            return 75;
        }
    }

    const start = document.createElement("button");
    start.textContent = "Start\nContest";
    start.style.position = "fixed";
    start.style.right = "9px";
    start.style.top = "90px";
    start.style.fontSize = "20px";
    start.style.color = "white";
    start.style.border = "none";
    start.style.backgroundColor = "#1B365D";
    start.style.padding = "6px 16px";
    start.style.fontFamily = "Arial";
    start.style.fontWeight = "bold";

    sidebar.addEventListener("mouseover", function() {
        this.style.opacity = "1";
        header.style.opacity = "0";
    });

    start.addEventListener("mouseover", function() {
        this.style.backgroundColor = "#135B7B";
    });

    start.addEventListener("mouseout", function() {
        this.style.backgroundColor = "#1B365D";
    });

    sidebar.addEventListener("mouseout", function() {
        this.style.opacity = "0.1";
    });

    sidebar.appendChild(start);
    document.body.appendChild(header);
    document.body.appendChild(sidebar);
    //document.body.appendChild(start);

})();
