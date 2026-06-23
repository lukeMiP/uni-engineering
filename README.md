# Luke Prentice Portfolio Website

A static personal portfolio website for engineering projects, built with plain HTML, CSS, and JavaScript. The site uses a black-and-white pixel-screen visual style with green accents, an interactive pixel-wave landing page, a typing greeting, and project pages for selected robotics and engineering work.

## Pages

- `index.html` - landing page with the interactive pixel-wave hero and project grid.
- `about.html` - short bio, contact details, and social links.
- `portfolio-item-a.html` - The Beat Box project.
- `portfolio-item-b.html` - Sumo Robot project.
- `portfolio-item-c.html` - Biped Walking Robot project.

## Project Structure

```text
.
|-- index.html
|-- about.html
|-- portfolio-item-a.html
|-- portfolio-item-b.html
|-- portfolio-item-c.html
|-- assets/
|   |-- css/
|   |   |-- main.css
|   |   `-- plugins.css
|   |-- js/
|   |   |-- main.js
|   |   `-- plugins.js
|   |-- img/
|   |   |-- portfolio/
|   |   `-- page-portfolio-item-*/
|   `-- fonts/
`-- README.md
```

## Styling And Effects

- Main site styling lives in `assets/css/main.css`.
- Third-party bundled styles live in `assets/css/plugins.css`.
- Custom JavaScript lives in `assets/js/main.js`.
- Third-party bundled scripts live in `assets/js/plugins.js`.

The landing-page pixel-wave effect is rendered on the `#pixel-wave` canvas in `assets/js/main.js`. The typing greeting is controlled by the `typeGreeting()` function in the same file. Hero sizing, typography, borders, scanlines, and pixel styling are controlled in the Hero section of `assets/css/main.css`.
