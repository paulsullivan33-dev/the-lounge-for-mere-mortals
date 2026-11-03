# File Uploads

By the end of this chapter a file has
travelled the whole upload path: the
feature switched on, a browser
authorised, the file posted, a URL
issued, and the file fetched back over
HTTP byte for byte identical — with its
resting place on disk identified. The
check is that byte-for-byte comparison
itself, in transcript `t12`.

## Off by default, on by config

IRC itself moves no files; the old
workarounds are famously awkward. The
Lounge's answer is to host the file
itself and let you paste its link into
the channel. It ships switched **off**:

```
fileUpload: {
    enable: false,
    maxFileSize: 10240,
    baseUrl: null,
```

The lab set `enable: true` in
`home-private/config.js` and restarted
the server — configuration changes are
read at start, never live. The change is
visible before any upload happens: the
`configuration` event at sign-in, which
in earlier chapters read
`fileUpload=disabled`, now reads
`fileUpload=enabled` (transcripts `t07`
and `t12` make a clean before-and-after
pair). `maxFileSize` is in kilobytes —
10,240 by default, about 10 MB — and
`baseUrl` exists for servers reached
under a different public address than
the one they bind; both are left alone
here.

## The one-minute token

An upload is two steps, and the first
exists so that the second can be a
plain HTTP post without your session.
The signed-in client asks over its
socket for an upload token
(`upload:auth`); the server answers with
a random one that lives for **one
minute**:

```
--- asking server for an upload token (upload:auth)
upload token received: 7655f67b-3c6...
```

The file is then posted, form-style, to
`/uploads/new/<token>` — the token is
spent by the post itself, so a captured
one is worthless a minute later either
way. The server's reply names the
file's public address:

```
POST /uploads -> 200 {"url":"uploads/095e35ae8255ffa1/fixture-upload.txt"}
```

## Fetch it back

The URL is relative; under the server's
own address it resolves to a file anyone
with the link can fetch — no sign-in,
by design, because the link is meant to
be pasted into a channel full of other
people:

```
GET http://127.0.0.1:18093/uploads/095e35ae8255ffa1/fixture-upload.txt -> 200
fetched body matches uploaded file: true
```

On disk the file rests in the home
folder at `uploads/09/095e35ae8255ffa1`:
a two-letter folder and a random
sixteen-hex-digit name. The original
filename survives only in the URL,
where it is a label for humans and
download dialogs; the storage name is
deliberately meaningless, so the uploads
folder can never be browsed into
guessing anyone else's file.

## The part to plan around

Uploaded files **do not expire and are
never removed by The Lounge** — the
configuration file says so in as many
words. Every file anyone drops into a
channel stays on your disk, fetchable
by anyone holding its link, until you
delete it yourself. On a personal
server that is a tidy convenience; on a
busy one it is a disk budget and a
small archive of everything ever
shared, growing by default. The recipe
in chapter 11 pairs turning uploads on
with a calendar note to clear the
folder out — the tool will not remind
you itself.
