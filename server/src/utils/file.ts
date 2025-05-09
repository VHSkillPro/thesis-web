import { unlink, existsSync } from 'fs';

export const removeFile = (filePath: string) => {
  if (!existsSync(filePath)) {
    console.error('File does not exist:', filePath);
    return;
  }

  unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      throw err;
    }
  });
};
