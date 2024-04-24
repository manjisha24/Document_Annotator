let currentSentenceIndex = 0;

// Function to split text content into sentences
function splitIntoSentences(text) {
    // Split text into sentences based on common punctuation marks, including decimal points
    return text.match(/[^.!?]+(?:[.!?]+|$)/g);
}

// Function to update the current sentence
function updateCurrentSentence() {
    const uploadedDocument = document.getElementById('uploaded-document');
    const currentSentence = document.getElementById('current-sentence');

    // Extract text content from the uploaded document
    const documentContent = uploadedDocument.textContent.trim();

    // Split the content into sentences
    const sentences = splitIntoSentences(documentContent);

    // Update the current sentence in the UI
    currentSentence.textContent = sentences[currentSentenceIndex];
    console.log(currentSentenceIndex);

    // Highlight the current sentence
    highlightCurrentSentence();
}

// Function to generate a random color
function getRandomColor() {
    // Generate a random color in hexadecimal format
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// Function to lighten a color
function lightenColor(color, percent) {
    // Lighten the color by the specified percentage
    return '#ffffff';
}

function prevButton() {
    const uploadedDocument = document.getElementById('uploaded-document');
    const currentSentence = document.getElementById('current-sentence');
    const annotatedDocument = document.getElementById('annotated-document');
    const sentences = splitIntoSentences(uploadedDocument.textContent.trim());

    // Find the index of the last annotation
    let lastAnnotationIndex = annotatedDocument.innerHTML.lastIndexOf('[');
    if (lastAnnotationIndex !== -1) {
        // Remove the last annotated sentence if it is within brackets
        const lastBracketIndex = annotatedDocument.innerHTML.lastIndexOf('[', lastAnnotationIndex);
        const lastClosingBracketIndex = annotatedDocument.innerHTML.indexOf(']', lastAnnotationIndex);
        annotatedDocument.innerHTML = annotatedDocument.innerHTML.substring(0, lastBracketIndex) +
            annotatedDocument.innerHTML.substring(lastClosingBracketIndex + 1);
    } else {
        // Find the last non-annotated sentence index
        let lastNonAnnotatedSentenceIndex = annotatedDocument.innerHTML.lastIndexOf(']');
        if (lastNonAnnotatedSentenceIndex !== -1) {
            // Remove the last non-annotated sentence
            annotatedDocument.innerHTML = annotatedDocument.innerHTML.substring(0, lastNonAnnotatedSentenceIndex);
        } else {
            // Remove the last sentence if no annotations are present
            const lastSentenceIndex = annotatedDocument.textContent.trim().lastIndexOf('\n');
            annotatedDocument.innerHTML = annotatedDocument.innerHTML.substring(0, lastSentenceIndex);
        }
    }

    // Move to the previous sentence in the current-section part
    if (currentSentenceIndex > 0) {
        currentSentenceIndex--;
        currentSentence.textContent = sentences[currentSentenceIndex];
    }
}

function nextButton() {
    // Annotate the current sentence as (skipped)
    const currentSentence = document.getElementById('current-sentence').textContent.trim();
    const annotatedDocument = document.getElementById('annotated-document');
    annotatedDocument.innerHTML += `[${currentSentence}] `;

    // Move to the next sentence
    nextSentence();
}

function skipButton() {
    // Annotate the current sentence as (skipped)
    const currentSentence = document.getElementById('current-sentence').textContent.trim();
    const annotatedDocument = document.getElementById('annotated-document');
    annotatedDocument.innerHTML += `[${currentSentence}(skipped)] `;

    // Move to the next sentence
    nextSentence();
}


// Function to annotate the current sentence
function annotate(label) {
    const uploadedDocument = document.getElementById('uploaded-document');
    const currentSentenceIndex = getCurrentSentenceIndex();
    const sentences = splitIntoSentences(uploadedDocument.textContent.trim());

    const annotatedDocument = document.getElementById('annotated-document');

    if (currentSentenceIndex < sentences.length) {
        const currentSentence = sentences[currentSentenceIndex].trim();
        annotatedDocument.innerHTML += `${label} `;
    }
    nextSentence();
}

// Function to get the current sentence index
function getCurrentSentenceIndex() {
    const currentSentence = document.getElementById('current-sentence').textContent.trim();
    const uploadedDocument = document.getElementById('uploaded-document');
    const sentences = splitIntoSentences(uploadedDocument.textContent.trim());

    return sentences.findIndex(sentence => sentence.trim() === currentSentence);
}

// Function to move to the next sentence
function nextSentence() {
    const uploadedDocument = document.getElementById('uploaded-document');
    const currentSentence = document.getElementById('current-sentence');

    // Extract text content from the uploaded document
    const documentContent = uploadedDocument.textContent.trim();

    // Split the content into sentences
    const sentences = splitIntoSentences(documentContent);

    // Increment the current sentence index
    currentSentenceIndex++;

    // Update the current sentence in the UI
    if (currentSentenceIndex < sentences.length) {
        currentSentence.textContent = sentences[currentSentenceIndex];
    } else {
        // If all sentences are annotated, display a message or take appropriate action
        currentSentence.textContent = "All sentences annotated";
    }

    // Highlight the current sentence
    highlightCurrentSentence();
}

// // Function to save the progress of the user
// async function saveProgress() {
//     try {
//         // Get the content of the uploaded document
//         const documentContent = document.getElementById('uploaded-document').innerText;
  
//         // Get the URL of the current webpage
//         const webpageUrl = window.location.href;
  
//         // Prepare the data to be sent to the server
//         const data = {
//             documentContent: documentContent,
//             webpageUrl: webpageUrl
//         };
  
//         // Send a POST request to your server to save the progress
//         const response = await fetch('/dashboard', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         });
  
//         // Check if the progress was saved successfully
//         if (response.ok) {
//             // alert('Progress saved successfully!');
//             console.log("OK");
//         } else {
//             throw new Error('Failed to save progress');
//         }
//     } catch (error) {
//         console.error(error);
//         alert('An error occurred while saving progress');
//     }
//   }

// Function to add a blinking cursor after the current sentence in the uploaded document
// function highlightCurrentSentence() {
//     const currentSentence = document.getElementById('current-sentence');
//     const uploadedDocument = document.getElementById('uploaded-document');

//     // Remove existing cursor if any
//     const existingCursor = uploadedDocument.querySelector('.cursor');
//     if (existingCursor) {
//         existingCursor.remove();
//     }

//     // Add cursor after the current sentence
//     const cursor = document.createElement('span');
//     cursor.textContent = '|'; // Use any character you want for the cursor
//     cursor.classList.add('cursor');
//     currentSentence.appendChild(cursor);
// }

// Function to dynamically generate labels
function generateLabels(labels) {
    const labelsContainer = document.getElementById('labelsContainer');

    // Clear previous labels
    labelsContainer.innerHTML = '';

    // Add buttons for each label
    labels.forEach(label => {
        const labelButton = document.createElement('button');
        labelButton.textContent = label;
        labelButton.className = 'annotation-btn';
        labelButton.style.backgroundColor = getRandomColor(); // Assign random background color
        labelButton.addEventListener('click', function () {
            // Annotate the current sentence with the label
            const currentSentence = document.getElementById('current-sentence').textContent.trim();
            annotate(`[${currentSentence}(${label})]`);
        });
        labelsContainer.appendChild(labelButton);
    });
}

// Function to parse URL parameters and extract labels
function getLabelsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const labelsParam = urlParams.get('labels');
    if (labelsParam) {
        return JSON.parse(decodeURIComponent(labelsParam));
    } else {
        return [];
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Extract currentIndex from query parameters
    const params = new URLSearchParams(window.location.search);
    const currentIndexParam = params.get('currentIndex');

    // Set currentSentenceIndex to the value extracted from the query parameter
    if (currentIndexParam !== null) {
        currentSentenceIndex = parseInt(currentIndexParam);
        console.log("Current Sentence Index:", currentSentenceIndex);

        // Update the current sentence
        // updateCurrentSentence();
    }
});


