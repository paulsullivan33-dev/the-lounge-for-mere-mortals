# The Moving Parts

By the end of this chapter you can name
each part of a running Lounge, say where
it keeps its state, and predict — before
you meet the behaviour — which part is
responsible for it. The check: after
reading, look at the home folder listing
below and match every entry to a part.

The Lounge is a single program, written
in JavaScript and run by **Node.js**, the
runtime that executes JavaScript outside
a browser. One server process does every
job: it serves the web page, holds the
IRC connections, stores the messages,
and answers the page's requests. There
is no separate database server and no
second daemon. When the process stops,
all of it stops — chapter 6 shows what
survives that, and why.

## The home folder

Everything the server owns lives in one
folder, named by the environment
variable `THELOUNGE_HOME`, or
`~/.thelounge` when the variable is not
set. The lab always sets it explicitly,
and so should any script you write. On
first start the server creates it and
writes into it:

```
config.js    the configuration file (chapter 10)
users/       one JSON file per user, in private mode
logs/        message storage: a database and text logs
packages/    installed themes and packages
uploads/     uploaded files, once uploads are enabled
vapid.json   keys for push notifications
```

The check from the lab (transcript
`t03`): the folder a public-mode start
created held exactly `config.js`,
`logs`, `packages`, `users` and
`vapid.json` — nothing was written
anywhere else.

## The configuration file

`config.js` is a JavaScript file — the
same commented default file you can read
in the project's documentation — and the
server reads it at start. Two facts
about it drive several later chapters:
it is only read at start, so edits need
a restart; and the command line can
override single entries for one run
without touching the file, which is how
the lab runs everything. Chapter 10
tours the entries that matter.

## Users

In private mode, a user is a JSON file
in `users/`, named after the user. The
lab's, with its password hash shortened,
is transcript `t05`:

```json
{ "password": "$2a$11$B8x9wY5wb4B...", "log": true }
```

The password is stored as a **bcrypt
hash** — a one-way scramble the server
can check a guess against but cannot
reverse — never as the password itself.
The file also grows to hold the user's
networks as they are added. Users are
managed only from the command line
(`thelounge add`, `list`, `remove`,
`reset`, `edit`); there is deliberately
no sign-up page.

## Networks, channels, and the lobby

A signed-in user's world is a list of
**networks** — connections to IRC
servers. Each network holds **channels**
(rooms whose names start with `#`) and
private conversations, plus one special
window The Lounge adds itself: the
**lobby**, the network's front desk,
where connection news, errors and the
network's message of the day collect.
When something fails, the lobby is where
the explanation lands — chapter 14 reads
one.

## The IRC connection

For each network, the server process
makes one ordinary IRC connection, with
the user's chosen nickname, and keeps it
open for as long as the user is meant to
be present — in private mode, that means
always, browser or no browser. From the
IRC network's point of view, The Lounge
is simply a user who never sleeps. The
lab proves this from the outside: its
fixture IRC server's member list still
shows the lab's user present after every
browser is gone (transcript
`t07-speaker-persist`).

## The browser socket

The page and the server stay in contact
over a **socket** — a live two-way
connection (the socket.io library, over
a WebSocket where possible). Down it
flow events with plain names: `init`
(your whole world, at sign-in), `msg`
(a message), `network`, `join`, `open`
("I have read this far"). Up it flow
your keystrokes, as `input`, and your
requests: connect to a network, fetch
older history, mark as read. This
guide's lab script, `lounge-client.js`,
speaks exactly this protocol, so the
transcripts show the same events the
real page renders — a message arriving
is an event line in a transcript and a
new line in a channel on the page, one
and the same fact.

## Message storage

Messages are kept twice, for two
different jobs, when the storage setting
keeps its default of `["sqlite",
"text"]`:

- A **SQLite database**, one per user in
  `logs/`, is what The Lounge reloads
  from — it is how history comes back
  after a restart.
- **Text logs**, one file per channel in
  a folder tree under `logs/<user>/`,
  are for reading and keeping outside
  the program — plain lines with
  timestamps. They are *not* reloaded
  into the client.

Per-user logging is a switch set when
the user is created (`log: true` above),
and how much is kept is capped by
`maxHistory` — 10,000 messages per
channel by default. Chapter 7 opens
both stores and reads them.

## Packages

Themes and a small family of extension
packages live under `packages/`, managed
with the `thelounge install` command and
loaded at server start. Chapter 9
installs one and watches the server log
announce it.

## What is not a part

There is no web server in front, no
external database, and no account system
beyond the user files. The program you
installed is the whole machine — which
is why its limits, in chapter 13, are
mostly the limits of one process holding
everything.
