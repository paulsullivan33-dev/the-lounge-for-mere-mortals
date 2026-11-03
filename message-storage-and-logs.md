# Message Storage and Logs

By the end of this chapter you can open
both of The Lounge's message stores and
read your own history out of them
without the program's help. The check
is the lab's: the channel's messages —
including ones that arrived while no
browser existed — are present in a
database file and in a plain text log,
and a query against the database returns
them (transcript `t09`).

## Why two stores

Chapter 6's restart trick — history
returning with the networks — needs
storage the program can reload quickly
and query by channel and time. Your own
wish to *keep* or grep a record needs
something else: plain text that outlives
any program. The default configuration
keeps both:

```
messageStorage: ["sqlite", "text"]
```

Each user's messages go to a SQLite
database at `logs/<user>.sqlite3` and,
in parallel, to text files at
`logs/<user>/<network>/<channel>.log`.
Both stores ran in the lab; both are in
transcript `t09`.

## The database

SQLite is a database that lives in one
file and needs no server. The Lounge's
file has a `messages` table whose rows
carry the network, channel, time, type,
and the message itself as JSON:

```
('c12bda84-…', '#lounge-lab', 1793669547057, 'message',
 '{"from":{"nick":"reader"}, "text":"First message from
   the signed-in reader", "self":true, "highlight":false, …}')
```

The lab counted eight stored messages
for its short session — joins and
messages alike are recorded, with their
highlight flags computed and kept. This
is the store `init` and `more` read
from; this is the one that makes
chapter 6 work. The `thelounge storage`
command exists to maintain it — its
`migrate` moves messages between storage
formats and `clean` deletes by the
storage policy (transcript `t13`) —
described here from its help; the lab
had nothing to migrate.

## The text logs

The parallel text log is the same
session in the oldest format there is:

```
[2026-11-03T01:32:27.057Z] <reader> First message from the signed-in reader
[2026-11-03T01:32:39.657Z] <greeter> While you were away: missed message one
[2026-11-03T01:32:42.659Z] <greeter> reader: a highlight that waited for you
```

Joins and parts are recorded as `***`
lines; messages as `<nick> text`, with
timestamps in UTC. Two properties of
this store are easy to miss and worth
stating plainly. It is **not reloaded**:
if the database is lost, the text logs
do not rebuild the client's history —
they are an archive, not a backup of
the working store. And it exists only
for users created with logging on — the
`log: true` from chapter 5's `--save-logs`.
A user without it still gets the
database, and the reload that comes with
it; they just get no text archive.

## How much is kept

In memory and in what the client will
reload, each channel is capped by
`maxHistory`, default 10,000 messages;
older ones roll off as new ones arrive.
The storage policy settings beside it
in the configuration let an operator
age messages out of the database on a
schedule. Between the cap and the
policy, "The Lounge keeps everything
forever" is not the default behaviour
of a busy channel — and chapter 13 is
honest about the other side of the same
coin: what *is* kept is a complete,
timestamped diary of a channel's life,
on one machine, under one person's
control. Whose channels those are, and
whether the channel's regulars know
they are being archived, is the ethics
line from chapter 1 wearing work
clothes.

## A note on searching

The web page offers a search across a
user's stored messages. It reads the
same database this chapter opened, and
is described here from the client
rather than exercised — the lab read
the store directly instead, which is
the stronger evidence for everything
claimed above.
