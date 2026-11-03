# Private Mode and Users

By the end of this chapter the server
runs in private mode with one named
user who can sign in — and you have seen
a wrong password refused, with the
refusal written in the server's own log.
The check is twofold: `thelounge list`
shows the user, and a sign-in with the
right password succeeds while one with a
wrong password does not (transcripts
`t05` and `t06`).

## A fresh home for private mode

The lab gives private mode its own home
folder, `home-private`, so the two modes
never mix. Private is the default mode —
the generated config says `public:
false` — so the start line drops the
public override:

```bash
THELOUNGE_HOME=$PWD/home-private \
  ./npm/node_modules/.bin/thelounge \
  -c host=127.0.0.1 -c port=18093 start
```

```
[INFO] Available at http://127.0.0.1:18093/ in private mode
```

## Add the user — after one honest failure

Users are created with `thelounge add`.
On a brand-new home the lab's first
attempt failed outright:

```
[ERROR] .../home-private/users does not exist.
```

The `users` folder is normally created
by the server's first run; a home that
has never been served has none, and
`add` stops rather than guess. The fix
is as small as the cause:

```bash
mkdir -p home-private/users
```

The second attempt taught the next
lesson. `add` prompts for a password,
and its prompt wants a real terminal:
fed from a pipe, the answers landed in
the wrong prompts and no user was
created at all. The command has a
non-interactive form for exactly this —
and for scripts — which is the one to
remember:

```bash
thelounge add reader --password 'reader-lab-password' --save-logs
```

```
[INFO] User reader created.
[INFO] User file located at .../home-private/users/reader.json.
```

(The password here is the lab's fixture
password, shown because the transcripts
are evidence; choose your own, and it
never needs to be written anywhere else.
`--save-logs` sets the user's `log:
true` — chapter 7 is about what that
switch buys.) The user file itself was
read in chapter 2: a bcrypt hash, not a
password, plus that switch. And the
roster confirms the account exists:

```bash
thelounge list
```

```
[INFO] Users:
[INFO] 1. reader
```

The same family of commands manages the
account from here: `thelounge reset
reader` for a forgotten password,
`remove` to delete, `edit` to open the
JSON file itself. There is no web
sign-up, by design: whoever can add
users already has the machine.

## Sign in, wrong and right

Restarted in private mode, the server
loads the user (`User reader loaded` in
its log) and the page now opens with a
sign-in form. On the socket, this is an
exchange the lab captured in full. The
server speaks first:

```
event auth:start (server asks for sign-in)
```

A wrong password gets one plain answer
(transcript `t06`):

```
sent auth:perform with a wrong password
event auth:failed  <-- sign-in refused, as expected
```

and the server's log keeps its own
record of the attempt:

```
[WARN] Authentication failed for user reader from 127.0.0.1
```

No hint about which half was wrong, no
partial success — that is what a refused
sign-in should look like from both
sides.

The right password turns the refusal
into `auth:success`, and then into the
event the whole client is built around,
`init`: your networks, your channels,
your unread counts — in a fresh account,
empty ones. One more thing arrives with
it, quietly, and matters for the rest of
the guide: a **session token**, a long
random credential the server issues to
this browser (transcript `t07`).

## The token signs you back in

On the next visit the page does not ask
for the password again; it presents the
token:

```
sent auth:perform with saved session token
event auth:success
```

A token is a standing key to the
account, kept by the browser, revocable
from the account's sessions list in the
page's settings — treat a signed-in
browser the way you would a signed-in
anything. (The sessions list itself is
described from the client's interface;
the lab drove the token's use, not its
management page.) The lab's later
chapters sign in by token throughout,
which is why their transcripts say so.

The account now exists and holds a key.
What it does not yet hold is anything
worth keeping — no networks, no history.
Chapter 6 gives it both, and then takes
the browser away.
