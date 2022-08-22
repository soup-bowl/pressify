<h1 align="center"><a href="https://whatsth.is">WordPress PWA App (Wapp)</a></h1>
<p align="center">
  <a href="https://www.codefactor.io/repository/github/soup-bowl/wordpress-pwa"><img src="https://www.codefactor.io/repository/github/soup-bowl/wordpress-pwa/badge" alt="CodeFactor" /></a>
  <a href="https://gitpod.io/#https://github.com/soup-bowl/wordpress-pwa"><img src="https://img.shields.io/badge/open%20in-Gitpod-orange?logo=gitpod&logoColor=white" /></a>
</p>

Uses the power of the **[WordPress REST API][wapi]** and **[Progressive Web Apps][pwa]** to form a portable app viewer for WordPress-based sites.

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
​
### With Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/soup-bowl/whatsth.is)

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

[live]: https://soup-bowl.github.io/wordpress-pwa/
[wapi]: https://developer.wordpress.org/rest-api/
[pwa]:  https://web.dev/progressive-web-apps/
