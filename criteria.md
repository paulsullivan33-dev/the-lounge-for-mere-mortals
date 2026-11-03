# Writing criteria for this guide

Every "for Mere Mortals" guide is written to the same nine-point
standard, so a reader who trusts one can trust the rest. Here
it is, with the verification notes for this particular guide
below.

1. **Fix it first.** Reader outcomes lead, not action items:
   each chapter opens by naming the outcome it delivers, shows
   a check the reader can run to confirm they got it, and a
   reasonable reader finishes able to state what was done,
   what it means, and what to try next.
2. **Plain language.** Short sentences, everyday vocabulary,
   technical terms defined on first use. No slang, and no
   idioms that only make sense in one country — the reader may
   be translating as they go.
3. **No dead ends.** A guide never tells the reader to do
   something it cannot show them how to verify. Every claim a
   reader relies on — an install, a command, an output — is
   something this guide demonstrates or clearly labels
   documented-only below.
4. **Live-verified where it matters.** Procedures are run for
   real in the guide's lab wherever the build machine allows
   it, and the transcripts kept in the repository are the
   evidence. What could not be run is listed honestly below,
   never presented as if it had been.
5. **General audiences.** Nothing in this guide — examples,
   fixtures, names, addresses — is modelled on any particular
   reader or author's real life, network, or organisations.
   The lab's network, channel and participants are invented,
   on loopback.
6. **Standalone.** A reader needs this guide, its lab, and
   nothing else. Where another guide would genuinely help, it
   is pointed to once, by name, and the chapter still
   completes without it.
7. **Honest about limits.** Chapter 13 names what the tool
   cannot do: one process holding every connection, a history
   capped per channel and witnessed rather than recovered,
   uploads that never expire, public mode's missing accounts,
   a diary's worth of stored speech, transport security that
   ends at loopback, and a lab whose scale is two people in
   one channel.
8. **The ethics rule is in the text, early.** The Lounge is a
   person in the middle: it carries and stores your
   conversations and other people's words. Chapter 1 and the
   README state the line plainly and before any procedure
   depends on it — run it on a machine you trust, for accounts
   that are yours, on networks where you are welcome, and be
   honest that a server keeping everyone's words is an
   archive others did not necessarily agree to.
9. **Builds clean.** The site builds with MkDocs in strict
   mode with no warnings, and a fresh reader following the
   chapters in order reaches the stated outcome of each.

## Verification notes for this guide

The build machine is a 2-CPU, 7.7 GB Ubuntu 24.04 sandbox,
shared with other work while the lab ran. The Lounge
**4.5.2** (npm `latest` at lab time; a 4.6.0 pre-release
existed and was not used) was installed unmodified from npm
on Node.js 24.22.1, and run only on loopback, on the lab's
assigned port **18093**, with `THELOUNGE_HOME` always set to
a lab folder. Because the sandbox has no second machine, the
lab ran its own IRC server: **miniircd 2.3**, a single-file
Python IRC server, on loopback port 16667, with an invented
network (LabNet), one channel (`#lounge-lab`) and two
invented participants. The Lounge was driven through its own
socket protocol by `the-lounge-lab/lounge-client.js` (needs
`socket.io-client` 4, installed in the lab only), which is
the same event stream the real web page renders; the second
participant is `the-lounge-lab/speaker.py`, a raw-socket IRC
client. All transcripts live in
`the-lounge-lab/transcripts/`.

Run for real, with transcripts as evidence:

- Environment and versions: Node 24.22.1, npm 10.9.4,
  miniircd 2.3 (t00). Install of thelounge@4.5.2 (259
  packages) and `--version` / `--help` (t01).
- The fixture IRC server answering registration and serving
  its message of the day to a raw probe (t02).
- Public mode: server start, the page's HTTP 200 and
  security headers, the injected client configuration, and
  the home folder created on first start (t03).
- A public-mode chat session end to end: configuration
  event, network creation, the lobby's connection news and
  MOTD, joining, sending, a `/me` action, a received
  message flagged HIGHLIGHT, marking read — and, from the
  speaker's side, the joins, the raw messages, the
  Lounge user's `QUIT` the moment the browser socket
  closed, and a member list with the guest gone (t04,
  t04-speaker-public).
- User management: `thelounge add` failing on a fresh home
  ("users does not exist"), the piped-prompt attempt
  creating nobody, then `add reader --password …
  --save-logs` succeeding; `list` showing the user; the
  user JSON's bcrypt hash and `log: true` read directly
  (t05).
- A wrong-password sign-in refused with `auth:failed`, and
  the server log's matching warning line (t06).
- Staying connected: sign-in with password, session token
  issued; token sign-in thereafter. Live messages including
  a highlight; browser disconnected; three more messages
  sent while away; the fixture server's member list still
  showing the user present (t07, t07-speaker-persist);
  reconnect showing unread=2, highlight=1 and the missed
  messages in place, with a `more` request returning the
  full history to the join (t08).
- Storage: both stores on disk — the SQLite database
  (messages table queried directly: 8 rows, highlight flags
  stored) and the text channel log, including the lines
  written while no browser was connected (t09).
- A network pointed at a dead port failing in its lobby
  with `ECONNREFUSED` and "will not reconnect" (t10).
- A theme package installed from the CLI
  (thelounge-theme-solarized v1.2.0), `thelounge outdated`
  reporting none outdated, and the restarted server's log
  line announcing the package as loaded; the sign-in
  configuration then listing three themes (t11, t12).
- A full server restart restoring both networks and the
  channel history in `init` (t12).
- File uploads: `fileUpload.enable` set in config, the
  `configuration` event reporting uploads enabled, the
  one-minute `upload:auth` token flow, a multipart post
  returning a URL, and the file fetched back over HTTP
  byte-for-byte identical, with its on-disk resting place
  listed (t12).
- The generated `config.js` read at the line level for
  every setting the guide cites, and `thelounge storage
  --help` (t13).

Documented only — described from the project's
documentation, its defaults, or its interface, not run, and
the text does not claim otherwise:

- Connecting to a real public IRC network, including the
  default Libera.Chat settings the connect window offers —
  the lab's only network was its fixture, by design.
- The .deb and Docker installation routes, and package
  `upgrade` / `uninstall` (install and `outdated` were run).
- Serving the page over HTTPS, behind a reverse proxy, or
  on the public internet; LDAP sign-in; WEBIRC; the ident
  daemon.
- Push notifications: the server generated its VAPID keys
  at first start (visible in the start logs), but no
  subscription or notification was exercised.
- The sessions management page, the in-client message
  search, and per-user settings pages — the token's *use*
  was run; its management UI was not.
- `thelounge storage migrate` and `clean` (help read; the
  lab had nothing to migrate or clean).
- Link prefetching (off by default and left off), link and
  media previews, and multiple simultaneous users (one
  user was run; a second is recipe text, not a transcript).
- The neighbour tools of chapter 12 (WeeChat/irssi with
  tmux, ZNC, Kiwi IRC, gamja with soju, Convos, IRCCloud,
  Matrix) — characterised, not run or benchmarked.

Fixtures are this guide's own and deliberately generic: a
network called LabNet, a channel called #lounge-lab, two
participants with invented names, stock sentences about the
lab itself, and one two-line fixture file for the upload.
No real network was contacted, no real channel was joined,
and the only password in the guide is the lab fixture's own,
shown so the transcripts read as evidence.
