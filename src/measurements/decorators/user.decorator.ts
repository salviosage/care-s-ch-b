import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((): string[] => {
  return [
    '3cb248ba-be82-414f-b961-193db0d26e93',
    'bc7da289-3863-4da4-89fa-3df4feec5c6a',
  ];
});
