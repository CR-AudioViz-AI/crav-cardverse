/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.pokemontcg.io' },
      { protocol: 'https', hostname: 'cards.scryfall.io' },
      { protocol: 'https', hostname: '*.ebayimg.com' },
      { protocol: 'https', hostname: '*.tcgplayer.com' },
    ],
  },
}

module.exports = nextConfig
