<h1 align="center"><a href="https://pressify.app">Pressify</a></h1>
<p align="center">
  <a href="https://www.codefactor.io/repository/github/soup-bowl/pressify"><img src="https://www.codefactor.io/repository/github/soup-bowl/pressify/badge" alt="CodeFactor" /></a>
  <a href="https://gitpod.io/#https://github.com/soup-bowl/pressify"><img src="https://img.shields.io/badge/open%20in-Gitpod-orange?logo=gitpod&logoColor=white" /></a>
</p>

<p align="center">
  <img src="https://soupbowl.io/assets/img/devices-pressify-2.webp" />
</p>

Uses the power of the **[WordPress REST API][wapi]** ([JS library][wapj]) and **[Progressive Web Apps][pwa]** to form a portable app viewer for WordPress-based sites.

[Check it out in action][live]!

For a site to work, it has to meet the following criteria:

* A **WordPress site** with the **WP-JSON API endpoint** visible.
  * This is 'on' by default, but some security plugins suggest disabling it for 'security' reasons.
* The API is **not** behind a **strict CORS policy**.
* The WordPress site hasn't customised the default access policies.
  * A typical custom config will be to require authentication for viewing endpoints, which this tool will not handle.
  * The tool is built to handle these scenarios, but will degrade the experience.

## :warning: Safety Notice

While we will [sanitise the HTML response](https://www.npmjs.com/package/dompurify) from the source API, this tool will obtain and display HTML from the specified site. Please only **use this tool with websites you trust**!

For more info, see [React docs on **dangerouslySetInnerHTML**](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml).

## Getting Started

### With Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/soup-bowl/pressify)

### Without Gitpod

This is a basic React-based project, so you can get up and going on a **Node** machine by running:

```bash
npm install
npm run
```

## Testing Offline

To execute in production/PWA mode, run the following:

```bash
npm run buildstart
```

This will compile a copy of the site, and run it marked 'Production' so that the service worker will work.

## react-hooks/exhaustive-deps

This has been ignored on the UseEffect commands where the WP API is called. This is because once wp is added to the
dependency array, an infinite loop is triggered. I welcome thoughts and suggestions to fix this, but until then (and it
causing no foreseeable bugs), it has been disabled.

[live]: https://soupbowl.io/pressify
[wapi]: https://developer.wordpress.org/rest-api/
[wapj]: https://github.com/WP-API/node-wpapi
[pwa]:  https://web.dev/progressive-web-apps/
