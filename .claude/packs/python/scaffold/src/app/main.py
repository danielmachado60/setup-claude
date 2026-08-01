"""API entrypoint — minimal FastAPI app with a health check.

Deletable example: replace the route when the real domain lands. From the
second endpoint on, migrate to the full PACK.md structure
(routers/ -> services/ -> repositories/, config.py with pydantic-settings).
"""

from datetime import UTC, datetime

from fastapi import FastAPI
from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Health check response, consumed by the orchestrator and monitoring."""

    status: str
    time: datetime


app = FastAPI(title="my-api")


@app.get("/health")
def check_health() -> HealthResponse:
    """API health check.

    Synchronous handler on purpose (no I/O here): a plain `def` lets FastAPI
    use the threadpool — never mark `async` without an await (PACK.md).
    When there are critical dependencies (database, queue), verify them here
    before answering "ok".
    """
    return HealthResponse(status="ok", time=datetime.now(UTC))
