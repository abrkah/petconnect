import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs('jwt', (): JwtModuleOptions => {
  const expiresIn = Number(process.env.JWT_EXPIRE_IN) || 3600;

  return {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn,
    },
  };
});