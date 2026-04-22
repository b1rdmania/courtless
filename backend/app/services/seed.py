"""Demo dispute seeding.

Demos live in memory (see demos.py) rather than the database. This module is the
startup hook — it validates the demo fixtures exist and logs a line so ops can see
them on boot. If we ever want to mirror demos into the DB, this is the place.
"""

import logging

from .demos import DEMOS

logger = logging.getLogger("courtless.seed")


def seed_demos() -> None:
    """Called on app startup. Validates the demo fixtures."""
    for d in DEMOS:
        assert d.get("id"), "demo missing id"
        assert d.get("title"), f"demo {d.get('id')} missing title"
        assert d.get("brief"), f"demo {d.get('id')} missing brief"
        brief = d["brief"]
        for required in ("summary", "strongest_points", "weakest_points",
                         "opposing_argument", "recommended_next_step", "honest_take"):
            assert required in brief, f"demo {d['id']} brief missing {required}"
    logger.info(f"Loaded {len(DEMOS)} demo disputes: {[d['id'] for d in DEMOS]}")
