# Staying Connected

By the end of this chapter the core
promise has been tested end to end: in
private mode you can close every browser
and your IRC connection stays up, the
conversation continues without you, and
when you return, what you missed is
sitting in the channel with its unread
and highlight counts — and it survives a
restart of The Lounge itself. The checks
are deliberately external: the lab
watched from the IRC server's side while
the browser was gone, twice.

## The setup

The signed-in user from chapter 5
connects to the lab network as in
chapter 4, nickname `reader`, and says
one line. The speaker says two back —
one ordinary, one aimed:

```
>>> input chan#2: First message from the signed-in reader
event msg chan#2: <reader> First message from the signed-in reader  [self]
event msg chan#2: <greeter> reader: a highlight while you are watching  [HIGHLIGHT]
```

(transcript `t07-persist-first-visit`).
The reader opens the channel — read, up
to date — and then the browser side
disconnects entirely. Not closes a tab:
the socket is gone, the way a shut
laptop or a dead battery leaves it.

## While you were away

Here is the same minutes-long window
from the IRC server's side, where the
speaker stayed watching (transcript
`t07-speaker-persist`). The reader does
not leave. Messages keep arriving for
them:

```
:greeter ... PRIVMSG #lounge-lab :While you were away: missed message one
:greeter ... PRIVMSG #lounge-lab :reader: a highlight that waited for you
:greeter ... PRIVMSG #lounge-lab :While you were away: missed message three
```

and long after the browser disconnected,
the speaker asks the server for the
channel's member list:

```
:localhost 353 greeter = #lounge-lab :greeter reader
```

`reader` is present. In private mode the
connection was never the browser's; the
browser was only ever a window, and
windows can close without the room
emptying. Compare chapter 4's public
mode, where the same disconnection
produced an immediate `QUIT` and an
empty chair. Same program, same
protocol — the difference is entirely
the account.

## Coming back

Sign in again — by token, as chapter 5
left it — and the `init` event carries
the state of the channel (transcript
`t08`):

```
event init: active=2 networks=1
  chan#2 #lounge-lab type=channel unread=2 highlight=1 totalMessages=8
    msg#14 <greeter> reader: a highlight that waited for you
    msg#15 <greeter> While you were away: missed message three
```

Two counters do the talking. **Unread**
says how much of the channel is new to
you; **highlight** says how much of it
wanted you personally. The newest
messages ride along in the `init`
itself, and the full history is one
request behind it — the lab asked with
the `more` event and got every message
back to the join, the missed ones in
their places:

```
    older msg#13 <greeter> While you were away: missed message one
    older msg#14 <greeter> reader: a highlight that waited for you
    older msg#15 <greeter> While you were away: missed message three
```

Opening the channel marks it read, the
counters clear, and the session
continues as if the gap had been a
blink. Multiply the gap by a night, a
holiday, a dead laptop: nothing in the
mechanism changes, only the counts
grow. *That* is the entire reason the
program exists, and it is now something
you have seen proven rather than
asserted.

## The harder test: restart the server

Browsers are not the only things that
close. The Lounge's own process gets
restarted — for an upgrade, a config
change, a rebooted machine. The lab
stopped the server outright and started
it again, then signed in (transcript
`t12`):

```
event init: active=-1 networks=2
  network "LabNet" nick=reader
  chan#2 #lounge-lab type=channel unread=0 highlight=0 totalMessages=10
```

The networks are back — The Lounge
reconnects them on its own at start —
and the channel's history is back with
them, reloaded from the message storage
on disk. Where exactly those messages
were kept, in what two forms, and what
the limits on keeping them are, is
chapter 7.
