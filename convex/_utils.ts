import { QueryCtx, MutationCtx } from './_generated/server';

export const getUserByClerkId = async (ctx: QueryCtx | MutationCtx, subject: string) => {
  return await ctx.db
    .query('users')
    .withIndex('by_clerkId' as never, (q) =>
      q.eq('clerkId' as never, subject as never)
    )
    .unique();
};
