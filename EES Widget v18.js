// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
const url = 'https://repertoire.bmi.com/Search/Search?Main_Search_Text=Auerbach%20&Main_Search=Catalog&Search_Type=all&View_Count=20&Page_Number=1&Part_Type=WriterList&Part_Id=ImsL8330VKj1x9Nf7%252fDYUQ%253d%253d&Part_Id_Sub=oQ5QPfxeuXXa%252bYwl37rzbA%253d%253d&Part_Cae=vg74Yop41vJY6rF4IgnaqA%253d%253d&Original_Search=Writer%2FComposer'

const wv = new WebView()
await wv.loadURL(url)

// check if there's an Accept button'
const js = `!!document.querySelector('#btnAccept')`
const hasDisclaimer = await wv.evaluateJavaScript(js)

if (hasDisclaimer) {
  // click the button and wait
  await wv.evaluateJavaScript(`
    document.getElementById('btnAccept').click()
  `)
  await wv.waitForLoad()
} 

// scrape the count of BMI titles
const js2 = `const n = document.querySelector('.results-font')
n.innerText
`
const n = await wv.evaluateJavaScript(js2)

// extract the number of results
const numResults = n.match(/\d+/)[0]

// get current date and time
const now = new Date()
const month = (now.getMonth() + 1).toString().padStart(2, '0')
const day = now.getDate().toString().padStart(2, '0')
const hours = now.getHours().toString().padStart(2, '0')
const minutes = now.getMinutes().toString().padStart(2, '0')
const currentDateTime = `${month}/${day}, ${hours}:${minutes}`
const currentDateTime2 = `${hours}:${minutes}`

try {
  // Get website update time
  const updateUrl = "https://easyeyesound.com/wp-content/uploads/2023/";
  const updateReq = new Request(updateUrl);
  const updateHtml = await updateReq.loadString();
  const dateRegex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/g;
  const dates = [];
  let match;
  while ((match = dateRegex.exec(updateHtml)) !== null) {
    const dateStr = match[1];
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      dates.push(date);
    }
  }
  const lastUpdate = dates.length > 0 ? Math.max(...dates.map(d => d.getTime())) : null;

// Create widget
const widget = new ListWidget();
widget.setPadding(1, 20, 1, 20);
const imageUrl = "https://i.ibb.co/JBvbLF5/IMG-9352.png"; // replace this with the URL of your image
const imageReq = new Request(imageUrl);
const image = await imageReq.loadImage();
widget.backgroundImage = image;
  
// Add title to the widget
// const title = widget.addText(" ");
// title.font = Font.boldSystemFont(20);
// title.centerAlignText();
widget.addSpacer(85);
  
// Add website update info
  // Create an inline stack to hold the two text elements
const ototoyStack3 = widget.addStack();
ototoyStack3.layoutHorizontally();
ototoyStack3.bottomAlignContent();
const updateTitle = ototoyStack3.addText("Days since website update: ");
updateTitle.font = Font.boldSystemFont(18);
  if (lastUpdate) {
    const diffInMs = Date.now() - lastUpdate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const updateText = ototoyStack3.addText(`${diffInDays.toFixed(1)}`);
    updateText.font = Font.boldSystemFont(22);
    updateText.textColor = new Color("#ff547c");
    // const updateText2 = ototoyStack3.addText(" days ago");
// updateText2.font = Font.boldSystemFont(18);
  if (diffInDays < 0.0417) {
  let notification = new Notification();
  notification.title = "EES Website Update";
  notification.body = "The EES website was updated!";
  notification.schedule();
}
  } else {
    const updateText = ototoyStack3.addText("Unavailable");
    updateText.font = Font.systemFont(18);
    updateText.textColor = Color.gray();
  }

// Add BMI titles info
widget.addSpacer(10);
  // Create an inline stack to hold the two text elements
const ototoyStack2 = widget.addStack();
ototoyStack2.layoutHorizontally();
ototoyStack2.bottomAlignContent();
const bmiTitle = ototoyStack2.addText("Count of BMI credits: ");
bmiTitle.font = Font.boldSystemFont(18);
  const bmiText = ototoyStack2.addText(`${numResults}`);
bmiText.font = Font.boldSystemFont(22);
bmiText.textColor = new Color("#ff547c");

// Add OTOTOY latest release info
// Get OTOTOY latest release
let url = "https://ototoy.jp/labels/226974";
let req = new Request(url);
let html = await req.loadString();
let regex = /(<([^>]+)>)/ig;
let text = html.replace(regex, "");

let splitText = text.split("123&rarr;");
if (splitText.length > 1) {
  let rows = splitText[1].split("\n").map(row => row.trim()).filter(row => row !== "");
  let firstRelease = rows[0];
  let secondRelease = rows[1];
  console.log(`First Release: ${firstRelease}`);
  console.log(`Second Release: ${secondRelease}`);
  if (secondRelease != "Strange Time To Be Alive (Deluxe Edition)") {
    let notification = new Notification();
    notification.title = "New EES Release";
    notification.body = `There's a new EES release from ${secondRelease}! It's titled ${firstRelease}!`;
    notification.schedule();
widget.addSpacer(10);
// const ototoyTitle = widget.addText("Latest release:");
// ototoyTitle.font = Font.boldSystemFont(18);
  // Create an inline stack to hold the two text elements
const ototoyStack = widget.addStack();
ototoyStack.layoutHorizontally();
ototoyStack.bottomAlignContent();
const ototoyTitle = ototoyStack.addText("Latest release: ");
ototoyTitle.font = Font.boldSystemFont(18);
const ototoyText3 = ototoyStack.addText(`${secondRelease}`);
ototoyText3.font = Font.boldSystemFont(22);
ototoyText3.textColor = new Color("#ff547c");
  }
} else {
  console.log("Item not found");
}


