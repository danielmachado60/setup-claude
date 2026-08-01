# Pack python — Python backends and automations

> **How this file works:** this PACK.md defines the pack's conventions. The project's ABOUT.md
> is the local source of truth — in any conflict, ABOUT.md wins. Read both before any task.
> Wherever this file says "per ABOUT.md", the decision is per project and must be recorded
> there (under `## Constraints and notes`); if it isn't, ask before assuming. The
> `python-specialist` agent resides in `.claude/agents/` and activates when ABOUT.md points to
> this pack (`Active pack: python`).

## Pack scope

Python backend APIs and services, automation scripts (integrations, light ETL, client
routines) and internal CLIs. Heavy data science and ML are outside the agency's default scope.

## Default stack

| Role | Pack default | Note |
|---|---|---|
| Python | 3.11+ | version pinned in `.python-version` |
| Environment/deps | **uv** (preferred) | `venv` + `pip` accepted in a legacy project — record it in ABOUT.md |
| Lint + format | ruff (lint **and** format) | config in `pyproject.toml`; black does not enter a new project |
| Types | mandatory type hints + mypy | strict in new code |
| API framework | FastAPI (default) | adjustable in the project's ABOUT.md (e.g. legacy Flask, Django) |
| Validation | Pydantic v2 | at the application's edges |
| Tests | pytest | fixtures + parametrize; no unittest in new code |
| Script CLI | argparse or Typer | per ABOUT.md; every automation has a clear CLI |

## Environment and dependencies

- With uv: `uv sync` installs, `uv run <cmd>` executes, `uv add <pkg>` adds. Lock file
  (`uv.lock`) always committed. Never a loose `pip install` in a uv project.
- With venv/pip (legacy): `requirements.txt` with pinned versions + `requirements-dev.txt`;
  document in ABOUT.md (`## Project commands`) how to activate it.
- All tool configuration (ruff, mypy, pytest) lives in `pyproject.toml` — no
  `setup.cfg`/`.flake8`/scattered config files.
- A new dependency requires justification: if the stdlib solves it in a few lines, use the
  stdlib.

## src/ structure (mandatory)

```
pyproject.toml
.python-version
src/
  <package>/           # package name in snake_case
    __init__.py
    main.py            # entrypoint of the API (FastAPI app) or the CLI
    config.py          # settings via pydantic-settings: env validated at boot, fail fast
    routers/           # HTTP layer: routes, status codes, dependencies
    services/          # pure business logic — no HTTP, no SQL
    repositories/      # data access — no business logic
    schemas/           # Pydantic request/response models
    models/            # persistence entities (SQLAlchemy) or domain dataclasses
    exceptions.py      # the project's own domain exception hierarchy
tests/
  integration/         # TestClient/httpx against the real app
  unit/                # services and pure functions
  conftest.py
```

For a simple automation script, the minimum is: `src/<package>/` with `main.py` + `config.py`
+ tests. Don't create empty layers for a 200-line script — but it still lives in `src/`, has
hints, ruff and at least one test of the main flow.

## Type hints and mypy

- Hints on **every** public function/method signature. No `Any` without a justifying comment;
  prefer precise types, `TypedDict`/dataclass instead of a generic `dict`.
- mypy strict passing in CI for new code. Legacy project: strict per module, expanding with
  every delivery.
- `Protocol` for contracts between layers (e.g. a service depends on a repository Protocol) —
  testable structural typing, no forced inheritance.
- Single source of truth: the Pydantic model defines schema + validation + serialization;
  never duplicate the shape by hand elsewhere.

## Code patterns

- **Pydantic at the edges, dataclasses in the core:** validate on the way in (request, file,
  external API response); internally use dataclasses (`frozen=True` when possible) —
  validation has a cost.
- **The project's own domain exceptions** inheriting from a project base. A silent
  `except Exception` fails review; catch the specific type and handle or re-raise.
- **Context managers** (`with`/`async with`) for every resource: file, connection, lock,
  HTTP session.
- **Correct async in an API:** an `async def` route never calls blocking I/O (`requests`,
  `time.sleep`, a sync driver). Use `httpx.AsyncClient`, `asyncio.gather` for parallel calls
  and `run_in_executor` for an unavoidable blocking lib. If the handler is fully synchronous,
  declare a plain `def` and let FastAPI use the threadpool.
- **Generators/`yield`** for large datasets — never materialize a giant list in memory.
- **`match/case`** for dispatch over variants instead of an `if isinstance` chain.
- Layers in an API: `routers → services → repositories`, injection via FastAPI's `Depends`.
  Business logic in a router fails review.
- Database schema migration via Alembic; never a manual `ALTER TABLE`.
- Google-style docstrings on public APIs — in English unless ABOUT.md Constraints say
  otherwise.

## Automation scripts — a clear CLI

Every automation delivered to a client or run by a scheduler complies with:

- CLI with a useful `--help` (argparse or Typer): description of what it does, documented
  arguments, usage examples in the epilog.
- `--dry-run` when the script writes to/deletes something external (database, API, client
  files).
- Correct exit codes: 0 success, ≠ 0 failure — schedulers and CI depend on this.
- Logs to stderr with a configurable level (`-v`); result/report to stdout or a file.
- Idempotent whenever possible: running twice does not duplicate the effect.
- Configuration via env vars/file validated at startup (pydantic-settings) — if config fails,
  the script dies with a clear message before doing anything.

## Tests

- pytest with fixtures and `parametrize`; test names describe the behavior
  (`test_rejects_invalid_email`, not `test_1`).
- API: integration tests with `TestClient`/httpx covering the happy path, validation 422,
  401/403 when protected, and 404.
- Mock only external services (third-party API, email); a real, isolated test database for
  integration.
- Coverage ≥ 90% in domain code (services); don't chase 100% in glue code.

## Acceptance checklist (before calling it done)

- [ ] `uv run ruff check .` and `uv run ruff format --check .` clean
- [ ] `uv run mypy` clean on the touched code
- [ ] Hints on every public function; zero `Any` without justification
- [ ] External input validated with Pydantic at the edge
- [ ] No silent `except Exception` introduced
- [ ] Open resources handled with context managers
- [ ] `uv run pytest` green; new tests for the new behavior
- [ ] Automation script: useful `--help`, correct exit codes, `--dry-run` if destructive
- [ ] New env vars in the settings **and** in `.env.example`; `.env` in `.gitignore`

## Anti-patterns (fail review)

- Blocking I/O inside an `async def` route.
- Business logic in a router, or a query outside a repository.
- A generic `dict` crossing layers instead of a typed model.
- Mutable default argument (`def f(x=[])`).
- Import with side effects (connecting to a database/reading a file at module import).
- Script without a CLI: hardcoded values that require editing the code to run it again.
- `print` as logging in production code.
- Installing a dependency outside the project's manager (loose pip in a uv project).
