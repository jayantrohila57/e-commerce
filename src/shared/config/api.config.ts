export const STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  FAILED: 'failed',
}

export const API_MESSAGE = {
  OVERVIEW: {
    TOP10: {
      SUCCESS: 'Top 10 fetched successfully',
      FAILED: 'Failed to fetch top 10 due to a database error.',
      ERROR: 'Failed to fetch top 10 due to a database error.',
    },
    STATS: {
      SUCCESS: 'Stats fetched successfully',
      FAILED: 'Failed to fetch stats due to a database error.',
      ERROR: 'Failed to fetch stats due to a database error.',
    },
    OVER_VIEW: {
      SUCCESS: 'Over view fetched successfully',
      FAILED: 'Failed to fetch Over view .',
      ERROR: 'Something went wrong',
    },
  },
  SETTINGS: {
    GET: {
      SUCCESS: 'Settings fetched successfully',
      FAILED: 'Failed to fetch settings due to a database error.',
      ERROR: 'Failed to fetch settings due to a database error.',
    },
    UPDATE: {
      SUCCESS: 'Settings updated successfully',
      FAILED: 'Failed to update settings due to a database error.',
      ERROR: 'Failed to update settings due to a database error.',
    },
  },
  USER: {
    CREATE: {
      SUCCESS: 'User created successfully',
      FAILED: 'Failed to create user due to a database error.',
      ERROR: 'Failed to create user due to a database error.',
    },
    UPDATE: {
      SUCCESS: 'User updated successfully',
      FAILED: 'Failed to update user due to a database error.',
      ERROR: 'Failed to update user due to a database error.',
    },
    OVER_VIEW: {
      SUCCESS: 'User overview fetched successfully',
      FAILED: 'Failed to fetch user overview due to a database error.',
      ERROR: 'Failed to fetch user overview due to a database error.',
    },
    DELETE: {
      SUCCESS: 'User deleted successfully',
      SUCCESS_PERMANENT: 'User deleted permanently',
      SUCCESS_SOFT: 'User soft-deleted',
      FAILED: 'Failed to delete user due to a database error.',
      ERROR: 'Failed to delete user due to a database error.',
    },
    GET_USER: {
      SUCCESS: 'User fetched successfully',
      FAILED: 'Failed to fetch user due to a database error.',
      ERROR: 'Failed to fetch user due to a database error.',
    },
    GET_USERS: {
      SUCCESS: 'Users fetched successfully',
      FAILED: 'Failed to fetch users due to a database error.',
      ERROR: 'Failed to fetch users due to a database error.',
    },
    USER_ORDER: {
      SUCCESS: 'Users orders fetched successfully',
      FAILED: 'Failed to fetch users order.',
      ERROR: 'Something went wrong.',
    },
    OVER_VIEW_S: {
      SUCCESS: 'Users overview fetched successfully',
      FAILED: 'Failed to fetch users overview.',
      ERROR: 'Something went wrong.',
    },
    UPDATE_USER_ROLE: {
      SUCCESS: 'User role updated successfully',
      FAILED: 'Failed to update user role.',
      ERROR: 'Something went wrong.',
      NOT_FOUND: 'User not found',
      CONFLICT: 'User role already updated or same',
    },
    USER_CURRENT_PLAN: {
      SUCCESS: 'Users current plan fetched successfully',
      FAILED: 'Failed to fetch users current plan.',
      ERROR: 'Something went wrong.',
      PLAN_NOT_FOUND: 'No subscribe any plan',
    },
  },
  LEAD: {
    CREATE_LEADS: {
      SUCCESS: 'Leads created successfully',
      FAILED: 'Failed to create leads',
      ERROR: 'failed to create leads due to database error',
    },
    GET_LEAD_LIST: {
      SUCCESS: 'Leads fetched successfully',
      FAILED: 'Failed to fetch user listing',
      ERROR: 'Something went wrong',
    },
    REQUEST_LEAD: {
      SUCCESS: 'Request Leads  successfully',
      FAILED: 'Failed to request lead',
      ERROR: 'Something went wrong',
      NOT_ACCEPTABLE: 'Some of the lead have not found or already proceed',
    },
    OVER_VIEW: {
      SUCCESS: 'lead overview fetched successfully',
      FAILED: 'Failed to fetch lead overview.',
      ERROR: 'Something went wrong.',
    },
    UPDATE_LEAD: {
      SUCCESS: 'lead updated successfully',
      FAILED: 'Failed to update lead',
      ERROR: 'Something went wrong.',
    },
    DELETE_LEAD: {
      SUCCESS: 'Lead deleted successfully',
      FAILED: 'Failed to delete lead',
      ERROR: 'Something went wrong.',
    },
  },
  WHATSAPP_CAMPAIGN: {
    CREATE: {
      SUCCESS: 'WhatsApp campaign created successfully',
      FAILED: 'Failed to create WhatsApp campaign',
      ERROR: 'Something went wrong while creating campaign',
    },
    GET_LIST: {
      SUCCESS: 'WhatsApp campaigns fetched successfully',
      FAILED: 'Failed to fetch WhatsApp campaigns',
      ERROR: 'Something went wrong while fetching campaigns',
    },
    UPDATE: {
      SUCCESS: 'WhatsApp campaign updated successfully',
      FAILED: 'Failed to update WhatsApp campaign',
      ERROR: 'Something went wrong while updating campaign',
    },
    DELETE: {
      SUCCESS: 'WhatsApp campaign deleted successfully',
      FAILED: 'Failed to delete WhatsApp campaign',
      ERROR: 'Something went wrong while deleting campaign',
    },
    OVERVIEW: {
      SUCCESS: 'WhatsApp campaign overview fetched successfully',
      FAILED: 'Failed to fetch WhatsApp campaign overview',
      ERROR: 'Something went wrong while fetching overview',
    },
    START: {
      SUCCESS: 'WhatsApp campaign started successfully',
      FAILED: 'Failed to start WhatsApp campaign',
      ERROR: 'Something went wrong while starting campaign',
    },
    PAUSE: {
      SUCCESS: 'WhatsApp campaign paused successfully',
      FAILED: 'Failed to pause WhatsApp campaign',
      ERROR: 'Something went wrong while pausing campaign',
    },
    RESUME: {
      SUCCESS: 'WhatsApp campaign resumed successfully',
      FAILED: 'Failed to resume WhatsApp campaign',
      ERROR: 'Something went wrong while resuming campaign',
    },
    CANCEL: {
      SUCCESS: 'WhatsApp campaign cancelled successfully',
      FAILED: 'Failed to cancel WhatsApp campaign',
      ERROR: 'Something went wrong while cancelling campaign',
    },
  },
  WHATSAPP_TEMPLATE: {
    CREATE: {
      SUCCESS: 'WhatsApp template created successfully',
      FAILED: 'Failed to create WhatsApp template',
      ERROR: 'Something went wrong while creating template',
    },
    GET_LIST: {
      SUCCESS: 'WhatsApp templates fetched successfully',
      FAILED: 'Failed to fetch WhatsApp templates',
      ERROR: 'Something went wrong while fetching templates',
    },
    UPDATE: {
      SUCCESS: 'WhatsApp template updated successfully',
      FAILED: 'Failed to update WhatsApp template',
      ERROR: 'Something went wrong while updating template',
    },
    DELETE: {
      SUCCESS: 'WhatsApp template deleted successfully',
      FAILED: 'Failed to delete WhatsApp template',
      ERROR: 'Something went wrong while deleting template',
    },
  },
  WHATSAPP_MESSAGE: {
    GET_LIST: {
      SUCCESS: 'WhatsApp messages fetched successfully',
      FAILED: 'Failed to fetch WhatsApp messages',
      ERROR: 'Something went wrong while fetching messages',
    },
    RESEND: {
      SUCCESS: 'WhatsApp message resent successfully',
      FAILED: 'Failed to resend WhatsApp message',
      ERROR: 'Something went wrong while resending message',
    },
    UPDATE_STATUS: {
      SUCCESS: 'WhatsApp message status updated successfully',
      FAILED: 'Failed to update WhatsApp message status',
      ERROR: 'Something went wrong while updating message status',
    },
  },
  WHATSAPP_API_KEY: {
    CREATE: {
      SUCCESS: 'WhatsApp API key created successfully',
      FAILED: 'Failed to create WhatsApp API key',
      ERROR: 'Something went wrong while creating WhatsApp API key',
    },
    UPDATE: {
      SUCCESS: 'WhatsApp API key updated successfully',
      FAILED: 'Failed to update WhatsApp API key',
      ERROR: 'Something went wrong while updating WhatsApp API key',
    },
    DELETE: {
      SUCCESS: 'WhatsApp API key deleted successfully',
      FAILED: 'Failed to delete WhatsApp API key',
      ERROR: 'Something went wrong while deleting WhatsApp API key',
    },
    GET: {
      SUCCESS: 'WhatsApp API keys fetched successfully',
      FAILED: 'Failed to fetch WhatsApp API keys',
      ERROR: 'Something went wrong while fetching WhatsApp API keys',
    },
    GET_BY_ID: {
      SUCCESS: 'WhatsApp API key fetched successfully',
      FAILED: 'Failed to fetch WhatsApp API key',
      ERROR: 'Something went wrong while fetching WhatsApp API key',
    },
  },
  SESSION: {
    EXPIRED: 'User  session not found',
  },
  AUTH: {
    SIGNUP: {
      SUCCESS: 'Otp Send Your Mail',
      FAILED: 'Failed to sign up ',
      ERROR: 'failed to sign up due to database error',
      ALREADY_EXITS: 'Email already exits',
      FAILED_TO_SEND_OTP: 'Failed to send otp',
    },
    OTP_VERIFICATION: {
      SUCCESS: 'OTP successfully verified',
      ERROR: 'Failed to verified otp',
      INVALID_OTP_TIMESTAMP: 'Invalid  or expired otp time stamp',
      INVALID_OTP: 'Invalid  or expired otp ',
      OTP_EXP: 'Otp Expired',
      USER_NOT_FOUND: 'User not found',
      FAILED: 'Failed to otp verification',
    },
    RESEND_OTP: {
      SUCCESS: 'OTP send successfully',
      FAILED: 'Failed to send otp',
    },
    CHANGE_PASSWORD: {
      SUCCESS: 'Password updated successfully',
      FAILED: 'Failed to updated password',
      ERROR: 'Something went wrong ',
      ONE_INPUT_REQUIRED: 'Token or userId one of them required',
      OLD_PASSWORD_REQUIRED: 'Old password is required',
      PASSWORD_NOT_MATCH: 'Old password not match',
      TOKEN_EXP: 'Session End retry to forgot password',
    },
  },
  ORDER: {
    CREATE: {
      SUCCESS: 'Order proceed.',
      FAILED: 'Failed to proceed order',
      ERROR: 'Something went wrong',
      USER_PLAN_EXIT: 'Your current plan active . you buy new plan after this expire',
      EMAIL_NOT_VERIFY: 'First verify you email',
    },
    VERIFY: {
      SUCCESS: 'Order placed successfully.',
      FAILED: 'order failed',
      ERROR: 'Something went wrong',
    },
    SAVE: {
      SUCCESS: 'Save payment successfully.',
      FAILED: 'failed to save payment',
      ERROR: 'Something went wrong',
    },
    SUBSCRIPTION_LIST: {
      SUCCESS: 'Subscription list fetch successfully.',
      FAILED: 'failed to fetch Subscription list',
      ERROR: 'Something went wrong',
    },
    OVER_VIEW: {
      SUCCESS: 'Order overview fetched successfully',
      FAILED: 'Failed to fetch Order overview.',
      ERROR: 'Something went wrong.',
    },
  },
}
