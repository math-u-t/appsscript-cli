import { logger } from '../utils/logger';

export async function devCommand(options: { port?: string; open?: boolean }): Promise<void> {
  try {
    const port = options.port || '3000';

    logger.info(`Starting development server on port ${port}...`);

    // TODO: Implement development server with hot reload
    logger.warning('Dev server is not yet fully implemented');
  } catch (error) {
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
