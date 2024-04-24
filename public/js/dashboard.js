// Function to redirect to home page upon clicking "Add New" button
function addNew() {
  window.location.href = "/home";
}

async function deleteProgress(progressId) {
  try {
    const response = await fetch(`/dashboard/delete/${progressId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      // If deletion is successful, remove the row from the table
      const rowToRemove = document.getElementById(progressId);
        if (rowToRemove) {
          rowToRemove.remove();
        }
        // Reload the page to reflect the changes
        location.reload();
    } else {
      console.error('Failed to delete progress');
    }
  } catch (error) {
    console.error('An error occurred while deleting progress:', error);
  }
}