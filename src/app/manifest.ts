import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VISHAL - Portfolio & Services',
    short_name: 'Your Name',
    description: 'Professional portfolio and services. Web development, design, and digital solutions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/md-red-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
