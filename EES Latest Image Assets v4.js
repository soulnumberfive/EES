// Get the current date
const currentDate = new Date();

// Get the current year and month
const year = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;

// Prepare an array to store the months
const months = [];

// Loop through the previous n months
for (let i = 1; i >= 0; i--) {
  // Calculate the month value
  const month = currentMonth - i;

  // Calculate the year and month with proper formatting
  const formattedYear = month <= 0 ? year - 1 : year;
  const formattedMonth = month <= 0 ? month + 12 : month;
  const formattedMonthString = formattedMonth.toString().padStart(2, '0');

  // Construct the dynamic URL
  const url = `https://easyeyesound.com/wp-content/uploads/${formattedYear}/${formattedMonthString}/`;

  // Make a network request to fetch the HTML content
  const req = new Request(url);
  const html = await req.loadString();

  // Define a regular expression pattern to match the links with .jpg extension
  const pattern = /<a href="([^"]+\.jpg)">[^<]+<\/a>/g;

  // Find all matches in the HTML content
  const matches = [...html.matchAll(pattern)];

  // Prepare a list of image URLs for the current month
  const imageUrls = matches.map(match => url + match[1]);

  // Add the image URLs to the months array
  months.push({ month: formattedMonth, year: formattedYear, imageUrls });
}

// Reverse the order of months
months.reverse();

if (months.length === 0) {
  console.log("No images found");
} else {
  // Create a web view
  const webView = new WebView();

  // Generate an HTML string to display the images
  const htmlString = `
  <html>
  <head>
  <style>
  body {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
    background-color: #f1f1f1;
  }

  h1 {
    text-align: center;
    font-weight: bold;
    font-size: 48px;
    color: black;
  }

  h2 {
    width: 100%;
    text-align: center;
    font-size: 30px;
  }

  img {
    max-width: 300px;
    max-height: 300px;
  }
  </style>
  </head>
  <body>
  <h1>Latest EES Image Uploads</h1>
  ${months
    .map(({ month, year, imageUrls }) => {
      const label = `${month}/${year}`;
      const images = imageUrls.map(url => `<img src="${url}">`).join('\n');
      return `<h2>${label}</h2>${images}`;
    })
    .join('\n')}
  </body>
  </html>
  `;

  // Load the HTML string in the web view
  await webView.loadHTML(htmlString);

  // Present the web view
  await webView.present();
}
