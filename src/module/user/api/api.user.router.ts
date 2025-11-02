import { protectedProcedure } from '@/core/orpc/orpc.server'
import { userController } from './api.user.controller'

const user = protectedProcedure.user

export const userRouter = protectedProcedure.router({
  user: {
    get: user.get.handler(({ input }) => userController.get({ input })),
    getMany: user.getMany.handler(({ input }) => userController.getMany({ input })),
    create: user.create.handler(({ input }) => userController.create({ input })),
    update: user.update.handler(({ input }) => userController.update({ input })),
    delete: user.delete.handler(({ input }) => userController.delete({ input })),
  },
})
