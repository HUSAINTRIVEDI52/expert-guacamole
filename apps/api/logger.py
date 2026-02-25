import logging
import os
import sys

from loguru import logger


class InterceptHandler(logging.Handler):
    """
    Default handler from devtools to redirect standard logging to loguru.
    """

    def emit(self, record):
        # Get corresponding Loguru level if it exists
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # Find caller from where originated the logged message
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )


def setup_logging():
    """
    Configure loguru to handle all logs (terminal and file) with enhanced readability.
    """
    # Create logs directory if it doesn't exist
    os.makedirs("logs", exist_ok=True)

    # Remove default loguru handler
    logger.remove()

    # Terminal logs - with vibrant colors and cleaner format
    terminal_format = (
        "<white>{time:HH:mm:ss}</white> | "
        "<level>{level: <8}</level> | "
        "<blue>{name}</blue>:<blue>{function}</blue>:<blue>{line}</blue> - "
        "<bold><level>{message}</level></bold>"
    )
    logger.add(
        sys.stderr,
        format=terminal_format,
        level="INFO",
        colorize=True,
        backtrace=True,
        diagnose=True,
    )

    # File logs - Detailed format for debugging
    file_format = (
        "{time:YYYY-MM-DD HH:mm:ss.SSS} | "
        "{level: <8} | "
        "{name}:{function}:{line} - "
        "{message}"
    )
    logger.add(
        "logs/backend.log",
        rotation="10 MB",
        retention="10 days",
        compression="zip",
        format=file_format,
        level="DEBUG",
        backtrace=True,
        diagnose=True,
    )

    # Intercept all standard logging
    logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)

    # Suppress unnecessary logs from third-party libraries
    # Set higher levels for noisy loggers to reduce clutter
    noisy_loggers = {
        "uvicorn.access": "WARNING",  # Only show warnings/errors for access logs
        "sqlalchemy.engine": "WARNING",  # Suppress SQL query logs unless warning
        "watchfiles.main": "WARNING",
        "multipart.multipart": "WARNING",
    }

    for name, level in noisy_loggers.items():
        logging.getLogger(name).setLevel(level)

    # Specific configuration for uvicorn loggers to use loguru
    for name in ["uvicorn", "uvicorn.error", "uvicorn.access"]:
        _logger = logging.getLogger(name)
        _logger.handlers = [InterceptHandler()]
        _logger.propagate = False

    return logger
