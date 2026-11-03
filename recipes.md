# Recipes

Each recipe here is assembled only from
parts the earlier chapters ran and
proved. Where a step would need
something the lab did not run, the
recipe says so at that step rather than
blurring it.

## 1. A one-person always-on setup

The deployment this guide exists for,
in order:

1. Install (chapter 3), and pick a home
   folder you will always name the same
   way — the lab used a `THELOUNGE_HOME`
   per mode; a single standing folder is
   the deployment shape.
2. Create the users folder if the home
   is new, then add yourself with
   logging on (chapter 5):

   ```bash
   mkdir -p ~/.thelounge/users
   thelounge add yourname --save-logs
   ```

   (the password prompt is fine at a
   real terminal; use `--password` in a
   script).
3. In `config.js`, confirm `public:
   false`, set `host` to `127.0.0.1`
   unless the page must be reachable
   directly, and leave `prefetch` off
   (chapter 10).
4. Start the server, sign in, add your
   networks, and close the browser.
   Chapter 6's checks — member list from
   a second client, missed messages
   waiting — are your acceptance test.
5. Make it survive reboots: the program
   ships no service manager of its own.
   Running it under your system's
   service tooling (a systemd unit is
   the common Linux shape) is the
   standard answer and is described
   here, not run — the lab's sandbox
   has no systemd. What the lab *did*
   prove is the half that matters most:
   across a plain process restart the
   networks return and the history
   reloads (chapter 6), so any
   supervisor that simply restarts the
   same command line is enough.

## 2. A second user for the household

Private mode's accounts are per person,
and a partner or housemate should have
their own — their networks, their
highlights, their diary:

```bash
thelounge add secondname --save-logs
thelounge list
```

`list` showing both names is the whole
verification. What one user cannot do
is see another's anything: sign-ins,
histories and sessions are separate
files under `users/`, and nothing in
the client crosses between them.

## 3. A public window, with its warning

For a club night, a class, an open
channel's web door on a *private*
network, public mode is one override
(chapter 4):

```bash
thelounge -c public=true start
```

and the warning rides with it, proven
in transcript `t04`: every guest is a
throwaway, gone the moment their page
closes, and anyone who can reach the
address can chat under any name. On a
network you do not control end to end,
this recipe is not a recipe. Use
private mode and add accounts instead —
it costs one command per person.

## 4. Uploads on, with a broom

Chapter 8's switch, plus the chore the
tool will not do for you:

1. Set `fileUpload.enable: true` in
   `config.js`; lower `maxFileSize` if
   10 MB is more than your disk's mood.
2. Restart; confirm `fileUpload=enabled`
   in the sign-in `configuration` event.
3. Put a recurring note in *your*
   calendar — monthly is plenty — to
   look at the home folder's `uploads/`
   tree and delete what nobody needs.
   The files do not expire; the broom
   is manual by design.

## 5. Check the whole installation in one pass

Five minutes, every claim in the guide,
in order:

```bash
curl -sI http://127.0.0.1:18093/ | head -1
thelounge list
```

Then sign in and confirm from the
client side: your networks connected,
one channel's unread count sane, one
uploaded link (if enabled) fetching
back, and — the decisive test — close
the browser, have anyone say your name
in a channel, and come back to the
highlight waiting. If that round trip
works, the machine is doing the job it
was installed for; the chapters behind
each step are the ones to revisit when
one does not.
