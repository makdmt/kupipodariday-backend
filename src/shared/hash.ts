import * as bcrypt from 'bcrypt';

export const hashValue = (value: string) => bcrypt.hash(value, 10);

export const isCorrectHash = (value: string, hash: string) => bcrypt.compare(value, hash);