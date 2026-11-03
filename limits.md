# Limits

What The Lounge cannot do, stated the
way chapter 1 stated its promise. Every
item here is either demonstrated in the
lab or quoted from the program's own
configuration comments.

**One process holds everything.** The
server, the page, every user's IRC
connection and history live in a single
Node.js process. When it stops, all of
it stops together; when the machine is
off, nobody is "in" any channel, and
messages from that window are simply not
in your history — the bouncer can only
keep what it was awake to hear. Its
memory grows with users and channels;
it is a small program, not a weightless
one.

**Staying connected is not the same as
being caught up on everything.** The
history that returns is capped per
channel by `maxHistory` (10,000 by
default), and storage policies can age
messages out. A month away from a busy
channel returns you the recent past, not
the month. And The Lounge's history is
its *own* recording — the program does
not ask IRC servers to replay their side
of the conversation; networks that keep
no history give it nothing to recover
beyond what it witnessed.

**The diary problem.** What it does
keep is complete and timestamped:
messages, joins, parts, highlights,
stored per user in a database and in
plain text logs. That is a record of
other people's speech as well as yours,
kept by default once logging is on. It
deserves the same care as any archive —
disk encryption, backups that respect
it, deletion when it is done being
useful — and chapter 7 opened the stores
it lives in.
There is no built-in redaction, no
per-channel "do not log" courtesy
switch surfaced in this guide's runs.

**Uploads never expire.** Chapter 8's
warning bears repeating as a limit: the
configuration file itself says uploaded
files "do not expire and are not removed
by The Lounge". Links are unguessable
but permanent and unauthenticated. Do
not upload what you would not paste a
permanent public link to.

**Public mode is a loaded foot-gun.**
It has no accounts *by design*, which
means anyone who can reach the page can
chat under any nickname the network
allows. It belongs on loopback and
private networks only. The lab ran it
on loopback, in a sandbox, against a
fixture server — the correct habitat.

**The page's security ends at its
transport.** Passwords are hashed
properly and refusals are clean, but the
lab served plain HTTP on loopback. On
any network you do not fully control,
an unencrypted sign-in page and
unencrypted chat are readable in
transit; the HTTPS and reverse-proxy
settings exist for this and were not
exercised here.

**It is an IRC client, with an IRC
client's ceiling.** No voice, no video,
no message editing, no threads, no
reactions — not missing features so much
as the protocol's own shape, which the
program does not pretend to escape.
Encryption to the network depends on
the network offering a TLS port; the
fixture in the lab was plaintext, as
much small-scale IRC still is.

**The operator is you.** Users are
created at a command line, packages at
a command line, storage cleaned at a
command line. There is no admin panel,
no sign-up flow, no password reset by
email. That is a deliberate shape for a
self-hosted tool, and it means the
machine's shell is the admin console —
whoever holds it holds every account's
history, though not, thanks to the
bcrypt hashing, their reusable
passwords.

**And the fixture's limit, honestly:**
this guide's proofs were won against a
two-person channel on a local server.
Nothing here measures The Lounge under
fifty networks, a hostile network, or a
year of logs. The mechanisms are the
ones production use relies on; the scale
is a claim this guide does not make.
