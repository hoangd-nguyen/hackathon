import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const getCounter: APIGatewayProxyHandlerV2 = async (event) => {
  // TODOa
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
  };
};
