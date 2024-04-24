document.getElementById("nerBtn").addEventListener("click", function() {
    window.location.href = "/upload_ner"; // Change to your NER upload page
});

document.getElementById("saBtn").addEventListener("click", function() {
    window.location.href = "/upload_sa"; // Change to your SA upload page
});
function goBack() {
    window.history.back();
}