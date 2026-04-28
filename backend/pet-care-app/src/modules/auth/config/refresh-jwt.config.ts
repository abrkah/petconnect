import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs('jwt-refresh', (): JwtModuleOptions => {
  const expiresIn = Number(process.env.REFRESH_JWT_EXPIRE_IN) || 86400;

  return {
    secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    signOptions: {
      expiresIn,
    },
  };
});