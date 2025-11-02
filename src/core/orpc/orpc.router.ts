import { userRouter } from '@/module/user/api/api.user.router'
import { unlazyRouter } from '@orpc/server'

const userLazyRouter = await unlazyRouter(userRouter)

export const appRouter = {
  user: userLazyRouter,
}
