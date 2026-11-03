# What The Lounge Is

You have a conversation — a support
channel for a project, a hobby room, a
group of old friends — and it lives on
**IRC**, the Internet Relay Chat system
that has run text channels on public
networks since 1988. IRC's rule is
simple and harsh: you are in the channel
while your program is connected to the
network, and the moment it disconnects,
you are out. Nothing waits for you.
Laptops sleep, connections drop, and
every gap is a hole in the conversation.

**The Lounge is the program that stays
connected so you don't have to.** It
runs on a machine that is always on —
yours, in your house, under your
control. It holds your IRC connections
open around the clock, keeps the
messages that arrive, and serves you a
web page: open the page from any
browser, on any machine, and you are
looking at your channels exactly as you
left them. Close the page and nothing
ends; the connections were never the
browser's to begin with.

A program that holds a connection on
your behalf has an old name in the IRC
world: a **bouncer**. The Lounge is a
bouncer with the interface built in —
instead of pointing a separate IRC
program at it, the web page *is* the
interface, and the server half and the
page are one program you install once.

This matters for a practical reason.
Traditional IRC clients reward people
whose computers never sleep. Everyone
else learns to apologise for missed
context. With The Lounge, the always-on
part is a small program on a small
machine, and the part you touch is a
browser tab you can open from a phone,
a work laptop, or a borrowed computer,
sign in, and put away again.

## The two ways it runs

The Lounge has two modes, and choosing
between them is the first real decision
in this guide.

**Public mode** is a demo window. Anyone
who can open the page can pick a
nickname, join channels, and chat — no
accounts at all. The guest's connection
belongs to the browser session: close
the page and the guest leaves IRC,
visibly, in front of the whole channel.
Chapter 4 runs it this way so you can
see the shape of the thing in five
minutes, and chapter 4 also shows
exactly how the vanishing works, because
it is the opposite of the tool's main
promise. Public mode is for trying the
program, or for an open window on a
private network — never for the open
internet, where an unauthenticated chat
window is an invitation.

**Private mode** is the real deployment.
Users are named accounts, created from
the command line by whoever runs the
server. Each user's networks, channels,
settings and message history are theirs,
kept on the server, and restored at
sign-in — including, as chapter 6
proves, the messages that arrived while
every browser was closed. This guide's
lab does its serious work in private
mode, and so should you.

## The line it sits on

A bouncer is a person in the middle,
and the middle sees everything. Every
message you send and receive passes
through the machine running The Lounge,
and in private mode much of it is
written to disk there, on purpose, so it
can be shown back to you. That is the
feature — and it is also the whole
privacy story, stated plainly:

- Run The Lounge on a machine you
  control and trust, with an account
  that is yours.
- Other people's words land in your
  logs too. Channel regulars generally
  accept that everyone keeps scrollback;
  a server quietly keeping *everything*
  is still worth being honest about, and
  several networks state their own rules
  about logging in their policies.
- The sign-in page protects accounts
  with passwords, and chapter 5 shows a
  wrong one being refused — but a
  password on a page served over plain
  HTTP on an untrusted network is not
  strong protection. The lab runs on
  loopback, where that question does not
  arise; chapter 10 names the HTTPS and
  reverse-proxy settings for when it
  does.

## A first taste

After installing (chapter 3) and
starting the server, you open one
address in a browser:

```
http://127.0.0.1:18093/
```

and check it is really The Lounge
answering, from the command line, before
any browser is involved:

```bash
curl -sI http://127.0.0.1:18093/
```

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
```

That 200, and the strict security
headers that travel with it, are
transcript `t03` in the lab. Everything
after that — connecting, chatting,
leaving, returning — is done by the page
talking to the server over a socket, and
this guide's lab drives that same socket
with a script, so every event the page
would show is captured as text you can
read. Chapter 2 takes the machine apart.
