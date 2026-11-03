# Your First Session

By the end of this chapter you have
chatted on IRC through The Lounge: the
server started in public mode, a network
connected, a channel joined, messages
exchanged both ways, and one message
aimed at you came back flagged as a
highlight. The check is the channel
itself: your words appear in it, from a
second participant's view as well as
your own — the lab keeps that second
view in transcript `t04-speaker-public`.

## Start in public mode

Public mode needs no accounts, which is
why it comes first. Three command-line
overrides set the address, the port and
the mode for this run only — the config
file itself is not rewritten by them:

```bash
THELOUNGE_HOME=$PWD/home-public \
  ./npm/node_modules/.bin/thelounge \
  -c host=127.0.0.1 -c port=18093 -c public=true start
```

```
[INFO] Available at http://127.0.0.1:18093/ in public mode
```

Open `http://127.0.0.1:18093/` and the
page loads — the check from chapter 1,
`curl -sI`, shows a `200` and a strict
set of security headers: the page is
served with a content policy that allows
it almost nothing beyond itself
(transcript `t03`). The page announces
the mode in what it sends: the lab's
socket script received a `configuration`
event reading `public=true`, the two
built-in themes, and file uploads
disabled.

## Connect to a network

The page's connect window asks for what
any IRC client asks for: a network name,
a server and port, your nickname, and
channels to join. The lab's network is
its own fixture — a small IRC server
(miniircd 2.3) on the same machine at
`127.0.0.1` port `16667`, there so the
lab can watch both ends; on your machine
the same window would name a real
network, and the defaults the window
offers are the subject of chapter 10.

The window's answers become one event;
here is the lab's, exactly as sent
(transcript `t04`):

```
--- creating network LabNet (127.0.0.1:16667), joining #lounge-lab
event network: "LabNet" channels:
  chan#1 LabNet type=lobby ...
  chan#2 #lounge-lab type=channel ...
event msg chan#1: Network created, connecting to 127.0.0.1:16667...
event msg chan#1: Connected to the network.
event msg chan#1: You're now known as lounger
```

Read that the way the page shows it: the
**lobby** collects the connection news —
created, connected, your nickname
confirmed, and then the network's
message of the day — while the channel
opens beside it. The `network:status`
event reports the connection up. From
the IRC side, the fixture server saw a
plain join, indistinguishable from any
other client's (`t04-speaker-public`).

## Talk, and be talked to

Typing in the channel sends an `input`
event; what comes back is a `msg` event
marked as your own:

```
>>> input chan#2: Hello from The Lounge window
event msg chan#2: <lounger> Hello from The Lounge window  [self]
>>> input chan#2: /me settles in
event msg chan#2: <lounger> settles in  [self]
```

The `/me` line is an ordinary IRC
command travelling in an ordinary
message — the speaker's log shows the
raw `ACTION` it becomes on the wire.
The lab's second participant, a small
script called the speaker, answers from
the other side:

```
event msg chan#2: <greeter> Afternoon, the fixture channel is open for the lab.
```

and then aims one at the lab's nickname:

```
event msg chan#2: <greeter> lounger: that one was aimed at you ... [HIGHLIGHT]
```

A **highlight** is a message that
mentions your nickname. The Lounge
flags it in the message, counts it
separately from ordinary unread
messages, and — in the page — makes it
the loudest thing in the window. It is
the difference between "the channel was
busy" and "someone wanted *you*".
Chapter 6 puts highlights to their real
use: waiting for you while you are away.

## Close the page, and watch

Viewing a channel marks it read — the
page sends `open`, the unread count
clears. Now close the page entirely.
From the channel's point of view, this
happens at once (transcript
`t04-speaker-public`):

```
:lounger!lounger@127.0.0.1 QUIT :The Lounge - https://thelounge.chat
```

and a member list asked for afterwards
holds only the speaker. That is public
mode's whole truth: the session was a
guest pass tied to the browser, and the
IRC connection — which was never really
*yours*, only your window's — ends with
it. Nothing is kept: reconnect and the
`init` event reports zero networks, a
blank slate.

Keep the shape of the normal case in
mind, though, because everything worked:
connect, join, talk, highlight. What
public mode lacks is only persistence,
and persistence is a property of
*accounts*. Chapter 5 makes one.
