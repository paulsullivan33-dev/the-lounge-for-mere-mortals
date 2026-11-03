# Troubleshooting

The failures below are the ones this
guide's lab actually met, in the order a
new operator is likely to meet them,
each with the check that names it. The
lab's scripts contributed two of their
own, which are included because readers
driving the socket themselves will meet
them too.

## `thelounge add` says the users folder does not exist

```
[ERROR] .../home-private/users does not exist.
```

The home folder is fresh and the server
has never run in it, so `users/` was
never created. The check is the folder
listing; the fix is one command —
`mkdir -p` the `users` folder (or start
the server once first) — and the proof
is `add` succeeding immediately after
(transcript `t05`).

## The password prompt "eats" piped answers

Feeding `thelounge add <name>` from a
pipe or a script lands the password in
the wrong prompt and creates nobody —
`thelounge list` still shows no users.
The interactive prompt wants a real
terminal. In scripts, skip it:
`thelounge add <name> --password '...'
--save-logs` does the whole job in one
non-interactive line (transcript `t05`).

## Sign-in keeps failing — and the log knows

The client side of a bad sign-in says
only `auth:failed`; it will not tell
you whether the user or the password
was wrong, and that silence is correct
behaviour. The operator's side is
clearer: the server log records
`Authentication failed for user <name>
from <address>` for a real user with a
wrong password, and a different line —
authentication for a *non existing*
user — when the name itself is unknown
(transcript `t06`). If a user swears
the password is right, `thelounge list`
plus that log line separate "account
missing" from "password wrong"; a
genuinely forgotten password ends with
`thelounge reset <name>`.

## "Connection closed unexpectedly" in the lobby

```
event msg chan#3: Connection closed unexpectedly:
  Error: connect ECONNREFUSED 127.0.0.1:19999
event msg chan#3: Disconnected from the network, and will not
  reconnect. Use /connect to reconnect again.
```

A network that cannot connect reports
in its **lobby**, not in a channel —
the first place to look whenever a
network seems silently absent.
`ECONNREFUSED` with an address and port
means the machine answered and nothing
was listening there: wrong port, wrong
host, or the IRC server not started.
The Lounge will not retry on its own;
fix the cause, then `/connect` in the
lobby (transcript `t10`).

## "My messages are gone" — you were in public mode

If closing the browser ended the session
and the return visit shows zero
networks, nobody broke anything: the
session was public mode's throwaway
guest, and the channel saw it quit the
moment the page closed (transcript
`t04-speaker-public` shows the `QUIT`
from the other side). The fix is
chapter 5: private mode, a real user,
and the same test again — the member
list check in transcript
`t07-speaker-persist` shows the
difference from the outside.

## The theme is installed but not offered

Packages load at server start, only.
`thelounge install` finishing is
necessary but not sufficient: restart,
look for `Package <name> ... loaded` in
the start log, then check the theme
list at sign-in (transcript `t11` has
both halves). If the log line is
missing, the install went to a different
home folder than the server is using —
the `THELOUNGE_HOME` variable must be
the same for the install command and
the start command. That same mismatch,
in the other direction, is also the
answer to "the server can't see my
users": two homes, two worlds.

## A second client cannot take a nickname: 433

IRC answers a nickname already in use
with numeric **433**, and a well-behaved
client must pick another — the lab's
speaker script met this when a stray
copy of itself was still connected, and
now treats a 433 during registration as
a stop sign worth printing. In the real
client the same collision appears when
another connection already holds your
nick on that network; the answer is to
find the holder (often a zombie of your
own) rather than to keep retrying.

## The socket script connected, but "no channel joined"

A trap from the lab's own tooling, kept
because it teaches how the client
works: when a network is created with
channels to join, those channels arrive
**inside the `network` event**, not as
separate `join` events — `join` is for
channels joined later. A driver that
waits for `join` waits forever while
sitting in a perfectly good channel
(transcript `t04`, first run versus
second). Read the `network` event's
channel list first; it is the state of
the world, and the events after it are
only changes.
