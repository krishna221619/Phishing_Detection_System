// background.js
chrome.runtime.onInstalled.addListener(function () {
    console.log("Extension Installed");
  });
  
  chrome.browserAction.onClicked.addListener(function (tab) {
    // Get the current tab's URL
    const currentUrl = tab.url;
  
    // Make a GET request to the VirusTotal API
    const apiKey = "88eb0252fe93c94df4623f9877149228ddb5e852d0a5988e6eb697eccae21961";
    const apiUrl = `https://www.virustotal.com/api/v3/domains/${encodeURIComponent(currentUrl)}`;
  
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-apikey": apiKey,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("VirusTotal API request failed");
        }
        return response.json();
      })
      .then(data => {
        console.log("VirusTotal API Response:", data);
        // You can do something with the response data here
      })
      .catch(error => {
        console.error("Error fetching VirusTotal data:", error);
      });
  });
  