# TMDB API Key Setup Instructions

## Step 1: Get Your Free TMDB API Key

1. Go to https://www.themoviedb.org/signup
2. Create a free account (takes 2 minutes)
3. After signing in, go to https://www.themoviedb.org/settings/api
4. Click "Request an API Key"
5. Select "Developer" option
6. Fill in the form:
   - Application Name: TamilRing
   - Application URL: Your Netlify URL (e.g., https://tamilring.netlify.app)
   - Application Summary: Tamil ringtone directory
7. Accept terms and submit
8. Copy your **API Key (v3 auth)**

## Step 2: Add API Key to Your Project

Open `src/js/movie-autocomplete-widget.js` and replace line 5:

```javascript
const TMDB_API_KEY = '565f409b9c46bedc1fc2a9165c7d0666';
```

With your actual API key:

```javascript
const TMDB_API_KEY = '565f409b9c46bedc1fc2a9165c7d0666'; // Your actual key
```

## Step 3: Commit and Deploy

```bash
git add .
git commit -m "Add TMDB autocomplete widget"
git push
```

## Step 4: Test Autocomplete

1. Wait for Netlify to deploy (2-3 minutes)
2. Go to `/admin/` on your site
3. Create a new Ringtone
4. Type "Neethane" in the Movie field
5. You should see autocomplete dropdown with "Neethane En Ponvasantham (2012)"
6. Click it and watch Year, Director, and Cast auto-fill!

## How It Works

- **As you type**: Widget searches TMDB for matching movies
- **Dropdown shows**: Movie title, year, and poster thumbnail
- **On selection**: Auto-fills:
  - Year
  - Movie Director
  - Cast (top 5 actors)
- **Music Director**: You still need to type this manually (TMDB doesn't have this for Indian movies)

## Troubleshooting

**No results appearing?**
- Check your API key is correct
- Check browser console for errors (F12)
- Verify TMDB has the movie (search on themoviedb.org first)

**Auto-fill not working?**
- Check browser console for errors
- Some movies may not have complete crew/cast data on TMDB
