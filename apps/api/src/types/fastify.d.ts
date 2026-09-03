import "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { AccountAudience, UserRole } from "../database.js";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; email: string; role: UserRole };
    user: { sub: string; email: string; role: UserRole };
  }
}

declare module "fastify" {
  interface FastifyRequest {
    authContext: {
      id: string;
      email: string;
      role: UserRole;
      accountType: AccountAudience;
      levelId: string;
      accessToken?: string;
    };
  }

  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}
