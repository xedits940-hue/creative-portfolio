export interface showReelI {
  title: string;
  vimeoId: string;
  thumbnail: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    repost: number;
  };
}

/** High-res Vimeo thumbnail via vumbnail.com (free, no API key). */
export function vimeoThumb(id: string) {
  return `https://vumbnail.com/${id}_large.jpg`;
}

// Example project data — equipped with local cinematic thumbnails and customizable Vimeo IDs.
export const showRealData: showReelI[] = [
  {
    title: "Cinematic Reel 01",
    vimeoId: "76979871",
    thumbnail: "/frame_05.jpg",
    stats: {
      views: 184000,
      likes: 14200,
      comments: 320,
      repost: 1200,
    },
  },
  {
    title: "Motion Identity 02",
    vimeoId: "76979871",
    thumbnail: "/frame_15.jpg",
    stats: {
      views: 245000,
      likes: 19800,
      comments: 480,
      repost: 2100,
    },
  },
  {
    title: "Sound & Visuals 03",
    vimeoId: "76979871",
    thumbnail: "/frame_25.jpg",
    stats: {
      views: 132000,
      likes: 11400,
      comments: 210,
      repost: 890,
    },
  },
  {
    title: "Brand Narrative 04",
    vimeoId: "76979871",
    thumbnail: "/frame_35.jpg",
    stats: {
      views: 310000,
      likes: 27500,
      comments: 650,
      repost: 3400,
    },
  },
  {
    title: "Studio Showcase 05",
    vimeoId: "76979871",
    thumbnail: "/frame_45.jpg",
    stats: {
      views: 420000,
      likes: 38900,
      comments: 890,
      repost: 4700,
    },
  },
];
