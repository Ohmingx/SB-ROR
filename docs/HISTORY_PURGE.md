# Purging large files from Git history

If the virtualenv or other large files were committed previously and you want to remove them from repository history, use one of these tools. Be careful: rewriting history affects all clones; communicate with your team.

Option A — BFG Repo-Cleaner (simpler):

1. Install BFG (https://rtyley.github.io/bfg-repo-cleaner/).
2. Mirror your repo and run BFG to delete the folder `backend/env`:

```bash
git clone --mirror <repo-url> repo.git
java -jar bfg.jar --delete-folders backend/env repo.git
cd repo.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push
```

Option B — `git filter-repo` (recommended for more control):

1. Install `git-filter-repo`.
2. Run:

```bash
git clone --bare <repo-url>
git filter-repo --path backend/env --invert-paths
git push --force
```

Always backup and coordinate with collaborators before rewriting history.
