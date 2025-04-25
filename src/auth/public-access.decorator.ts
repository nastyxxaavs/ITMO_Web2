import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ACCESS_KEY = 'isPublic';
export const PublicAccess = () => SetMetadata(PUBLIC_ACCESS_KEY, true);