export interface Post {
  path: string
  title: string
  place?: string
  date: string
  lang?: string
  desc?: string
  platform?: string
  duration?: string
  recording?: string
  radio?: boolean
  video?: boolean
  inperson?: boolean
  redirect?: string
}

export interface Stream {
  date: string
  location?: string
  weather?: {
    icon: string
    temperature: number
    condition: string
  }
  content: string
}
