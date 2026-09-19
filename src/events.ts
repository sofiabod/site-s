type EventPhoto = {
  src: string
  alt: string
  href: string
  cover?: string
}

type EventImage = {
  src: string
  alt: string
  cover?: string
  portrait?: boolean
  aspectRatio?: string
}

type CommunityEvent = {
  id: string
  title: string
  subtitle?: string
  people?: { name: string; href: string }[]
  href?: string
  linkPhotos?: boolean
  photos: EventImage[]
  pendingPhotos?: number
}

export const eventsByYear: { year: number; photos: EventPhoto[]; events?: CommunityEvent[] }[] = [
  {
    year: 2026,
    photos: [],
    events: [
      {
        id: 'general-catalyst-hackathon',
        title: 'General Catalyst Hackathon',
        people: [
          { name: 'Yuri Sagalov', href: 'https://www.generalcatalyst.com/team/yuri-sagalov' },
          { name: 'Alexa Liautaud', href: 'https://www.generalcatalyst.com/team/alexa-liautaud' },
          { name: 'Ian Korovinsky', href: 'https://www.linkedin.com/in/ian-korovinsky/' },
        ],
        href: 'https://wygo.world/gc-hackathon',
        photos: [
          { src: '/photos/2026/general-catalyst-hackathon-room.webp', alt: 'Participants working on laptops at the General Catalyst Hackathon' },
          { src: '/photos/2026/general-catalyst-hackathon-stage.webp', alt: 'Speakers on stage at the General Catalyst Hackathon' },
          { src: '/photos/2026/general-catalyst-hackathon-group.webp', alt: 'Group photo at the General Catalyst Hackathon', portrait: true },
        ],
      },
      {
        id: 'z-fellows',
        title: 'Z Fellows',
        people: [
          { name: 'Cory Levy', href: 'https://www.linkedin.com/in/clevy/' },
        ],
        href: 'https://partiful.com/e/IO8pzaqi0FXlfIkm35Vy',
        linkPhotos: true,
        photos: [
          { src: '/photos/2026/z-fellows-conversation.webp', cover: '/photos/2026/z-fellows-conversation-cover.webp', alt: 'A conversation with attendees at the Z Fellows event', aspectRatio: '16 / 9' },
          { src: '/photos/2026/z-fellows-group.webp', cover: '/photos/2026/z-fellows-group-cover.webp', alt: 'Group selfie at the Z Fellows event', aspectRatio: '16 / 9' },
        ],
      },
    ],
  },
  {
    year: 2025,
    photos: [
      { src: '/photos/photo1.jpeg', cover: '/photos/photo1-cover.webp', alt: 'Axiom startup competition', href: 'https://luma.com/7epaq2w3' },
      { src: '/photos/photo2.jpeg', cover: '/photos/photo2-cover.webp', alt: 'Prism event', href: 'https://luma.com/lob2kpxt' },
      { src: '/photos/photo3.jpeg', cover: '/photos/photo3-cover.webp', alt: 'Claude x Socratica event', href: 'https://lu.ma/ufdrjn3n' },
      { src: '/photos/photo4.jpeg', cover: '/photos/photo4-cover.jpeg', alt: 'Claude x Socratica gathering', href: 'https://lu.ma/ufdrjn3n' },
    ],
  },
]
