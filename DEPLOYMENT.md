# Deploy Zorvyn

This project is a two-app repo:

- `frontend`: React + Vite app for Vercel static hosting.
- `backend`: Express API that can run locally with `npm run dev` or as Vercel Functions through `backend/api/[...path].js`.

## 1. Push To GitHub

Make sure real secrets stay only in local `.env` files. They are ignored by git.

```bash
git init
git add .
git commit -m "Prepare Zorvyn for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 2. Deploy Backend To Vercel

Create a Vercel project from the GitHub repo with these settings:

- Root Directory: `backend`
- Framework Preset: Other
- Build Command: leave empty
- Output Directory: leave empty
- Install Command: `npm install`

Add these Environment Variables in Vercel:

```text
MONGODB_URI=your MongoDB Atlas connection string
JWT_SECRET=your long random secret
CLOUDINARY_CLOUD_NAME=your Cloudinary cloud name
CLOUDINARY_API_KEY=your Cloudinary API key
CLOUDINARY_API_SECRET=your Cloudinary API secret
```

After deployment, test:

```text
https://your-backend-project.vercel.app/api/health
```

## 3. Deploy Frontend To Vercel

Create another Vercel project from the same GitHub repo with these settings:

- Root Directory: `frontend`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Add this Environment Variable:

```text
VITE_API_URL=https://your-backend-project.vercel.app/api
```

Redeploy the frontend after setting the environment variable.

## Important Notes

- In MongoDB Atlas, add Vercel access in Network Access. For a quick development deployment, `0.0.0.0/0` works, but a tighter rule is better for production.
- Vercel Functions are not ideal for very large video uploads through your backend. This app uploads to Cloudinary through the Express API, so small MVP uploads may work, but production video upload should move to direct browser-to-Cloudinary signed uploads.
