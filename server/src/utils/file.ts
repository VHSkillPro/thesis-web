import { unlink } from 'fs';

export const removeFile = (filePath: string) => {
  unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      throw err;
    }
  });
};
