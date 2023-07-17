// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
// Easy Eye Sound Widget
// Created by Noah Webb

// Create widget and set padding
const widget = new ListWidget();
widget.setPadding(8, 20, -10, 20);

// Set widget colors
const row1Color= "#D1B000"; // gold // controls header color
const row2Color= "#EDEEE9"; // creamy white // controls data color
const eesColor = "#D1B000"; // gold // controls EES crown color
const footColor= "#9a9a93"; // gray // controls footnote color
const tintColor= new Color("#000000", 0.60); // black // controls background image tint (w/ opacity)

// Set dynamic notification values
let fm = FileManager.iCloud()
let dir = fm.documentsDirectory()

// Define file names
let fileNames = ["BMI", "GMR", "EES", "TBK"]

// Loop through each file name
for (let i = 0; i < fileNames.length; i++) {
    let fileName = fileNames[i]
    let filePath = fm.joinPath(dir, fileName + ".txt")

    // Check if the file exists
    if (!fm.fileExists(filePath)) {
        // Create the file and set initial value to 0
        let initialFileValue = "0"
        fm.writeString(filePath, initialFileValue)
    }
}

let bmiFilePath = fm.joinPath(dir, "BMI.txt")
let bmiText = fm.readString(bmiFilePath)
let bmiOld = parseFloat(bmiText);

let gmrFilePath = fm.joinPath(dir, "GMR.txt")
let gmrText = fm.readString(gmrFilePath)
let gmrOld = parseFloat(gmrText);

let eesFilePath = fm.joinPath(dir, "EES.txt")
let eesText = fm.readString(eesFilePath)
let eesOld = eesText;

let tbkFilePath = fm.joinPath(dir, "TBK.txt")
let tbkText = fm.readString(tbkFilePath)
let tbkOld = tbkText;

// Section 1: Background image and latest release

// Fetch the HTML content of the first URL
const ototoyUrl = "https://ototoy.jp/labels/226974";
const response = await request(ototoyUrl);
if (!response) {
  console.log("Failed to fetch HTML content.");
  return;
}

const htmlContent = response;

