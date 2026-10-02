#!/usr/bin/env python3
"""Publish due items from content/<week>/queue.json via `ig-post`.

Run every 15 min (systemd timer). Only items with approved=true and
status=pending whose `at` has passed (and is <6h stale) are posted.
Failures are marked failed + Telegram-alerted, never auto-retried.
Kill switch: touch $PRIYANSHI_PAUSE (default ~/priyanshi-PAUSE).
"""

import argparse, json, os, subprocess, sys, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

STALE = timedelta(hours=6)  # ponytail: skip, don't backfill, after long downtime


def notify(msg: str) -> None:
    tok, chat = os.environ.get("TG_BOT_TOKEN"), os.environ.get("TG_CHAT_ID")
    if not (tok and chat):
        return
    data = urllib.parse.urlencode(
        {"chat_id": chat, "text": f"[priyanshi-post] {msg}"}
    ).encode()
    try:
        urllib.request.urlopen(
            f"https://api.telegram.org/bot{tok}/sendMessage", data, timeout=15
        )
    except Exception as e:  # alerting must not crash the poster
        print("telegram failed:", e, file=sys.stderr)


def cmd(item: dict) -> list[str]:
    t, urls, cap = item["type"], item["urls"], item.get("caption")
    if t == "image":
        c = ["image", urls[0]]
    elif t == "carousel":
        c = ["carousel", *urls]
    elif t == "reel":
        c = ["reel", urls[0]] + (
            ["--cover", item["cover"]] if item.get("cover") else []
        )
    elif t == "story":
        flag = "--video" if urls[0].endswith(".mp4") else "--image"
        return ["ig-post", "story", flag, urls[0], "--json"]
    else:
        raise ValueError(f"unknown type {t}")
    return ["ig-post", *c, *(["--caption", cap] if cap else []), "--json"]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("queue", type=Path)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--now", help="ISO time override (testing)")
    a = ap.parse_args()

    if Path(
        os.environ.get("PRIYANSHI_PAUSE", Path.home() / "priyanshi-PAUSE")
    ).exists():
        print("paused")
        return 0
    now = datetime.fromisoformat(a.now) if a.now else datetime.now(timezone.utc)
    q = json.loads(a.queue.read_text())
    due = [
        i
        for i in q
        if i.get("approved")
        and i.get("status", "pending") == "pending"
        and datetime.fromisoformat(i["at"]) <= now
    ]
    for item in sorted(due, key=lambda i: i["at"]):
        if now - datetime.fromisoformat(item["at"]) > STALE:
            print("SKIP stale", item["id"])
            if a.dry_run:
                continue
            item["status"] = "skipped-stale"
            notify(f"skipped stale {item['id']}")
            continue
        c = cmd(item)
        print("POST", item["id"], " ".join(c[:3]))
        if a.dry_run:
            continue
        r = subprocess.run(c, capture_output=True, text=True, timeout=600)
        if r.returncode == 0:
            item["status"], item["result"] = "posted", r.stdout.strip()[-500:]
            item["posted_at"] = datetime.now(timezone.utc).isoformat()
        else:
            item["status"], item["error"] = (
                "failed",
                (r.stdout + r.stderr).strip()[-500:],
            )
            notify(f"FAILED {item['id']}: {item['error'][:300]}")
        tmp = a.queue.with_suffix(
            ".tmp"
        )  # write after each post so a crash can't double-post
        tmp.write_text(json.dumps(q, indent=2, ensure_ascii=False))
        tmp.replace(a.queue)
    if due and not a.dry_run:
        tmp = a.queue.with_suffix(".tmp")
        tmp.write_text(json.dumps(q, indent=2, ensure_ascii=False))
        tmp.replace(a.queue)
    if not due:
        print("nothing due")
    return 0


if __name__ == "__main__":
    sys.exit(main())
