import * as bcrypt from 'bcrypt';

export const hashString = async (str: string): Promise<string> =>{
  const saltRounds = 10;
  return await bcrypt.hash(str, saltRounds);
}

export const compareWithHashString = async (plainStr: string, hashedStr: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plainStr, hashedStr);
  return isMatch;
}