export const RevolutAction = {
  REGISTRATION: 'registration',
  TRANSFER: 'transfer',
} as const;

export const revolutActions = [
  RevolutAction.REGISTRATION,
  RevolutAction.TRANSFER,
];

export type RevolutActionType =
  (typeof RevolutAction)[keyof typeof RevolutAction];

export const RevolutRequest = {
  PAYMENT_PROFILE: 'payment_profile',
  TRANSFER_DETAILS: 'transfer_details',
};

export type RevolutRequestType =
  (typeof RevolutRequest)[keyof typeof RevolutRequest];
