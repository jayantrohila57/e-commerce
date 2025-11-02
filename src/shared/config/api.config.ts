export const STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  FAILED: 'failed',
} as const

export const MESSAGE = {
  USER: {
    CREATE: {
      SUCCESS: 'User created successfully.',
      FAILED: 'Failed to create user.',
      ERROR: 'Unexpected error while creating user.',
    },
    GET: {
      SUCCESS: 'User retrieved successfully.',
      FAILED: 'User not found.',
      ERROR: 'Unexpected error while retrieving user.',
    },
    GET_MANY: {
      SUCCESS: 'Users retrieved successfully.',
      FAILED: 'No users found.',
      ERROR: 'Unexpected error while retrieving users.',
    },
    UPDATE: {
      SUCCESS: 'User updated successfully.',
      FAILED: 'Failed to update user.',
      ERROR: 'Unexpected error while updating user.',
    },
    DELETE: {
      SUCCESS: 'User deleted successfully.',
      FAILED: 'Failed to delete user.',
      ERROR: 'Unexpected error while deleting user.',
    },
  },
} as const
