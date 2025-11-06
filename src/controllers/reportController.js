import { customerBehavior, inventorySnapshot, salesSummary } from '../reporting/reportService.js';
import { exportToCSV, exportToJSON } from '../utils/exporters.js';

export const salesReport = async (req, res, next) => {
  try {
    const { from, to, format } = req.query;
    const report = await salesSummary({ from, to });
    if (format === 'csv') {
      const file = await exportToCSV('sales_report.csv', report);
      return res.download(file);
    }
    if (format === 'json') {
      return res.json(JSON.parse(exportToJSON(report)));
    }
    res.json(report);
  } catch (error) {
    next(error);
  }
};

export const inventoryReport = async (req, res, next) => {
  try {
    const report = await inventorySnapshot();
    res.json(report);
  } catch (error) {
    next(error);
  }
};

export const customerReport = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const report = await customerBehavior({ from, to });
    res.json(report);
  } catch (error) {
    next(error);
  }
};
