"""Utility helpers for SentinelAI backend."""

import hashlib
from datetime import datetime


def get_file_hash(file_bytes: bytes) -> str:
    """Generate SHA-256 hash of file contents."""
    return hashlib.sha256(file_bytes).hexdigest()


def format_file_size(size_bytes: int) -> str:
    """Format file size in human-readable format."""
    for unit in ["B", "KB", "MB", "GB"]:
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} TB"


def get_timestamp() -> str:
    """Get current ISO format timestamp."""
    return datetime.utcnow().isoformat() + "Z"
