import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface UserData {
  name: string | null;
  email: string | null;
  roleId: string | null;
  verified: boolean | null;
  active: boolean | null;
}

const ResponseData = (
  status: number,
  message: string | null,
  error: any | null,
  data: any | null
) => {
  if (error != null && error instanceof Error) {
    const response = {
      status: status,
      message: message,
      errors: error,
      data: null,
    };

    return response;
  }

  const res = {
    status,
    message,
    errors: error,
    data: data,
  };

  return res;
};

// 10 minute
const GenerateToken = (data: any): string => {
  const token = JWT.sign(data, process.env.JWT_TOKEN as string, {
    expiresIn: "10m",
  });

  return token;
};

// 1 day
const RefreshToken = (data: any): string => {
  const token = JWT.sign(data, process.env.REFRESH_TOKEN as string, {
    expiresIn: "1d",
  });

  return token;
};

const ExtractToken = (token: string): UserData | null => {
  const secretKey: string = process.env.JWT_TOKEN as string;

  let resData: any;

  const res = JWT.verify(token, secretKey, (err, decoded) => {
    if (err) {
      resData = null;
    } else {
      resData = decoded;
    }
  });

  if (resData) {
    const result: UserData = <UserData>resData;
    return result;
  }

  return null;
};

const ExtractRefreshToken = (token: string): UserData | null => {
  const secretKey: string = process.env.REFRESH_TOKEN as string;

  let resData: any;

  const res = JWT.verify(token, secretKey, (err, decoded) => {
    if (err) {
      resData = null;
    } else {
      resData = decoded;
    }
  });

  if (resData) {
    const result: UserData = <UserData>resData;
    return result;
  }

  return null;
};
export default {
  ResponseData,
  GenerateToken,
  RefreshToken,
  ExtractToken,
  ExtractRefreshToken,
};
