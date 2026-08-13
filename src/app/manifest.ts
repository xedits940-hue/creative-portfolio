import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vishal Sharma - Portfolio & Services',
    short_name: 'Vishal Sharma',
    description: 'Portfolio of Vishal Sharma, a self-taught vibe coder turning ideas into working digital products.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
