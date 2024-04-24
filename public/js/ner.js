// Display the first word initially
let currentIndex = 0;

// Function to split text content into words
function splitIntoWords(content) {
  // Split content into words based on spaces
  return content.split(/\s+/).filter(word => word.trim() !== ''); // Filter out empty words
}

// Function to display current word in current sentence
function displayCurrentWord(words, currentIndex) {
  // Display current word in the current sentence part
  const currentSentenceDiv = document.getElementById("current-sentence");

  // Check if currentIndex is within bounds
  if (currentIndex >= 0 && currentIndex < words.length) {
      currentSentenceDiv.innerText = words[currentIndex];
  } else {
      currentSentenceDiv.innerText = "No more words to display.";
  }
}

// Function to skip a group of words
window.skipWordGroup = function (groupOfWords) {
  // If no group of words is provided, exit
  if (!groupOfWords || groupOfWords.length === 0) return;

  // Combine all words into a single group
  const groupedWords = groupOfWords.join(" ");

  // Add annotation to the annotated-document part
  const annotatedDocumentDiv = document.getElementById("annotated-document");
  annotatedDocumentDiv.innerHTML += `[${groupedWords}(skipped)] `;

  // Increment the currentIndex to move to the next word after the annotated group
  currentIndex++;
  console.log("Current index in the CS after a group annotation:", currentIndex);

  // Retrieve the next word after the skipped group
  const nextWord = getNextWord(groupOfWords[groupOfWords.length - 1]);

  // Display the next word in the current-sentence part
  const currentSentenceDiv = document.getElementById("current-sentence");
  currentSentenceDiv.innerText = nextWord;
};


// Function to annotate a group of words
window.annotateGroupOfWords = function (groupOfWords, label) {
  // If no group of words is provided or label is empty, exit
  if (!groupOfWords || groupOfWords.length === 0 || !label) return;

  // Combine all words into a single group
  const groupedWords = groupOfWords.join(" ");

  // Add annotation to the annotated-document part
  const annotatedDocumentDiv = document.getElementById("annotated-document");
  annotatedDocumentDiv.innerHTML += `[${groupedWords}(${label})] `;

  // Increment the currentIndex to move to the next word after the annotated group
  currentIndex++;
  console.log("Current index in the CS after a group annotation:", currentIndex);

  // Retrieve the next word after the annotated group
  const nextWord = getNextWord(groupOfWords[groupOfWords.length - 1]);

  // Display the next word in the current-sentence part
  const currentSentenceDiv = document.getElementById("current-sentence");
  currentSentenceDiv.innerText = nextWord;
};


