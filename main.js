// TamperMonkey file used in the script

// ==UserScript==
// @name         AMC 8/10/12 Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Solve AMC 8/10/12 questions inside AOPS website and get score and results calculated.
// @author       fireheartjerry
// @match        https://artofproblemsolving.com/wiki/index.php/*Problems
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
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
    let url = window.location.href;
    let answerKeyUrl = url.replace("Problems", "Answer_Key");
    fetch(answerKeyUrl)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const answerElements = doc.querySelectorAll("li");

            const answers = Array.from(answerElements).map(element => {
                return element.textContent.trim();
            });

            alert("Answers: " + answers.join(", "))
            // You can do further processing with the answers here
        })
        .catch(error => {
            alert("Error retrieving answer key: " + error);
        });
})();
