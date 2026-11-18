# Deploy Zooni on Netlify

The site is static HTML/CSS/JavaScript, with a Netlify Function for the Gemini chat. Keep `GEMINI_API_KEY` in Netlify's environment variables; never put it in `ifshan.js`, HTML, or a committed `.env` file.

## Before you push

1. Revoke the Gemini key that was previously pasted into `ifshan.js` and create a new one. Treat that earlier key as exposed.
2. In your GitHub repository, open **Settings → Secrets and variables → Actions** only if you later add workflows. Do not add the key to GitHub files or repository variables. The deployment key belongs in Netlify, configured below.
3. Push this project to the repository. If Git is not initialized in this folder yet, open PowerShell here and run:

   ```powershell
   git init
   git add .
   git status
   git commit -m "Prepare Zooni for Netlify"
   git branch -M main
   git remote add origin https://github.com/YOUR-NAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

   Check `git status` before committing. It should list the project files and must not list `.env` or any key. If your repository already has a README or other first commit, GitHub may reject the first push; tell me the exact error before trying a force push.

## Connect Netlify

1. In Netlify, choose **Add new site → Import an existing project**, connect GitHub, and select this repository.
2. Leave the build command blank and the publish directory as `.`. `netlify.toml` configures the function and `/api/chat` route.
3. In the Netlify site, open **Site configuration → Environment variables** and add `GEMINI_API_KEY` with your replacement key. Set it for the deploy context you use.
4. Deploy the site. After setting or changing the key, trigger a new deploy so the function receives it.
5. Test the site and the Ask Zooni chat on the deployed URL. The first push only publishes code; the API key is entered separately in Netlify.

The chat endpoint is public, so visitors can use it and consume your Gemini quota. Set sensible API quotas/budget alerts with Google and add abuse protection before promoting the site widely.