// Event listener for label buttons
document.addEventListener("DOMContentLoaded", function () {
    const labels = getLabelsFromURL();
    generateLabels(labels);
});

// Initial update of current sentence
updateCurrentSentence();

// Function to download the annotated document as a pdf file
function download() {
    // Get the content of the annotated-document section
    var annotatedContent = document.getElementById('annotated-document').innerHTML;
  
    // Convert HTML content to PDF
    html2pdf().from(annotatedContent).save('annotated_document.pdf');
}

// Function to get the current index
function getCurrentIndex() {
    return currentSentenceIndex;
  }

// Function to handle saving progress
async function saveProgress() {
    try {
        // Get content from the document elements
        const uploadedDocument = document.getElementById('uploaded-document').innerText;
        const currentSentence = document.getElementById('current-sentence').innerText;
        const annotatedDocument = document.getElementById('annotated-document').innerText;

        // Get URL of the current page
        const currentPageUrl = window.location.href;

        // Remove protocol, domain, and port information to extract only the route
        const route = currentPageUrl.replace(/^.*\/\/[^\/]+/, '');
        console.log(route); // This will log the route part of the URL without the protocol, domain, and port

        // Prompt user for document name and label
        const documentName = prompt("Enter document name:");
        const label = prompt("Enter label:");

        // Include currentIndex
        const currentIndex = getCurrentIndex();
        console.log("Saved CI:", currentIndex);


        // Send AJAX request to backend to save progress
        const response = await fetch('/save-progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uploadedDocument,
                currentSentence,
                annotatedDocument,
                documentName,
                label,
                route, // Include URL of the current page
                currentIndex
            })
        });

        // Check if progress was saved successfully
        if (response.ok) {
            alert('Progress saved successfully!');
            // Redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            throw new Error('Failed to save progress');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred while saving progress');
    }
}

function goBack() {
    window.history.back();
}
