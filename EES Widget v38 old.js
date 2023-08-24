// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: crown;
// Easy Eye Sound Widget
// Created by Noah Webb

// Create widget and set padding
const widget = new ListWidget();
widget.setPadding(20, 20, 5, 20);

// Customize widget colors (typically taken from latest album art)
const mainColor= "#2A2424"; // cloudy black // dark colors work best
const headerColor= "#D9482D"; // red // controls the bottom headers
const descColor= "7993BF"; // blue // controls metrics descriptors

// Other widget colors (these likeky don't need adjustment)
const tintColor= new Color(mainColor, 0.80); // black // Adjusting opacity (0.0-1.0) controls tint intensity
const data1Color= "#DCDDD3"; // creamy white // controls bolded data values
const data2Color= "#C6C6BD"; // darker creamy white // controls description
const footerColor= "#9A9A93"; // dark cream // controls the footer

// Dynamically determine the colors for text background (top) and album borders (bottom)
const color0 = new Color(mainColor);
const opacity = 0.80;

// Calculate the resulting tinted color (color1) from the first method
function tintedColor(color0, opacity) {
  let r = Math.round(0 + opacity * (color0.red * 255 - 0));
  let g = Math.round(0 + opacity * (color0.green * 255 - 0));
  let b = Math.round(0 + opacity * (color0.blue * 255 - 0));

  return new Color(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
}

const color1 = tintedColor(color0, opacity);

// Calculate the tinted colors (color2 & color3) from the second method
function blendColors(baseColor, tintColor, alpha) {
  let r = Math.round((1 - alpha) * baseColor.red * 255 + alpha * tintColor.red * 255);
  let g = Math.round((1 - alpha) * baseColor.green * 255 + alpha * tintColor.green * 255);
  let b = Math.round((1 - alpha) * baseColor.blue * 255 + alpha * tintColor.blue * 255);

  return new Color(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
}

const grayBase = new Color("#808080");
const whiteBase = new Color("#FFFFFF");

const color2 = blendColors(grayBase, color0, opacity);
const color3 = blendColors(whiteBase, color0, opacity);

// Set widget background image
const backUrl = "https://i.ibb.co/X2BCgL5/IMG-0725.jpg";
const backReq = new Request(backUrl);
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

// Set dynamic notification values
let fm = FileManager.iCloud()
let dir = fm.documentsDirectory()

// Define file names
let fileNames = ["BMI", "GMR", "EES", "MAIN", "STORE"]

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

let mainFilePath = fm.joinPath(dir, "MAIN.txt")
let mainText = fm.readString(mainFilePath)
let mainOld = mainText;

let storeFilePath = fm.joinPath(dir, "STORE.txt")
let storeText = fm.readString(storeFilePath)
let storeOld = storeText;

let ytFilePath = fm.joinPath(dir, "YT.txt")
let ytText = fm.readString(ytFilePath)
let ytOld = ytText;

// Section 1: Latest release

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

if (typeof releaseTitle === 'undefined') {
    releaseTitle=artist;
    artist = "Various Artists";
}

// console.log(artist)
// console.log(releaseTitle)

if (artist === "ダン・オーバック") {
    artist = "Dan Auerbach";
} else if (artist === "ヴァリアス・アーティスト") {
    artist = "Various Artists";
} // Japanese to English translations

if (releaseTitle.includes("&#039;")) {
    releaseTitle = releaseTitle.replace(/&#039;/g, "'");
}

const releaseDateStartTag = "Release date: ";
const releaseDateEndTag = "<";
const releaseDateStartIndex = html.indexOf(releaseDateStartTag) + releaseDateStartTag.length;
const releaseDateEndIndex = html.indexOf(releaseDateEndTag, releaseDateStartIndex);
const releaseDate = html.substring(releaseDateStartIndex, releaseDateEndIndex);

// Reformatting the release date
const parsedDate = new Date(releaseDate);
const timezoneOffset = parsedDate.getTimezoneOffset() * 60000; // Timezone offset in milliseconds
const adjustedDate = new Date(parsedDate.getTime() + timezoneOffset);
const month = adjustedDate.toLocaleString("en-US", { month: "long" });
formattedDate = `${month} ${adjustedDate.getDate()}, ${adjustedDate.getFullYear()}`;

console.log(`${artist} - ${releaseTitle}`);

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

// Extracting latest album art
// Load the URL in a WebView
let wv = new WebView();
await wv.loadURL(ototoyUrl);

// Extract HTML content
let html = await wv.evaluateJavaScript("document.documentElement.outerHTML");

// Regex to match the specific pattern: "img" src= and capture src and alt attributes
let regex2 = /"img" src="([^"]+)"[^>]+alt="([^"]+)"/g;

let matches;
let imageUrls = {};
while ((matches = regex2.exec(html)) !== null) {
    let src = matches[1];
    let alt = matches[2];
    
    // If alt title not already in imageUrls, add the src
    if (!imageUrls[alt]) {
        imageUrls[alt] = src;
    }
}

// Convert the imageUrls object to an array of URLs and limit to first five
let uniqueUrls = Object.values(imageUrls).slice(0, 5);

// Assign to individual variables
let albumArt1 = uniqueUrls[0] || "";
let albumArt2 = uniqueUrls[1] || "";
let albumArt3 = uniqueUrls[2] || "";
let albumArt4 = uniqueUrls[3] || "";
let albumArt5 = uniqueUrls[4] || "";

async function loadImageFromURL(url) {
    let req = new Request(url);
    return await req.loadImage();
}

// Store the album art URLs in an array
let albumArtsURLs = [albumArt1, albumArt2, albumArt3, albumArt4];

let loadedImages = [];

// Loop through the album arts
for (let url of albumArtsURLs) {
    // Check if the URL is not empty
    if (url) {
        let image = await loadImageFromURL(url);
        loadedImages.push(image);
    }
}

// Create a horizontal stack
let hStack = widget.addStack();
hStack.layoutHorizontally();
hStack.centerAlignContent();

// Add the image to the stack
let imgStack = hStack.addStack();
let widgetImg = imgStack.addImage(loadedImages[0]);
widgetImg.imageSize = new Size(60, 60);
widgetImg.cornerRadius = 7.5;
widgetImg.borderColor = new Color(mainColor);
widgetImg.borderWidth = 2;

// Create a vertical stack for the text
let textStack = hStack.addStack();
textStack.layoutVertically();
textStack.backgroundColor = new Color(color2.hex);

// Add the text to the text stack
let textOtotoyRow1 = textStack.addText(` ${releaseTitle}` );
textOtotoyRow1.font = new Font("HelveticaNeue-Bold", 14);
textOtotoyRow1.textColor = new Color(data1Color);
textOtotoyRow1.lineLimit = 1;

textStack.addSpacer(2.5)

let textOtotoyRow2 = textStack.addText(` ${artist} `);
textOtotoyRow2.font = new Font("HelveticaNeue", 14);
textOtotoyRow2.textColor = new Color(data2Color);
textOtotoyRow2.lineLimit = 1;

textStack.addSpacer(2.5)

let textOtotoyRow3 = textStack.addText(` ${formattedDate} `);
textOtotoyRow3.font = new Font("HelveticaNeue-Italic", 11);
textOtotoyRow3.textColor = new Color(data2Color);
textOtotoyRow3.lineLimit = 1;

widget.addSpacer(3.5)

// Notifications
if (releaseTitle != eesOld) {
    let notification = new Notification();
    notification.title = "New EES Release";
    notification.body = `There's a new EES release from ${artist}! It's titled ${releaseTitle}!`;
    notification.schedule();
    
    // Update the text file with the new value
  fm.writeString(eesFilePath, releaseTitle.toString());
  }
    else {}

// Section 2: Past releases and label metrics

// Load the first URL into the WebView and get releases
await wv.loadURL('https://docs.google.com/spreadsheets/d/15Kb_zFvrIhnVwmoQWE_0U1pyr3nyOxbbQAPy6Y3hWMs/edit');
let html2 = await wv.evaluateJavaScript('document.documentElement.outerHTML', false);
let matchReleases = html2.match(/Releases<\/td><td class="s1">(\d+)/);
let numOfReleases = matchReleases ? matchReleases[1] : null;

// Load the second URL into the WebView and get songs
await wv.loadURL('https://open.spotify.com/playlist/1jBW5H6QobIpozfkdCXN9z');
html = await wv.evaluateJavaScript('document.documentElement.outerHTML', false);
let matchSongs = html.match(/(\d+) songs/);
let numOfSongs = matchSongs ? matchSongs[1] : null;

// Extract BMI count
const bmiUrl = 'https://repertoire.bmi.com/Search/Search?Main_Search_Text=Auerbach%20&Main_Search=Catalog&Search_Type=all&View_Count=20&Page_Number=1&Part_Type=WriterList&Part_Id=ImsL8330VKj1x9Nf7%252fDYUQ%253d%253d&Part_Id_Sub=oQ5QPfxeuXXa%252bYwl37rzbA%253d%253d&Part_Cae=vg74Yop41vJY6rF4IgnaqA%253d%253d&Original_Search=Writer%2FComposer'
await wv.loadURL(bmiUrl);
const hasDisclaimer = await wv.evaluateJavaScript(`!!document.querySelector('#btnAccept')`);
if (hasDisclaimer) {
    await wv.evaluateJavaScript(`document.getElementById('btnAccept').click()`);
    await wv.waitForLoad();
}
const n = await wv.evaluateJavaScript(`document.querySelector('.results-font').innerText`);
const numBmiResults = n.match(/\d+/)[0];

// Extract GMR count without using WebView (using Request)
const gmrUrl = 'https://globalmusicrights.com/Search?q=1423605&filter=6&mask=DAN%20AUERBACH';
const extractMatchingResultsNumber = text => {
    const regex = /(\d+)\s+matching results/;
    const match = text.match(regex);
    return match ? parseInt(match[1], 10) : null;
};
const request2 = new Request(gmrUrl);
const response2 = await request2.loadString();
const numGmrResults = extractMatchingResultsNumber(response2);

// Combine the counts and print the results
const totalResults = parseInt(numBmiResults) + parseInt(numGmrResults);

console.log(`${totalResults} credits (BMI: ${numBmiResults} | GMR: ${numGmrResults})`)

let bottom = widget.addStack();
bottom.layoutHorizontally();

let prevRelStack = bottom.addStack();
prevRelStack.layoutVertically();

let prevRel = prevRelStack.addText("PAST RELEASES");
prevRel.font = new Font("HelveticaNeue-CondensedBold", 12);
prevRel.textColor = new Color(headerColor);
// prevRel.lineLimit = 1;

prevRelStack.addSpacer(2.5);

// Create a horizontal stack
let hStack2 = prevRelStack.addStack();
hStack2.layoutHorizontally();

// Loop through each URL, fetch the image, resize it, and add it to the stack
for (let i = 1; i < loadedImages.length; i++) {
  //let url = loadedImages[i];

  //let req = new Request(url);
  let img = loadedImages[i];

  let imgStack = hStack2.addStack();
  let widgetImg = imgStack.addImage(img);
  widgetImg.imageSize = new Size(45, 45);
  widgetImg.cornerRadius = 7.5;
  widgetImg.borderColor = new Color(color3.hex);
  widgetImg.borderWidth = 2;

  // Add spacer after each image, except the last one
  if (i < loadedImages.length - 1) {
    hStack2.addSpacer(5);
  }
}

bottom.addSpacer()

let metricsStack = bottom.addStack();
metricsStack.layoutVertically();
metricsStack.centerAlignContent();

let other = metricsStack.addText("LABEL METRICS");
other.font = new Font("HelveticaNeue-CondensedBold", 12);
other.textColor = new Color(headerColor);
other.lineLimit = 1;

let releasesStack = metricsStack.addStack();

let releases1 = releasesStack.addText(`${numOfReleases} `)
releases1.font = new Font("HelveticaNeue-Bold", 14);
releases1.textColor = new Color(data1Color);
releases1.lineLimit = 1;

let releases2 = releasesStack.addText("albums")
releases2.font = new Font("HelveticaNeue-Bold", 14);
releases2.textColor = new Color(descColor);
releases2.lineLimit = 1;

let tracksStack = metricsStack.addStack();

let tracks1 = tracksStack.addText(`${numOfSongs} `)
tracks1.font = new Font("HelveticaNeue-Bold", 14);
tracks1.textColor = new Color(data1Color);
tracks1.lineLimit = 1;

let tracks2 = tracksStack.addText("tracks")
tracks2.font = new Font("HelveticaNeue-Bold", 14);
tracks2.textColor = new Color(descColor);
tracks2.lineLimit = 1;

let creditsStack = metricsStack.addStack();

let credits1 = creditsStack.addText(`${totalResults} `)
credits1.font = new Font("HelveticaNeue-Bold", 14);
credits1.textColor = new Color(data1Color);
credits1.lineLimit = 1;

let credits2 = creditsStack.addText("credits")
credits2.font = new Font("HelveticaNeue-Bold", 14);
credits2.textColor = new Color(descColor);
credits2.lineLimit = 1;

bottom.addSpacer()

// EES logo details
const logoUrl = "https://i.ibb.co/WD2w3Pb/IMG-9323.webp";
const logoReq = new Request(logoUrl);
const logo = await logoReq.loadImage();

let logoStack = bottom.addStack();
logoStack.layoutVertically();
logoStack.centerAlignContent();

logoStack.addSpacer(5);
logoStack.addSpacer();

const rightImage = logoStack.addImage(logo);
// rightImage.rightAlignImage();
rightImage.imageSize = new Size(45, 45);
rightImage.tintColor = new Color(headerColor);
// rightImage.url = "https://easyeyesound.com";

logoStack.addSpacer();

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

const now = new Date();
const currentDateTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

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
    
    if (maxDateObj != mainOld) {
    let notification = new Notification();
    notification.title = "EES Web Update";
    notification.body = `The EES website was just updated! Check for new image assets!`;
    notification.schedule();
    
    // Update the text file with the new value
  fm.writeString(mainFilePath, maxDateObj.toString());
  }
    else {}

    // Calculate the time difference in days
    const timeDiff = (currentDate - maxDateObj) / (1000 * 60 * 60 * 24);

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

console.log(`Latest updates: Main: ${timeDiff.toFixed(1)} | Store: ${diffInDaysStore.toFixed(1)}`);

// Identify minimum value
let minDiffInDays = Math.min(timeDiff, diffInDaysStore);

let refreshSymbol = SFSymbol.named("checkmark.circle")
let globeSymbol = SFSymbol.named("globe")

let footerStack = widget.addStack()
footerStack.layoutHorizontally()
footerStack.centerAlignContent()

let spacer = footerStack.addSpacer()

let refreshSymbolElement = footerStack.addImage(refreshSymbol.image)
refreshSymbolElement.imageSize = new Size(8, 8)
refreshSymbolElement.tintColor = new Color(footerColor);

let footElement1 = footerStack.addText(` ${currentDateTime} `)
footElement1.font = new Font("HelveticaNeue-Light", 9);
footElement1.textColor = new Color(footerColor);

let footElement2 = footerStack.addText(` |  `)
footElement2.font = new Font("HelveticaNeue-Bold", 9);
footElement2.textColor = new Color(footerColor);

let globeElement = footerStack.addImage(globeSymbol.image)
globeElement.imageSize = new Size(8, 8)
globeElement.tintColor = new Color(footerColor);

let footElement3 = footerStack.addText(` ${minDiffInDays.toFixed(1)}d ago`)
footElement3.font = new Font("HelveticaNeue-Light", 9);
footElement3.textColor = new Color(footerColor);

footerStack.addSpacer()

// Notifications
if (lastUpdate2 != storeOld) {
    let notification = new Notification();
    notification.title = "EES Store Update";
    notification.body = `The EES store was just updated! Check their news section!`;
    notification.schedule();
    
    // Update the text file with the new value
  fm.writeString(storeFilePath, lastUpdate2.toString());
  }
    else {}

// Present the widget
if (config.runsInApp) {
  widget.presentMedium();
} else if (config.runsInWidget) {
  Script.setWidget(widget);
  Script.complete();
}
