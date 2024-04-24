document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById('file-input');
    const chooseFileButton = document.getElementById('choose-file-button');
    const uploadDocumentButton = document.getElementById('upload-document-button');
    const uploadForm = document.getElementById('uploadForm');

    chooseFileButton.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            const fileName = fileInput.files[0].name;
            document.getElementById('file-name').innerText = 'Selected File: ' + fileName;
            uploadDocumentButton.style.display = 'block'; // Show the "Upload Document" button
        }
    });

    uploadDocumentButton.addEventListener('click', function () {
        // Trigger form submission when the "Upload Document" button is clicked
        uploadForm.submit();
    });
});
function goBack() {
    window.history.back();
}
