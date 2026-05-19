**What it is**

This is a personal portfolio website I made for Hackclub Macondo, containing some of my projects and more.

**Stack**

I used SvelteKit + Svelte 5 runes, Tailwind CSS, SQLite via @libsql/client, GitHub API and Devicon.

**Features**

- pinned projects
- devlog
- guestbook
- repo view counts
- konami code easter egg
- hackatime live stats
- physics cursor

**Running it locally**
```bash
git clone ...
npm install
cp .env.example .env # fill in your Github token + admin password
npm run dev
```

**Environment variables**

.env needs a few values to make everything work:

1. ADMIN_PASSWORD: This is the password that you use to log in to the admin panel.
2. HACKATIME_CLIENT_ID and HACKATIME_CLIENT_SECRET: This is for hackatime time tracking on the site, found [here](https://hackatime.com/oauth/applications)
3. HACKATIME_ACCESS_TOKEN: This is also for hackatime time tracking, obtained from manual OAuth flow (see setup notes)

**Setup Notes**

To get your HACKATIME_ACCESS_TOKEN, you need to do a one-time manual OAuth flow:

1. Create an OAuth app at [hackatime.hackclub.com/oauth/applications](https://hackatime.hackclub.com/oauth/applications) and set the redirect URI to `http://localhost:5173`
2. Visit this URL in your browser (replace `YOUR_CLIENT_ID` with your actual ID): https://hackatime.hackclub.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:5173&response_type=code&scope=read
3. Authorize the app, then grab the `?code=` value from the redirect URL
4. Exchange it for a token:
```bash
   curl -X POST https://hackatime.hackclub.com/oauth/token \
     -d "grant_type=authorization_code" \
     -d "code=YOUR_CODE" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "redirect_uri=http://localhost:5173"
```
5. Copy the `access_token` from the response into your `.env`

**Deployment**

This site runs on a DigitalOcean droplet with Caddy handling HTTPS and PM2 keeping the process alive.

```bash
git clone https://github.com/Xtimate/xtimate.tech.git /var/www/xtimate.tech
cd /var/www/xtimate.tech
npm install
cp .env.example .env  # fill in your values
npm run build
pm2 start build/index.js --name xtimate
pm2 save
```
To deploy updates:
```bash
git pull
npm run build
pm2 restart xtimate
```
