# Configuration

By the end of this chapter you can find,
in the generated `config.js`, every
setting this guide has leaned on — the
mode, the address, the network the
connect window offers first — and you
know which changes need a restart and
which can be overridden for one run.
The check is transcript `t13`: the
settings below, at their line numbers,
in the lab's own generated file.

## One file, read at start

The configuration is a single commented
JavaScript file in the home folder,
written in full on first start. It is
read once, when the server starts; no
edit takes effect until a restart, which
the last six chapters have quietly
depended on — the mode, the upload
switch and the theme shelf all changed
only across restarts. Treat the file's
comments as part of the documentation:
they are unusually honest, and several
entries in chapter 13's limits list are
quoted straight from them.

## The settings that decide the shape

From the lab's file (transcript `t13`):

```
17:    public: false,
26:    host: undefined,
32:    port: 9000,
54:    maxHistory: 10000,
100:   prefetch: false,
278:   messageStorage: ["sqlite", "text"],
```

- **`public`** is the mode switch of
  chapters 4 and 5. `false` is the
  default and the sane standing setting.
- **`host` and `port`** are where the
  page is served. Both were overridden
  per-run throughout the lab with
  `-c host=127.0.0.1 -c port=18093`;
  unset, the default port is 9000 and
  the server listens on all interfaces.
  On a real machine, binding to
  `127.0.0.1` and reaching the page
  through a tunnel or a proxy is the
  cautious shape.
- **`maxHistory`** caps each channel's
  kept messages (chapter 7).
- **`prefetch`** decides whether the
  server fetches previews for links
  people paste. It is off by default —
  fetching a link means the *server*
  visits it, from your address, on a
  stranger's say-so. The lab left it off
  and so does this guide's advice.
- **`messageStorage`** names the stores
  of chapter 7.

Overrides deserve their warning label:
`-c` changes one run and writes nothing.
A server that "was in public mode once"
because of an override is in private
mode again at the next plain start —
convenient for labs, confusing for
deployments. Anything you mean to keep,
write in the file.

## The network the window offers

Halfway down the file sits the
`defaults` block — the network the
connect window arrives pre-filled with:

```
name: "Libera.Chat",
host: "irc.libera.chat",
port: 6697,
tls: true,
join: "#thelounge",
```

This is the program's one opinion about
where you chat: Libera Chat, the largest
of the volunteer-run networks, over an
encrypted port. Beside it sits
**`lockNetwork`**, `false` by default:
set it true on a server you run for a
community and users can only connect to
your default network, not to anywhere
they type. The lab changed neither — its
fixture network was typed into the
window each time — and describes real
networks, this one included, from the
defaults rather than from a connection
it never made.

## The doors not opened here

The same file holds the `https` block
(serve the page encrypted, with your
certificate) and the `reverseProxy`
flag (trust a proxy in front to say who
is really visiting), plus LDAP sign-in
and WEBIRC settings further down.
Chapter 1's privacy line is why they
matter: a sign-in page and chat traffic
deserve encryption the moment they leave
loopback. They are also, honestly, this
guide's edge — the lab ran none of them,
and `criteria.md` lists them as
documented-only rather than dressing
reading up as running. The settings'
names and the file's own comments are
the right starting point when your
deployment reaches them.
