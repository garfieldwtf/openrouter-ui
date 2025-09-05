
# OpenRouter UI 🚀

A modern, responsive user interface for interacting with OpenRouter APIs. This project provides a clean web interface to manage and test OpenRouter integrations.

## Features ✨
- **User-Friendly Interface**: Easy navigation and intuitive design.
- **API Integration**: Seamless connectivity with OpenRouter APIs.
- **Customizable**: Adapt the UI to your specific needs.
- **Responsive Design**: Works on desktop and mobile devices.

---

## Deployment 🌐

This project can be deployed automatically using **GitHub Pages** or **Cloudflare Pages**. Below are the setup instructions for both platforms.

### Option 1: Deploy to GitHub Pages
GitHub Pages serves static content directly from your repository. To set up:
1. **Ensure Proper File Structure**:
   - Place your main entry file (e.g., `index.html`) in the root directory or a `docs` folder .
   - Rename the main file to `index.html` for GitHub Pages to recognize it as the default page .
   - If your site is not rendering correctly (e.g., only `README.md` appears), add a `.nojekyll` file to the root to disable Jekyll processing .

2. **Configure GitHub Pages**:
   - Go to your repository **Settings** > **Pages**.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Choose the branch (e.g., `main` or `gh-pages`) and folder (e.g., `/root` or `/docs`) containing your built site .
   - 💡 If using a custom domain, add it in the **Custom domain** field .

3. **Automatic Updates**:
   - GitHub Pages automatically rebuilds the site on every push to the selected branch .
   - Builds typically take **1-10 minutes** to go live. Check deployments under **Actions** > **Pages build and deployment** .

### Option 2: Deploy to Cloudflare Pages
Cloudflare Pages offers fast global deployment and integrates with Git workflows.
1. **Connect Repository**:
   - In the Cloudflare dashboard, go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git** .
   - Authorize access to your GitHub repository.

2. **Build Configuration**:
   - Set the **Production branch** (e.g., `main`).
   - Specify the **Build command** (e.g., `npm run build` if needed) and **Build output directory** (e.g., `dist` or `public`) .
   - If no build step is required, leave the build command blank.
   - Add environment variables if needed (e.g., `NODE_VERSION`).

3. **Deploy**:
   - Click **Save and Deploy**. Cloudflare will build and deploy your site globally.
   - Future commits to the production branch will trigger automatic deployments .

---

## Setup for Development 🛠️
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/garfieldwtf/openrouter-ui.git
   cd openrouter-ui
   ```

2. **Install Dependencies** (if applicable):
   ```bash
   npm install  # or yarn install
   ```

3. **Run Locally**:
   ```bash
   npm start    # or yarn start
   ```
   Access the site at `http://localhost:3000` (or the specified port).

---

## Continuous Deployment Automation 🤖
To ensure automatic deployments on every update:
- **GitHub Pages**: Pushes to the deployed branch (e.g., `main`) will trigger a rebuild .
- **Cloudflare Pages**: Cloudflare automatically monitors connected repositories and deploys changes on pushes to the production branch .
- For advanced workflows (e.g., using Travis CI), refer to .

---

## Troubleshooting ⚠️
- **Site Shows README Instead of Index**:
  - Ensure `index.html` exists in the deployed directory .
  - Add a `.nojekyll` file to disable Jekyll .
- **Custom Domain Issues**:
  - For GitHub Pages, verify DNS settings (e.g., CNAME record points to `username.github.io`) .
  - For Cloudflare, ensure the custom domain is configured in the Pages project .
- **Build Delays**: Deployments may take up to 10 minutes due to CDN caching .

---

## Contributing 🤝
Contributions are welcome! Please fork the repository and submit a pull request for any improvements.

---

## License 📄
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

For more details, refer to the [GitHub Pages documentation](https://docs.github.com/en/pages) or [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/).
