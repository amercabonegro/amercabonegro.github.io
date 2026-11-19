# Amer Cabonegro Portfolio

Personal portfolio website for Amer M. Cabonegro, presenting professional experience, technical skills, education, certifications, and selected projects.

Live site: [amercabonegro.github.io](https://amercabonegro.github.io/)

## Technologies used

- HTML5
- CSS3 with responsive layouts and light/dark themes
- Vanilla JavaScript for theme preferences and mobile navigation
- GitHub Pages for static hosting

The site has no package dependencies or build step.

## Project structure

```text
.
├── index.html                         # Main portfolio page
├── styles.css                        # Shared site styles and responsive layouts
├── script.js                         # Theme and navigation interactions
├── assets/
│   ├── icons/                        # Favicon and interface assets
│   └── images/                       # Portraits, certificates, and social images
└── projects/
    ├── index.html                    # Project listing
    └── navco-intern-monitoring/
        ├── index.html                # NAVCO project case study
        ├── case-study.css            # Case-study-specific styles
        └── images/                   # Case study screenshots
```

## Run locally

Clone the repository, enter its directory, and start a local static server:

```bash
git clone https://github.com/amercabonegro/amercabonegro.github.io.git
cd amercabonegro.github.io
python3 -m http.server 8000
```

Open <http://localhost:8000> in a browser. No dependency installation is required.

## GitHub Pages deployment

This repository is named `amercabonegro.github.io`, so GitHub Pages can publish it as a user site at <https://amercabonegro.github.io/>. Configure **Settings → Pages** to deploy from the production branch's repository root. When changes are merged or pushed to that configured branch, GitHub Pages publishes the static files automatically.

## Add a future project

1. Create a descriptive folder under `projects/`, such as `projects/project-name/`.
2. Add the project's `index.html` and any project-specific styles or images inside that folder.
3. Use relative paths to reference shared files such as `../../styles.css`, `../../script.js`, and assets.
4. Add a project card and link in `projects/index.html`.
5. If the project should be featured, add a corresponding entry to the Projects section in the root `index.html`.
6. Run the site locally and verify navigation, images, responsive layouts, and both color themes before publishing.