const url4 = 'https://ototoy.jp/labels/226974';

// Create a web view to load the HTML content
const webView = new WebView();
await webView.loadURL(url4);
await webView.waitForLoad();

// Extract the HTML content from the web view
const html4 = await webView.evaluateJavaScript(`document.documentElement.innerHTML`);

// Create a temporary container to parse the HTML
const tempContainer = new WebView();
await tempContainer.loadHTML(html4);

// Find the first <img> element in the HTML that matches the URL pattern
const firstImage = await tempContainer.evaluateJavaScript(`
  [...document.querySelectorAll('img')].find(img => img.src.startsWith('https://imgs.ototoy.jp/imgs/jacket'))
    ?.src
`);

if (!firstImage) {
  console.error('No image found matching the URL pattern.');
  return;
}

// Fetch the image data
const imageRequest = new Request(firstImage);
const imageData = await imageRequest.load();

// Create an image from the fetched data
const image2 = Image.fromData(imageData);


// Add the image below the text
widget.addSpacer(10);
const imageElement = widget.addImage(image2);
imageElement.imageSize = new Size(120, 120);
imageElement.centerAlignImage();
  
// Add check date info
widget.addSpacer(10);
const checkText = widget.addText(`Refreshed: ${currentDateTime2}`);
checkText.font = Font.systemFont(12);
checkText.textColor = Color.gray();
checkText.centerAlignText();

// Present the widget
if (config.runsInApp) widget.presentLarge ()
else if (config.runsInWidget)
  Script.setWidget(widget);
  Script.complete();
} catch (error) {
  console.error("Website unresponsive");
}

// Additional notifications and information not shown in the widget

// BMI
if (numResults > 604) {
  let notification = new Notification();
  notification.title = "Auerbach BMI Credits";
  notification.body = `Dan now has ${numResults} songwriting credits!`;
  notification.schedule();
}

// TBK OTOTOY
try {
  let url = "https://ototoy.jp/_/default/a/241833";
  let req = new Request(url);
  let html = await req.loadString();
  let regex = /(<([^>]+)>)/ig;
  let text = html.replace(regex, "");

  let discographySections = text.split("Discography");
  let secondSection = discographySections[1].trim();
  let releaseSections = secondSection.split("The Black Keys");
  let firstSection = releaseSections[0].trim();
  
  if (firstSection != "Dropout Boogie") {
  let notification = new Notification();
  notification.title = "New TBK Release";
  notification.body = `There's a new TBK release! It's titled ${firstSection}!`;
  notification.schedule();
  }
  else {}
  
} catch (error) {
  console.error("Website unresponsive");
}

// Checking for new TBK tour dates
  let url2 = "https://www.dropoutboogie.com/";
  let req = new Request(url2);
  let html_content = await req.loadString();
  let date_regex = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2},\s\d{4}\b/g;
  let dates = html_content.match(date_regex);
  let unique_dates = Array.from(new Set(dates));
  let dates_string = unique_dates.join(", ");
  
  console.log(dates_string);
  
  if (dates_string != "Jun 15, 2023, Jun 18, 2023, Jun 19, 2023, Jun 21, 2023, Jun 22, 2023, Jun 24, 2023, Jun 27, 2023, Jun 28, 2023, Jun 30, 2023, Jul 1, 2023, Jul 4, 2023, Jul 6, 2023, Jul 7, 2023, Jul 8, 2023, Jul 10, 2023, Aug 14, 2023, Aug 24, 2023, Aug 25, 2023, Aug 26, 2023, Aug 27, 2023, Sep 16, 2023") {
    let notification = new Notification();
    notification.title = "New TBK Tour Dates";
    notification.body = `TBK announced new tour dates!`;
    notification.schedule();
    }
    else {}
  
// Checking for new Record Hangs
const url3 = 'https://click.ees.link/recordhang';

const webview = new WebView();
await webview.loadURL(url3);

const pageText = await webview.evaluateJavaScript(`
  function extractText() {
    const text = document.body.innerText;
    const startPhrase = 'Dan Auerbach & Patrick Carney';
    const endPhrase = 'By using this service';

    const startIndex = text.indexOf(startPhrase) + startPhrase.length;
    const endIndex = text.indexOf(endPhrase);

    return text.substring(startIndex, endIndex).trim();
  }
  extractText();
`);

console.log(pageText);

if (pageText != "✨ MEXICO CITY TICKETS ✨") {
    let notification = new Notification();
    notification.title = "New Record Hang";
    notification.body = `EES announced a new Record Hang event!`;
    notification.schedule();
    }
    else {}
