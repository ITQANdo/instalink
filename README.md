# Instalink
## Simple module to return the URL of an image from an Instagram post

Instagram scraping is tricky due to the nature of modern-day JS frameworks.
The server doesn't return rendered HTML anymore. Instead it passes content,
plus the rules of rendering it to the browser and leaves it for the browser.
Because of that simply doing a smiple request doesn't return the desured result.

So we have to actually render the page first using a browser then pull out the info
needed from it.

One great way to render web pages using a controlled APIs set it Puppeteer.
