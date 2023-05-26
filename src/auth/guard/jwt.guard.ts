import { AuthGuard } from '@nestjs/passport';

const GUARD = 'jwt';

export class JwtGuard extends AuthGuard(GUARD) {}
