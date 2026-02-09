# Netlify: "Failed to prepare repo" (Git LFS)

If Netlify fails before the build starts ("Failed to prepare repo"), your GitHub branch still contains **Git LFS pointer files**.

This ZIP disables LFS via `.gitattributes` and contains only normal (non-LFS) files.

## The one thing that matters
Your **branch HEAD must not contain LFS pointers**.

### Option A (recommended): New GitHub repo
Create a fresh repo and push this ZIP there, then connect Netlify to the new repo.

### Option B: Same repo (works only if your upload replaces/deletes old files)
Use your upload tool to **replace the repo contents** so old LFS pointer files are removed from the branch.
