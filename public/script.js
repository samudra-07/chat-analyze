// public/script.js

document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const resultsDiv = document.getElementById('results');
  
    // Clear previous results
    resultsDiv.innerHTML = '';
  
    if (!fileInput.files.length) {
      resultsDiv.innerHTML = '<div class="error">Please select a .txt chat file first.</div>';
      return;
    }
  
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        resultsDiv.innerHTML = `<div class="error">Error: ${errorData.error || response.statusText}</div>`;
        return;
      }
  
      const data = await response.json();
  
      // Build results HTML
      let html = '<h2>Analysis Results</h2>';
      html += `<div class="stat"><strong>Total Messages:</strong> ${data.total_messages}</div>`;
      html += `<div class="stat"><strong>Total Words:</strong> ${data.total_words}</div>`;
      html += `<div class="stat"><strong>Total Media Shared:</strong> ${data.total_media}</div>`;
      html += `<div class="stat"><strong>Total Links Shared:</strong> ${data.total_links}</div>`;
  
      resultsDiv.innerHTML = html;
  
    } catch (err) {
      resultsDiv.innerHTML = `<div class="error">Unexpected error: ${err.message}</div>`;
    }
  });
  