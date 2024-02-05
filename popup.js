// popup.js

document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentUrl = tabs[0].url;
    var domain = extractDomain(currentUrl);

    // Display the extracted domain in the popup
    document.getElementById("current-url").innerText = "Current Domain: " + domain;

    // Make a request to the VirusTotal API when the "Check" button is clicked
    // document.getElementById("check-button").addEventListener("click", function () {
    //   makeVirusTotalRequest(domain);
    // });
    makeVirusTotalRequest(domain)
  
    
  });
});

function makeVirusTotalRequest(domain) {
  const apiKey = "88eb0252fe93c94df4623f9877149228ddb5e852d0a5988e6eb697eccae21961";
  const apiUrl = `https://www.virustotal.com/api/v3/domains/${encodeURIComponent(domain)}`;

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
      // Process the VirusTotal API response as needed
      displayResult(data);
    })
    .catch(error => {
      console.error("Error fetching VirusTotal data:", error);
      // Handle the error, e.g., display an error message
      displayResult({ error: "Failed to fetch data from VirusTotal." });
    });
}



function extractDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split(".");
    // If the hostname has a 'www' subdomain, remove it
    if (parts.length > 2 && parts[0] === "www") {
      return parts.slice(1).join(".");
    } else {
      return hostname;
    }
  } catch (error) {
    console.error("Error extracting domain:", error);
    return null;
  }
}


function displayResult(data) {
  // Display the result in the popup
  var resultElement = document.getElementById("result");
  if (data.error) {
    resultElement.innerText = "Error: " + data.error;
    resultElement.style.color = "red";
  } else {
    // Extract and display the last_analysis_stats
    var lastAnalysisStats = data.data.attributes.last_analysis_stats;

    // Check if last_analysis_stats is available
    if (lastAnalysisStats) {
      // Display the last_analysis_stats using JSON.stringify
      resultElement.innerText = "VirusTotal Last Analysis Stats:\n" + JSON.stringify(lastAnalysisStats, null, 2);
      resultElement.style.color = "green";
    } else {
      resultElement.innerText = "No last_analysis_stats available.";
      resultElement.style.color = "orange";
    }
  }
}