// Sample usage of the functions
document.addEventListener("DOMContentLoaded", function () {
  // Extract words from content displayed in the uploaded-document part
  const uploadedDocumentDiv = document.getElementById("uploaded-document");
  const documentContent = uploadedDocumentDiv.innerText;

  // Extract words from content
  const words = splitIntoWords(documentContent);

  // Extract currentIndex from query parameters
  const params = new URLSearchParams(window.location.search);
  const currentIndexParam = params.get('currentIndex');

  // Set currentIndex to the value extracted from the query parameter
  if (currentIndexParam !== null) {
      currentIndex = parseInt(currentIndexParam);
      console.log("Current Index after save open:", currentIndex);
  }

  displayCurrentWord(words, currentIndex);

// // Previous word function
window.prevWord = function () {
  // Retrieve the current word from the current-sentence part
  const currentSentenceDiv = document.getElementById("current-sentence");
  let currentWord = currentSentenceDiv.innerText.trim();

  // If the current word is not empty, remove the last word from the current sentence
  if (currentWord !== "") {
      // Update the current-sentence part with the previous word
      const words = splitIntoWords(document.getElementById("uploaded-document").innerText);


      // const currentIndex = words.indexOf(currentWord);
      console.log("Current index before prev:", currentIndex);
      
      // Calculate the priorIndex based on the number of words in the last annotated word
      let priorIndex = currentIndex;
      const annotatedDocCont = document.getElementById("annotated-document").innerHTML.trim();
      const lastAnnotatedWordREX = /\[(.*?)\]/g;
      const lastAnnotatedWords_plu = annotatedDocCont.match(lastAnnotatedWordREX);
      if (lastAnnotatedWords_plu && lastAnnotatedWords_plu.length > 0) {
        const lastAnnotatedWord = lastAnnotatedWords_plu[lastAnnotatedWords_plu.length - 1];
        const wordsInsideLastAnnotatedWord = lastAnnotatedWord.split(" ").filter(word => !word.startsWith("(") && !word.endsWith(")"));
        priorIndex -= wordsInsideLastAnnotatedWord.length;
      } else {
        // If no annotated words, just go back one word
        priorIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      }
      
      // Ensure priorIndex is not negative
      if (priorIndex < 0) {
        priorIndex = 0;
      }
      
      // update currentword and currentSentenceDiv
      currentWord = words[priorIndex];
      currentSentenceDiv.innerText = currentWord;
    
      // Retrieve the last annotated word from the annotated-document part and remove it
      const annotatedDocumentDiv = document.getElementById("annotated-document");
      let annotatedDocumentContent = annotatedDocumentDiv.innerHTML.trim();
    
      // Find the last annotated word in the content
      const lastAnnotatedWordRegex = /\[(.*?)\]/g;
      const lastAnnotatedWords = annotatedDocumentContent.match(lastAnnotatedWordRegex);
      const lastAnnotatedWord = lastAnnotatedWords && lastAnnotatedWords.length > 0 ? lastAnnotatedWords[lastAnnotatedWords.length - 1] : null;
    
      // Remove the last annotated word from the content
      if (lastAnnotatedWord !== null) {
          annotatedDocumentContent = annotatedDocumentContent.replace(lastAnnotatedWord, '');
          annotatedDocumentDiv.innerHTML = annotatedDocumentContent;
      }
    currentIndex=priorIndex;
    console.log("CI after prev:", currentIndex);
  }
};

// Next word function
window.nextWord = function () {
  // Retrieve the current word from the current-sentence part
  // console.log(currentIndex);
  const currentSentenceDiv = document.getElementById("current-sentence");
  let currentSentence = currentSentenceDiv.innerText.trim();
  
  // If the current sentence is not empty, add a space before adding the next word
  if (currentSentence !== "") {
      currentSentence += " ";
  }

  // Add the next word to the current sentence
  let nextWord = "";
  // console.log(currentSentence.split(/\s+/).length);
  if (currentSentence.split(/\s+/).length >= 2) {
    // If the word count in the current-sentence part is one, increment the currentIndex first
    currentIndex++; // Increment the currentIndex to move to the next word
  }
  console.log("current index of the last word in CS: ", currentIndex);
  if (currentIndex < words.length - 1) {
    // if(currentIndex===2){
    //   nextWord = words[currentIndex];
    //   currentSentence += nextWord;
    // }else{
      // currentIndex++; // Increment the currentIndex to move to the next word
      nextWord = words[currentIndex];
      currentSentence += nextWord;
    // }
  } else {
      currentSentence += ""; // If there are no more words, add an empty string
  }

  // Update the current-sentence part with the new sentence
  currentSentenceDiv.innerText = currentSentence;
};


// Next word function
// // Next word function
// window.nextWord = function () {
//   // Retrieve the current word from the current-sentence part
//   const currentSentenceDiv = document.getElementById("current-sentence");
//   const currentSentence = currentSentenceDiv.innerText.trim();

//   // Retrieve the index of the last word in the current sentence
//   const wordsInCurrentSentence = currentSentence.split(/\s+/).filter(word => word.trim() !== '');
//   const lastWordInCurrentSentence = wordsInCurrentSentence[wordsInCurrentSentence.length - 1];

//   // Find the index of the next unannotated word in the uploaded-document section
//   let nextWordIndex = words.findIndex((word, index) => index > currentIndex && !currentSentence.includes(word));

//   // If no unannotated word is found after the current word, find the next unannotated word from the beginning
//   if (nextWordIndex === -1) {
//       nextWordIndex = words.findIndex(word => !currentSentence.includes(word));
//   }

//   // If an unannotated word is found, update the current-sentence part with the new sentence
//   if (nextWordIndex !== -1) {
//       const nextWord = words[nextWordIndex];
//       currentSentenceDiv.innerText += " " + nextWord;
//   }
// };


 

// Skip word function
 
window.skipWord = function () {
  const currentWord = document.getElementById("current-sentence").innerText.trim();
  if (!currentWord) return; // If no word is displayed, exit

  // Spill the current sentence into words
  const wordsInSentence=currentWord.split(/\s+/).filter(word=>word.trim()!=='');

  if(wordsInSentence.length>1){
    skipWordGroup(wordsInSentence);
  }
  else{
    // If no, annotate the single word
    const currentWord = wordsInSentence[0];
    if (!currentWord) return; // If no word is displayed, exit

    // Add annotation to the annotated-document part
    const annotatedDocumentDiv = document.getElementById("annotated-document");
    annotatedDocumentDiv.innerHTML += `[${currentWord}(skipped)] `;
    currentIndex++;
    // Move to the next word
    const nextWord = getNextWord(currentWord);
    const currentSentenceDiv = document.getElementById("current-sentence");
    currentSentenceDiv.innerText = nextWord;
  }
};

});

