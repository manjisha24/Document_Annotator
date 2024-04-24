function createLabels() {
    const numLabels = parseInt(document.getElementById('numLabels').value);
    const labelInputs = document.getElementById('labelInputs');
    labelInputs.innerHTML = ''; // Clear previous inputs

    for (let i = 1; i <= numLabels; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `Label ${i}`;
      labelInputs.appendChild(input);
    //   labelInputs.appendChild(document.createElement('br'));
    }
    document.getElementById("saveButton").style.display = "block";
  }

  function saveLabels() {
    const labels = [];
    const inputs = document.querySelectorAll('#labelInputs input');
    inputs.forEach(input => {
      labels.push(input.value);
    });


    // Redirect to ner.hbs
    const urlParams = new URLSearchParams(window.location.search);
    const documentContent = urlParams.get('documentContent');
    const url = `/ner?documentContent=${encodeURIComponent(documentContent)}&` + 
                labels.map((label, index) => `label${index + 1}=${encodeURIComponent(label)}`).join('&');
    window.location.href = url;
  }

  function goBack() {
    window.history.back();
}