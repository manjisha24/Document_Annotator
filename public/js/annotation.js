// Function to parse query parameters from URL
function parseQueryParameters() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const pageUrl = urlParams.get('pageUrl');
    const uploadedDocument = urlParams.get('uploadedDocument');
    const currentSentence = urlParams.get('currentSentence');
    const annotatedDocument = urlParams.get('annotatedDocument');

    // Populate the sections with the parsed data
    document.getElementById('uploaded-document').innerText = uploadedDocument;
    document.getElementById('current-sentence').innerText = currentSentence;
    document.getElementById('annotated-document').innerText = annotatedDocument;

    // Extract labels from pageUrl and display them
    if (pageUrl) {
        const labels = extractLabelsFromUrl(pageUrl);
        displayLabels(labels);
    }
  }

 // Function to extract labels from pageUrl
function extractLabelsFromUrl(pageUrl) {
    const labels = [];
    const url = new URL(pageUrl);
    url.searchParams.forEach((value, key) => {
        if (key.startsWith('label')) {
            try {
                const label = decodeURIComponent(value);
                labels.push({ label: label, color: getRandomColor() });
            } catch (error) {
                console.error('Error decoding URI component:', error);
                console.error('Key:', key);
                console.error('Value:', value);
            }
        }
    });
    return labels;
}


// Function to display labels on the page
function displayLabels(labels) {
    const labelsContainer = document.getElementById('labelsContainer');
    labels.forEach(labelObj => {
        const labelButton = document.createElement('button');
        labelButton.textContent = labelObj.label;
        labelButton.style.backgroundColor = labelObj.color;
        labelButton.className = 'annotation-btn';
        labelButton.addEventListener('mouseenter', function() {
            // Lighten the color on hover
            labelButton.style.backgroundColor = lightenColor(labelObj.color, 20);
        });
        labelButton.addEventListener('mouseleave', function() {
            // Restore original color when mouse leaves
            labelButton.style.backgroundColor = labelObj.color;
        });
        labelsContainer.appendChild(labelButton);
    });
}


  // Call the function to parse and populate data when the page loads
    window.onload = function() {
        // Check if progress parameters are passed in the URL
        const queryString = window.location.search;
        if (queryString.includes('uploadedDocument') && queryString.includes('currentSentence') && queryString.includes('annotatedDocument')) {
            parseQueryParameters();
        }
    };


