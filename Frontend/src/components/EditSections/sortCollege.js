// sortWorker.js
self.onmessage = function (e) {
    const colleges = e.data;
    // Sort based on the 'college' property
    colleges.sort((a, b) => a.college.localeCompare(b.college));
    // Send the sorted array back to the main thread
    self.postMessage(colleges);
  };
  