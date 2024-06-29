const MESSAGES = {
    BUSINESS_DECLINED: 'Business declined due to unsupported industry.',
    PROVIDE_CONTACT_INFO: 'Provide contact information to move to Sales Approved.',
    DECIDE_WON_OR_LOST: 'Decide if the business is Won or Lost.',
    BUSINESS_MARKED: (status) => `Business has been marked as ${status}.`,
    NO_FURTHER_STEPS: 'No further steps available.',
    INDUSTRY_REQUIRED: 'Provide industry information to move to Market Approved or Market Declined.',
    VALID_CONTACT_REQUIRED: 'Valid contact information is required to progress.',
    RESULT_REQUIRED: 'Result must be either "Won" or "Lost".',
    BUSINESS_NOT_FOUND: 'Business not found.',
    USER_ALREADY_EXISTS: 'User already exists.',
    INVALID_CREDENTIALS: 'Invalid credentials.',
};

module.exports = { MESSAGES };
