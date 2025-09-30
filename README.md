# Travel Map

A production-ready, free-tier personal travel map web application built with Next.js 14, TypeScript, MapLibre GL, and Decap CMS.

## Features

- 🛰️ **Satellite-only basemap** with free NASA GIBS fallback (optional MapTiler key for higher quality)
- 🗺️ Interactive map with clustered markers using MapLibre GL
- 📍 Click markers to view detailed place information in a side drawer
- 🛤️ Route overlays that highlight when viewing related places
- 📝 MDX-based content for places with rich text support
- 🎨 Beautiful UI with Tailwind CSS and shadcn/ui components
- 📱 Fully responsive design
- 🔄 Git-based CMS with Decap (formerly Netlify CMS)
- 🚀 No database required, completely file-based

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Map**: MapLibre GL with satellite imagery (NASA GIBS or MapTiler)
- **Content**: MDX files with gray-matter, remark, rehype
- **CMS**: Decap CMS (free, Git-based)
- **Hosting**: Designed for Netlify (works on Vercel too)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd travel-map
```

2. Install dependencies:
```bash
npm install
```

3. **(Optional)** Configure satellite imagery:
   - Copy `.env.local.example` to `.env.local`
   - Get a free MapTiler API key from [https://cloud.maptiler.com/](https://cloud.maptiler.com/)
   - Add your key to `.env.local`:
     ```
     NEXT_PUBLIC_MAPTILER_KEY=your_key_here
     ```
   - Without a key, the app uses free ESRI World Imagery satellite tiles (good quality, max zoom 17)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (site)/page.tsx          # Main map page
│   ├── places/[slug]/page.tsx   # Individual place detail pages
│   ├── api/                     # API routes for data fetching
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── Map.tsx                  # MapLibre map component
│   ├── PlaceDrawer.tsx          # Place detail drawer
│   └── ui/                      # shadcn/ui components
├── content/
│   ├── places/*.mdx             # Place content files
│   └── routes/*.geojson         # Route geometry files
├── lib/
│   ├── content.ts               # Content loading utilities
│   ├── mapStyle.ts              # Map style configuration
│   └── utils.ts                 # Utility functions
├── public/
│   ├── admin/                   # Decap CMS interface
│   └── media/                   # Images and audio files
├── .env.local.example           # Environment variables template
└── decap.config.yml             # CMS configuration
```

## Adding Content

### Adding a New Place

1. Create a new MDX file in `content/places/` (e.g., `paris-eiffel.mdx`):

```mdx
---
id: paris-eiffel
title: "Evening at the Eiffel Tower"
date: "2024-09-15"
coords: [2.2945, 48.8584]
city: "Paris"
country: "France"
tags: ["landmark", "photography"]
cover: "/media/places/paris-eiffel/cover.jpg"
photos:
  - src: "/media/places/paris-eiffel/1.jpg"
    caption: "Golden hour view"
audio: "/media/places/paris-eiffel/ambient.mp3"
routeRefs: ["seine-walk"]
---

Your rich text description goes here. You can use **markdown** formatting,
including lists, links, and more.
```

2. Add your images to `public/media/places/paris-eiffel/`
3. Commit the changes to your repository

### Adding a New Route

Create a GeoJSON file in `content/routes/` (e.g., `seine-walk.geojson`):

```json
{
  "type": "Feature",
  "properties": { 
    "id": "seine-walk", 
    "title": "Seine River Walk" 
  },
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [2.2945, 48.8584],
      [2.3522, 48.8566]
    ]
  }
}
```

## Using the CMS

### Local Development

1. The CMS is available at `/admin` when running the dev server
2. Note: Local CMS functionality requires backend configuration

### Production Setup (Netlify + GitHub)

1. Deploy your site to Netlify
2. Update `decap.config.yml` with your repository details:
   ```yaml
   backend:
     name: github
     repo: YOUR_USERNAME/YOUR_REPO_NAME
     branch: main
   ```
3. Enable Netlify Identity and Git Gateway in your Netlify site settings
4. Access the CMS at `https://your-site.netlify.app/admin`
5. Authenticate with GitHub
6. Add/edit content through the visual interface

## Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
3. Deploy!

### Vercel

1. Import your repository to Vercel
2. The project will auto-detect Next.js settings
3. Deploy!

## Customization

### Satellite Imagery

The app uses satellite-only basemap with two options:

1. **With MapTiler Key** (Recommended): High-quality satellite imagery with labels, up to zoom level 18
   - Get a free key at [https://cloud.maptiler.com/](https://cloud.maptiler.com/)
   - Add to `.env.local`: `NEXT_PUBLIC_MAPTILER_KEY=your_key_here`

2. **Without Key** (Fallback): Free ESRI World Imagery satellite tiles
   - No sign-up required
   - Good quality, max zoom level 17
   - Perfect for demos and development

Edit `lib/mapStyle.ts` to customize the satellite style or add different imagery sources.

### Color Theme

Modify the CSS variables in `app/globals.css` to customize the color scheme.

### Content Schema

The content schema is defined in `lib/content.ts`. If you need to add fields:
1. Update the TypeScript types
2. Update `decap.config.yml` to include the new fields in the CMS
3. Update components to display the new fields

## Replace Placeholder Media

The project includes SVG placeholder images. Replace these with actual photos:

- `public/media/places/kyoto-gion/cover.jpg`
- `public/media/places/kyoto-gion/1.jpg`
- `public/media/places/akihabara/cover.jpg`
- `public/media/places/akihabara/1.jpg`
- `public/media/sfx/ic-tap.mp3`

## Building for Production

```bash
npm run build
npm start
```

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ using Next.js, MapLibre, and Decap CMS
