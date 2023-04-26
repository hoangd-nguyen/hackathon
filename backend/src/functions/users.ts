import { truncateAllTables } from '@backend/db/seed/truncate';
import { userFactory } from '@backend/db/factory/user';
import { Prisma } from '@prisma/client';

const { prisma } = await import('@backend/db/clientSync');

export const generateUsers: APIGatewayProxyHandlerV2 = async (event) => {
    const users = await prisma.user.createMany({ data: userFactory.buildList(5) });
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(users),
    };
  };


export const getUsers: APIGatewayProxyHandlerV2 = async (event) => {
    const users = await prisma.user.findMany();
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(users),
    };
  };