import winston from 'winston';
import { Reporter, TestCase, TestError, TestResult } from '@playwright/test/reporter';

const customColors = {
  info: 'blue',
  error: 'red',
};
winston.addColors(customColors);


export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

export default class CustomLogger implements Reporter {
  onTestBegin(test: TestCase): void {
    logger.info(`Test Case Started : ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status === 'passed') {
      logger.info(`\x1b[32mTest Case Passed : ${test.title}\x1b[0m`); // Green color
    } else if (result.status === 'skipped') {
      logger.info(`\x1b[33mTest Case Skipped : ${test.title}\x1b[0m`); // Yellow color
    } else if (result.status === 'failed' && result.error) {
      logger.error(`Test Case Failed : ${test.title}`);
      logger.error(`Error Message: ${result.error.message}`);
    }
  }

  onError(error: TestError): void {
    logger.error(error.message);
  }
}