# Glossary

**Bouncer** — a program that holds your
IRC connections open on an always-on
machine and lets you attach to them, so
you stay present in channels while your
own devices come and go. The Lounge is
a bouncer with its web client built in.

**Channel** — an IRC room, named with a
leading `#`, where everyone present
sees every message. Joining and leaving
are visible acts; the member list is
public to the room.

**Fixture** — a stand-in built for the
lab: real software, invented data. This
guide's fixture IRC server (miniircd)
and its two participants exist only so
claims could be checked from both ends.

**Highlight** — a message that mentions
your nickname. The Lounge flags it,
counts it separately from unread
messages, and treats it as the strongest
"this wanted you" signal a channel
produces.

**IRC** — Internet Relay Chat: the 1988
protocol family of networks, servers,
channels and nicknames that this whole
guide chats on. Plain text at heart,
with no accounts and no history of its
own.

**Lobby** — in The Lounge, each
network's front-desk window: connection
news, errors, and the message of the
day collect there instead of in a
channel.

**Message of the day (MOTD)** — the
text an IRC server shows every
connection after it registers: the
network's house rules and news, in
theory; often just a welcome, in
practice.

**Network** — one IRC server, or a
linked family of them, run as one place
with shared channels and nicknames:
Libera Chat is a network. A user's
Lounge holds one connection per network
they join.

**Nickname (nick)** — your name on a
network: not an account, just a label
your connection holds, unique on that
network for as long as you hold it.
Numeric 433 is the server's answer when
someone else holds it first.

**Private mode** — The Lounge's normal
deployment: named users sign in, their
connections persist without a browser,
and their history is kept. Contrast
public mode.

**Public mode** — the demo mode: anyone
who can open the page can chat as a
throwaway guest whose connection ends
when the page closes. No accounts, no
persistence.

**Session token** — the long random
credential the server issues a browser
at sign-in, so returning visits need no
password. A standing key to the account,
revocable from the account's sessions
list.

**Socket** — the live two-way connection
between the web page and the server,
carrying named events (`init`, `msg`,
`input`, `open`…) in both directions.
Everything the page shows arrived as an
event on it.

**SQLite** — a database that lives in a
single file and needs no server program.
The Lounge keeps one per user as the
store its history reloads from.

**THELOUNGE_HOME** — the environment
variable naming the folder that holds
everything the server owns: config,
users, logs, packages, uploads.
Defaults to `~/.thelounge`.
