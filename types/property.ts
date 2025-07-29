import { Property, User } from '@prisma/client'

export type PropertyWithRelations = Property & {
  owner: Pick<User, 'id' | 'name' | 'email' | 'phone'>
  interestedUsers?: Array<Pick<User, 'id' | 'name'>>
  images: string[]
}