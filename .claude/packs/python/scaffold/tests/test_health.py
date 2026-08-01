"""Health check integration test — exercises the real app via TestClient.

Deletable: replace it when the first real endpoint lands. The `app.main`
import works through the `pythonpath = ["src"]` in [tool.pytest].
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_ok() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert "time" in body
