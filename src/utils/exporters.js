import { createObjectCsvWriter } from 'csv-writer';

export const exportToJSON = (data) => JSON.stringify(data, null, 2);

export const exportToCSV = async (filePath, data) => {
  if (!data.length) return null;
  const header = Object.keys(data[0]).map((key) => ({ id: key, title: key }));
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header
  });
  await csvWriter.writeRecords(data);
  return filePath;
};