// Extract the URL from the HTML content
let albumArtURL, artist, releaseTitle, formattedDate, finalUrl;
const regex = /\/_\/default\/p\/([^"]+)/;
const match = htmlContent.match(regex);
if (match && match[1]) {
  const extractedUrl = match[1];
  finalUrl = `https://ototoy.jp/_/default/p/${extractedUrl}`;

  // Extract latest release information
const req = new Request(finalUrl);
const html = await req.loadString();
const titleStartTag = "<title>";
const titleEndTag = " - OTOTOY</title>";
const titleStartIndex = html.indexOf(titleStartTag) + titleStartTag.length;
const titleEndIndex = html.indexOf(titleEndTag);
const title = html.substring(titleStartIndex, titleEndIndex);

const titleParts = title.split(" / ");

artist = titleParts[0];
releaseTitle = titleParts[1];

if (artist === "ダン・オーバック") {
    artist = "Dan Auerbach";
} else if (artist === "ヴァリアス・アーティスト") {
    artist = "Various Artists";
} // Japanese to English translations

const releaseDateStartTag = "Release date: ";
const releaseDateEndTag = "<";
const releaseDateStartIndex = html.indexOf(releaseDateStartTag) + releaseDateStartTag.length;
const releaseDateEndIndex = html.indexOf(releaseDateEndTag, releaseDateStartIndex);
const releaseDate = html.substring(releaseDateStartIndex, releaseDateEndIndex);

// Reformatting the release date
const parsedDate = new Date(releaseDate);
const timezoneOffset = parsedDate.getTimezoneOffset() * 60000; // Timezone offset in milliseconds
const adjustedDate = new Date(parsedDate.getTime() + timezoneOffset);
const month = adjustedDate.toLocaleString("en-US", { month: "short" }).toLocaleUpperCase("en-US");
formattedDate = `${month} ${adjustedDate.getDate()}, ${adjustedDate.getFullYear()}`;

const albumArtStartTag = '<img alt="album jacket" data-src="';
const albumArtEndTag = '"';
const albumArtStartIndex = html.indexOf(albumArtStartTag) + albumArtStartTag.length;
const albumArtEndIndex = html.indexOf(albumArtEndTag, albumArtStartIndex);
albumArtURL = html.substring(albumArtStartIndex, albumArtEndIndex);

console.log(`Latest EES release: ${artist} - ${releaseTitle}`);

  // ...
} else {
  console.log("URL extraction failed.");
}

// Function to make an HTTP request
async function request(url) {
  try {
    const req = new Request(url);
    return await req.loadString();
  } catch (error) {
    console.log("Failed to make the HTTP request:", error);
    return null;
  }
}

// Set widget background image
const backReq = new Request(albumArtURL);
const backImage = await backReq.loadImage();
const tintedImage = applyTint(backImage, tintColor);
widget.backgroundImage = tintedImage;

// Function to apply tint to the image
function applyTint(backImage, tintColor) {
  const drawContext = new DrawContext();
  drawContext.size = new Size(backImage.size.width, backImage.size.height);
  drawContext.drawImageAtPoint(backImage, new Point(0, 0));
  drawContext.setFillColor(tintColor);
  drawContext.fillRect(new Rect(0, 0, backImage.size.width, backImage.size.height));
  return drawContext.getImage();
}

// Create header
const textOtotoyRow1 = widget.addText(`LATEST RELEASE – ${formattedDate}`);
textOtotoyRow1.font = new Font("HelveticaNeue-CondensedBold", 13);
textOtotoyRow1.textColor = new Color(row1Color);

const textOtotoyStack = widget.addStack();
textOtotoyStack.layoutHorizontally();
textOtotoyStack.bottomAlignContent();
textOtotoyStack.url = finalUrl;

const textOtotoyRow2 = textOtotoyStack.addText(`${artist} `);
textOtotoyRow2.font = new Font("HelveticaNeue-Bold", 16);
textOtotoyRow2.textColor = new Color(row2Color);
textOtotoyRow2.lineLimit = 1;

const textOtotoyRow3 = textOtotoyStack.addText(`${releaseTitle}`);
textOtotoyRow3.font = new Font("HelveticaNeue-Italic", 12);
textOtotoyRow3.textColor = new Color(row2Color);
textOtotoyRow3.lineLimit = 1;

// Notifications
if (releaseTitle != eesOld) {
    let notification = new Notification();
    notification.title = "New EES Release";
    notification.body = `There's a new EES release from ${artist}! It's titled ${releaseTitle}!`;
    notification.schedule();
    
    // Update the text file with the new value for BMI.txt
  fm.writeString(eesFilePath, releaseTitle.toString());
  }
    else {}

try {
  let url = "https://ototoy.jp/_/default/a/241833";
  let req = new Request(url);
  let html = await req.loadString();
  let regex = /(<([^>]+)>)/ig;
  let text = html.replace(regex, "");

  let discographySections = text.split("Discography");
  let secondSection = discographySections[1].trim();
  let releaseSections = secondSection.split("The Black Keys");
  let tbkRelease = releaseSections[0].trim();

  console.log(`Latest TBK release: ${tbkRelease}`);
  
  if (tbkRelease != tbkOld) {
    let notification = new Notification();
    notification.title = "New TBK Release";
    notification.body = `There's a new TBK release titled ${tbkRelease}!`;
    notification.schedule();
    
    // Update the text file with the new value for BMI.txt
  fm.writeString(tbkFilePath, tbkRelease.toString());
  }
    else {}
} catch (error) {
  console.error("Website unresponsive");
}

// Section 2: Web updates

widget.addSpacer(6);

// Get EES main website update time
// Extract the year and month
const currentDate = new Date();
let year = currentDate.getFullYear();
let month = currentDate.getMonth() + 1;

// Add leading zero if month is less than 10
if (month < 10) {
  month = `0${month}`;
}

// Regular expression pattern to match dates (YYYY-MM-DD HH:mm format)
const datePattern = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/g;

// Function to fetch the content of a URL
async function fetchContent(url) {
  const req = new Request(url);
  return await req.loadString();
}

// Function to find the maximum date from an array of dates
function findMaxDate(dates) {
  return dates.reduce((max, date) => (date > max ? date : max));
}

// Function to check if a URL contains dates
async function checkURL(url) {
  const content = await fetchContent(url);
  const dates = content.match(datePattern);
  return dates;
}

// Create the URL and iterate through previous months if necessary
async function findMaxDateFromURL(url) {
  let dates = await checkURL(url);

  while (!dates && month > 1) {
    // Move to the previous month
    month--;
    if (month < 10) {
      month = `0${month}`;
    }
    if (month === 12) {
      year--;
    }

    // Create the new URL
    const newURL = `https://easyeyesound.com/wp-content/uploads/${year}/${month}/`;

    // Check if the new URL contains dates
    dates = await checkURL(newURL);
  }

  if (dates) {
    // Find the maximum date
    const maxDate = findMaxDate(dates);
    const maxDateObj = new Date(maxDate);

    // Calculate the time difference in days
    const timeDiff = (currentDate - maxDateObj) / (1000 * 60 * 60 * 24);

    // Print the time difference
    console.log(`Main: ${timeDiff.toFixed(1)}`);

    return timeDiff; // Return the time difference
  } else {
    console.log("No dates found.");
    return 0; // Return default value of 0
  }
}

// Create the initial URL
const initialURL = `https://easyeyesound.com/wp-content/uploads/${year}/${month}/`;

// Find the maximum date from the URL and calculate the time difference
const timeDiff = await findMaxDateFromURL(initialURL);

// Get EES store website update time
  const updateUrl2 = "https://store.easyeyesound.com/blogs/news";
  const updateReq2 = new Request(updateUrl2);
  const updateHtml2 = await updateReq2.loadString();
  const dateRegex2 = /<time datetime="(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)">/g;
  const dates2 = [];
  let match3;
  while ((match3 = dateRegex2.exec(updateHtml2)) !== null) {
    const dateStr2 = match3[1];
    const date2 = new Date(dateStr2);
    if (!isNaN(date2.getTime())) {
      dates2.push(date2);
    }
  }
  const lastUpdate2 = dates2.length > 0 ? Math.max(...dates2.map(d => d.getTime())) : null;
  
  const diffInMsStore = Date.now() - lastUpdate2;
  const diffInDaysStore = diffInMsStore / (1000 * 60 * 60 * 24);

console.log(`Store: ${diffInDaysStore.toFixed(1)}`)

// Identify minimum value
let minDiffInDays = Math.min(timeDiff, diffInDaysStore);

// Create header
const textWebRow1 = widget.addText("LATEST WEBSITE UPDATE                       ");
textWebRow1.font = new Font("HelveticaNeue-CondensedBold", 13);
textWebRow1.textColor = new Color(row1Color);

const textWebStack = widget.addStack();
textWebStack.layoutHorizontally();
textWebStack.bottomAlignContent();
textWebStack.url = "https://store.easyeyesound.com";

const textWebRow2 = textWebStack.addText(`${minDiffInDays.toFixed(1)} days ago `);
textWebRow2.font = new Font("HelveticaNeue-Bold", 16);
textWebRow2.textColor = new Color(row2Color);

const textWebRow3 = textWebStack.addText (`Main: ${timeDiff.toFixed(1)} – Store: ${diffInDaysStore.toFixed(1)}`);
textWebRow3.font = new Font ("HelveticaNeue-Italic", 12);
textWebRow3.textColor = new Color (row2Color);

// Section 3: Songwriting credits

widget.addSpacer(6);

// Extract BMI count
const bmiUrl = 'https://repertoire.bmi.com/Search/Search?Main_Search_Text=Auerbach%20&Main_Search=Catalog&Search_Type=all&View_Count=20&Page_Number=1&Part_Type=WriterList&Part_Id=ImsL8330VKj1x9Nf7%252fDYUQ%253d%253d&Part_Id_Sub=oQ5QPfxeuXXa%252bYwl37rzbA%253d%253d&Part_Cae=vg74Yop41vJY6rF4IgnaqA%253d%253d&Original_Search=Writer%2FComposer'

const wv = new WebView()
await wv.loadURL(bmiUrl)

// Check if there's an Accept button'
const js = `!!document.querySelector('#btnAccept')`
const hasDisclaimer = await wv.evaluateJavaScript(js)

if (hasDisclaimer) {
  // Click the button and wait
  await wv.evaluateJavaScript(`
    document.getElementById('btnAccept').click()
  `)
  await wv.waitForLoad()
} 

// Scrape the count of BMI titles
const js2 = `const n = document.querySelector('.results-font')
n.innerText
`
const n = await wv.evaluateJavaScript(js2)

// Extract the number of results
const numBmiResults = n.match(/\d+/)[0]
console.log(`BMI: ${numBmiResults}`)

// Extract GMR count
const gmrUrl = 'https://globalmusicrights.com/Search?q=1423605&filter=6&mask=DAN%20AUERBACH';

// Function to extract the number of matching results
function extractMatchingResultsNumber(text) {
  const regex = /(\d+)\s+matching results/;
  const match = text.match(regex);
  if (match && match.length >= 2) {
    return parseInt(match[1], 10);
  }
  return null;
}

// Function to log the extracted number
function logMatchingResultsNumber(numGmrResults) {
  if (numGmrResults !== null) {
    console.log(`GMR: ${numGmrResults}`);
  } else {
    console.log('Matching results number not found.');
  }
}

// Make the HTTP request to fetch the page content
async function fetchData() {
  const request = new Request(gmrUrl);
  const response = await request.loadString();
  const numGmrResults = extractMatchingResultsNumber(response);
  logMatchingResultsNumber(numGmrResults);

  // Combine the counts
  const totalResults = parseInt(numBmiResults) + parseInt(numGmrResults);
  
  return { numBmiResults, numGmrResults, totalResults }; // Return an object with all three values
}

// Call the fetchData function to execute the script
const { numBmiResults: bmiResults, numGmrResults, totalResults } = await fetchData();

// Create the main horizontal stack
let mainStack = widget.addStack();
mainStack.layoutHorizontally();
mainStack.setPadding(0, 0, -7.5, 0);

// Create the left stack for text content
const textBmiStack1 = mainStack.addStack();
textBmiStack1.layoutVertically();
textBmiStack1.bottomAlignContent();

const textBmiRow1 = textBmiStack1.addText("SONGWRITING CREDITS                                                               ");
textBmiRow1.font = new Font("HelveticaNeue-CondensedBold", 13);
textBmiRow1.textColor = new Color(row1Color);

// Create a horizontal stack for rows 2 and 3
const row2and3Stack = textBmiStack1.addStack();
row2and3Stack.layoutHorizontally();
row2and3Stack.bottomAlignContent();
row2and3Stack.url = "https://globalmusicrights.com/Artist/1423605";

const textBmiRow2 = row2and3Stack.addText(`${totalResults} titles `);
textBmiRow2.font = new Font("HelveticaNeue-Bold", 16);
textBmiRow2.textColor = new Color(row2Color);
textBmiRow2.lineLimit = 1;

const textBmiRow3 = row2and3Stack.addText(`BMI: ${numBmiResults} – GMR: ${numGmrResults} `);
textBmiRow3.font = new Font("HelveticaNeue-Italic", 12);
textBmiRow3.textColor = new Color(row2Color);
textBmiRow3.lineLimit = 1;

// Create the right stack for the EES logo
const textBmiStack2 = mainStack.addStack();
textBmiStack2.layoutHorizontally();
textBmiStack2.bottomAlignContent();
textBmiStack2.setPadding(-5, 0, -1, 0);

// EES logo details
const logoUrl = "https://i.ibb.co/WD2w3Pb/IMG-9323.webp";
const logoReq = new Request(logoUrl);
const logo = await logoReq.loadImage();

const rightImage = textBmiStack2.addImage(logo);
rightImage.rightAlignImage();
rightImage.imageSize = new Size(50, 50);
rightImage.tintColor = new Color(eesColor);
rightImage.url = "https://easyeyesound.com";

// Notifications
if (numBmiResults > bmiOld) {
    let notification = new Notification();
    notification.title = "New BMI Songwriting Credits";
    notification.body = `Dan now has ${numBmiResults} BMI titles!`;
    notification.schedule();
    
    // Update the text file with the new value for BMI.txt
  fm.writeString(bmiFilePath, numBmiResults.toString());
  }
    else {}

if (numGmrResults > gmrOld) {
    let notification = new Notification();
    notification.title = "New GMR Songwriting Credits";
    notification.body = `Dan now has ${numGmrResults} GMR titles!`;
    notification.schedule();
    
    // Update the text file with the new value for BMI.txt
  fm.writeString(gmrFilePath, numGmrResults.toString());
  }
    else {}

// Final Section: Latest Refresh Time

widget.addSpacer(5);

// Get current time
const now = new Date()
const hours = now.getHours().toString().padStart(2, '0')
const minutes = now.getMinutes().toString().padStart(2, '0')
const currentDateTime = `${hours}:${minutes}`

let refreshSymbol = SFSymbol.named("checkmark.circle")
let footerStack = widget.addStack()
footerStack.layoutHorizontally()
footerStack.centerAlignContent()

let spacer = footerStack.addSpacer()

let refreshSymbolElement = footerStack.addImage(refreshSymbol.image)
refreshSymbolElement.imageSize = new Size(9, 9)
refreshSymbolElement.tintColor = new Color(footColor)

footerStack.addSpacer(2)

let footElement = footerStack.addText(` ${currentDateTime}`)
footElement.font = new Font("HelveticaNeue-Light", 10);
footElement.textColor = new Color(footColor);

footerStack.addSpacer()

// Present the widget
if (config.runsInApp) {
  widget.presentMedium();
} else if (config.runsInWidget) {
  Script.setWidget(widget);
  Script.complete();
}