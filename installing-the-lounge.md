# Installing The Lounge

By the end of this chapter The Lounge
4.5.2 is installed on the machine, its
version prints on request, and its first
start has written a configuration file
you can point at. The check is the
version command itself: if
`thelounge --version` does not answer,
nothing else in the guide can start.

## What it needs

The Lounge is a Node.js program, so the
machine needs Node.js first — version 18
or newer serves; the lab's machine had
Node.js 24.22.1 and npm 10.9.4 (transcript
`t00`). If your machine has neither, the
[Node.js guide in this series](https://paulsullivan33-dev.github.io/nodejs-for-mere-mortals/)
covers that install; this chapter picks
up where it leaves off.

Three official routes exist. The
project's own packages are a **.deb** for
Debian and Ubuntu and a **Docker**
image; and the program is published on
**npm**, the Node.js package registry,
which is the route the lab took — it
needs nothing but Node, and it keeps the
whole install inside one folder the lab
controls. The other two routes are
described from the project's
documentation, not run, and
`criteria.md` says so.

## The install

The lab installs into a folder of its
own rather than globally, so the exact
files can be inspected:

```bash
mkdir -p the-lounge-labwork/npm
npm install --prefix ./the-lounge-labwork/npm thelounge@4.5.2
```

npm answers with the count of what it
fetched — 259 packages, The Lounge and
everything it depends on — and the
program itself is the executable at
`the-lounge-labwork/npm/node_modules/.bin/thelounge`
(transcript `t01`). On your own machine
the more common form is a global
install, `npm install -g thelounge`,
which puts a `thelounge` command on your
path; the program is the same.

## The version check

```bash
./the-lounge-labwork/npm/node_modules/.bin/thelounge --version
```

```
v4.5.2
```

That one line is the check this chapter
promised. The full command list is one
command further:

```bash
thelounge --help
```

which names the verbs the rest of the
guide uses: `start`, `add`, `list`,
`remove`, `reset`, `edit`, `install`,
`uninstall`, `upgrade`, `outdated`, and
`storage` — and names the environment
variable that rules them all,
`THELOUNGE_HOME`. Every command in this
guide sets it, because every file the
program touches lives under it.

## The root warning

The lab's sandbox runs as the root user,
and every `thelounge` command answered
with a line worth meeting on a real
machine too:

```
[WARN] You are currently running The Lounge as root.
We highly discourage running as root!
```

The Lounge serves a sign-in page and
holds chat accounts; it should run as an
ordinary, dedicated user whose only
possessions are its home folder. The lab
noted the warning and ran on inside its
sandbox; on your machine, take the
warning.

## First start, and the file it writes

Starting the server — the next chapter
does it in earnest — creates the home
folder and writes a complete, commented
`config.js` into it:

```
[INFO] Configuration file created at .../home-public/config.js.
[INFO] The Lounge v4.5.2 (Node.js 24.22.1 on linux x64)
[INFO] Available at http://127.0.0.1:18093/ in public mode
```

Note the shape of that log: version,
config path, address, mode. When a start
goes wrong later, this is the baseline
it will differ from. The file it wrote
is the tour of chapter 10; the start
itself, and everything it makes
possible, is chapter 4.
