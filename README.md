# The Lounge for Mere Mortals

IRC is one of the oldest ways people talk
on the internet: plain text channels on
public networks, no accounts to speak of,
no company in the middle. Its one rude
habit is that it only exists while you
are connected. Close your laptop and you
vanish from the channel; whatever was
said while you were gone is gone.

**The Lounge** is the fix people run for
themselves. It is a program on a machine
that stays on — a small home server, a
spare laptop — that holds your IRC
connections for you and gives you a web
page to read them from. The page works
from any browser. The connections, and
the conversation, keep going when the
browser closes: you come back to unread
counts, highlights that waited for you,
and the messages you missed, in place.

This guide explains how The Lounge fits
together, how to install it, and how to
run it both ways it can run: **public
mode**, where anyone who can open the
page can chat as a throwaway guest, and
**private mode**, where named users sign
in and their connections persist. Then
it proves the promises. The lab behind
this guide ran **The Lounge 4.5.2** on a
small Linux machine, against a small IRC
server of its own running on the same
machine, so every claim could be checked
from both ends of the wire at once: what
the web client showed, and what the IRC
server saw.

Against that fixture the lab started the
server in both modes, chatted in a
channel from the socket interface the
real page uses, watched a message aimed
at its nickname come back flagged as a
highlight, added a user from the command
line (twice — the first attempt failed,
and the failure is in the guide), signed
in with a wrong password and was
refused, closed the browser side and
watched the IRC connection stay up and
the missed messages pile up in storage,
reconnected and found them waiting with
their counts, restarted the whole server
and found the networks and history still
there, turned on file uploads and
fetched an uploaded file back byte for
byte, and installed a theme package from
the command line.

What the lab did not do, it did not
fake. It never connected The Lounge to a
public IRC network — the default
Libera.Chat settings are described, not
exercised — and it never put the server
behind HTTPS or a reverse proxy, never
used push notifications, LDAP sign-in,
or the Docker and .deb installs.
`criteria.md` keeps the full ledger of
what was run and what was only read.

One thing belongs up front, because The
Lounge is a tool that sits in the middle
of your conversations: everything you
say and everything said to you passes
through, and is stored on, the machine
running it. Run it on a machine you
trust, for accounts that are yours, on
networks where you are welcome.
Chapter 1 returns to this; no procedure
in this guide depends on forgetting it.

## What this guide covers

- [**What The Lounge is**](what-the-lounge-is.md) —
  the mental model: a program that holds
  your IRC connections and hands you a
  web page, and what that middle position
  means for privacy
- [**The moving parts**](the-moving-parts.md) —
  the server, its home folder, the user
  files, the two kinds of message
  storage, and the browser socket — and
  which part holds what
- [**Installing The Lounge**](installing-the-lounge.md) —
  the npm install on top of Node.js, the
  version check, and the configuration
  file the first run writes
- [**Your first session**](your-first-session.md) —
  public mode: the page, connecting to a
  network, joining a channel, highlights,
  and the guest session that vanishes
  when you close the page
- [**Private mode and users**](private-mode-and-users.md) —
  adding users from the command line,
  signing in, the wrong password that is
  refused, and the session token that
  signs you back in
- [**Staying connected**](staying-connected.md) —
  the core promise, proven: the browser
  leaves, the connection stays, and the
  missed messages are waiting with their
  unread and highlight counts
- [**Message storage and logs**](message-storage-and-logs.md) —
  the SQLite database and the text logs,
  what each is for, and the history
  limit that trims them
- [**File uploads**](file-uploads.md) —
  turning uploads on, the one-minute
  upload token, and the file that comes
  back byte for byte — plus why uploaded
  files never expire
- [**Themes and packages**](themes-and-packages.md) —
  installing a theme from the command
  line, checking for outdated packages,
  and the restart that loads them
- [**Configuration**](configuration.md) —
  a tour of the generated config file:
  the mode, the port, the network the
  connect window offers first, and the
  switches this guide uses
- [**Recipes**](recipes.md) — a one-person
  always-on setup, a second user for the
  household, a public window with its
  warning attached, and a one-pass check
  of the whole installation
- [**The neighbours**](the-neighbours.md) —
  a terminal client with tmux, ZNC the
  classic bouncer, the other web clients,
  and hosted chat: what each does that
  The Lounge doesn't, and vice versa
- [**Limits**](limits.md) — one process
  holding everyone's connection, storage
  that is a diary, uploads that never
  expire, and the rest of the honest list
- [**Troubleshooting**](troubleshooting.md) —
  the user that cannot be added, the
  password prompt that ignores a pipe,
  the refused connection in the lobby,
  and the traps this guide's lab fell
  into
- [**Glossary**](glossary.md) — the
  terms, collected in one place

## What it doesn't cover

Running The Lounge for the public
internet behind HTTPS with a domain name
and a reverse proxy — the configuration
chapter points at the settings, but the
lab ran on loopback only, and putting a
sign-in page on the open internet
deserves more care than a paragraph.
Connecting to real public networks is
described from the defaults the program
ships, not exercised. Being an IRC
operator, running an IRC server of your
own beyond the lab's fixture, and chat
bots are all other guides' territory.

## How to use this guide

Read chapter 1 for the model, and
chapter 2 before installing anything —
knowing which part holds what turns
later confusion into a named problem.
Chapter 3 installs; chapter 4 chats in
the same sitting. Chapter 6 is the one
to read slowly: staying connected is the
reason the tool exists, and its proof —
watching from the IRC server's side
while the browser is away — is the check
you can repeat on your own setup. The
lab's transcripts live in
`the-lounge-lab/transcripts/`; the
script that drove the web client's
socket is `the-lounge-lab/lounge-client.js`
and the second person in the channel is
`the-lounge-lab/speaker.py`.

---

## Part of the series

This guide is one of the [For Mere Mortals](https://paulsullivan33-dev.github.io/mere-mortals/) guides: plain-language guides to the tools programmers and makers use.

Related guides:

- [Matrix (Synapse) for Mere Mortals](https://paulsullivan33-dev.github.io/matrix-synapse-for-mere-mortals/)
- [Node.js for Mere Mortals](https://paulsullivan33-dev.github.io/nodejs-for-mere-mortals/)
- [nginx for Mere Mortals](https://paulsullivan33-dev.github.io/nginx-for-mere-mortals/)
- [Tailscale for Mere Mortals](https://paulsullivan33-dev.github.io/tailscale-for-mere-mortals/)

## License

The writing in this guide is licensed under [CC BY 4.0](https://github.com/paulsullivan33-dev/the-lounge-for-mere-mortals/blob/main/LICENSE). Code examples and lab scripts are licensed under the [MIT License](https://github.com/paulsullivan33-dev/the-lounge-for-mere-mortals/blob/main/LICENSE-CODE).