// color producing
function getRandomColor() {
    // Generate a random color in hexadecimal format
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  const params = new URLSearchParams(window.location.search);
  const labels = [];
  for (const [key, value] of params) {
    if (key.startsWith('label')) {
      try {
        const label = decodeURIComponent(value.split('?')[0]);
        labels.push({ label: label, color: getRandomColor() });
    } catch (error) {
        console.error('Error decoding URI component:', error);
        console.error('Key:', key);
        console.error('Value:', value);
    }
    }
  }

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

  function lightenColor(color, percent) {
    return '#ffffff';
  }

// Function to annotate current word with a label
function annotateWord(label) {
  const currentSentenceDiv = document.getElementById("current-sentence");
  const currentSentence = currentSentenceDiv.innerText.trim();

  // Split the current sentence into words
  const wordsInSentence = currentSentence.split(/\s+/).filter(word => word.trim() !== '');

  // Check if there's more than one word in the current sentence
  if (wordsInSentence.length > 1) {
      // If yes, annotate the group of words
      annotateGroupOfWords(wordsInSentence, label);
  } else {
      // If no, annotate the single word
      const currentWord = wordsInSentence[0];
      if (!currentWord) return; // If no word is displayed, exit

      // Add annotation to the annotated-document part
      const annotatedDocumentDiv = document.getElementById("annotated-document");
      annotatedDocumentDiv.innerHTML += `[${currentWord}(${label})] `;
      currentIndex++;
      console.log("Current index of CS section: ",currentIndex);
      // Move to the next word
      const nextWord = getNextWord(currentWord);
      currentSentenceDiv.innerText = nextWord;
  }
}


// Function to get the next word from the words array
function getNextWord(currentWord) {
  const words = splitIntoWords(document.getElementById("uploaded-document").innerText);
  // const nextIndex = currentIndex + 1;
  if (currentIndex >= 0 && currentIndex < words.length) {
    return words[currentIndex];
  } else {
    return ""; // If currentIndex is out of bounds
  }
}

// Event listener for label buttons
document.addEventListener("DOMContentLoaded", function () {
  const labelsContainer = document.getElementById('labelsContainer');
  
  // Add event listeners to label buttons
  labelsContainer.addEventListener('click', function(event) {
    if (event.target && event.target.nodeName == "BUTTON") {
      const label = event.target.textContent.trim();
      annotateWord(label);
    }
  });
});


// Function to download the annotated document as a pdf file
function download() {
  // Get the content of the annotated-document section
  var annotatedContent = document.getElementById('annotated-document').innerHTML;

  // Convert HTML content to PDF
  html2pdf().from(annotatedContent).save('annotated_document.pdf');
}

// Function to get the current index
function getCurrentIndex() {
  return currentIndex;
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
      let route = currentPageUrl.replace(/^.*\/\/[^\/]+/, '');
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
