# Themes and Packages

By the end of this chapter a new theme
has been installed from the command
line, the server has loaded it at start,
and signed-in clients can see it in
their list of themes. The check is that
list itself: where chapter 4's
`configuration` event offered two themes,
it now offers three (transcripts `t11`
and `t12`).

## What a package is here

The Lounge's client can be restyled, and
a small family of extension packages —
themes above all — is distributed
through npm like the program itself.
Packages are a property of the
*server*, not of one user: install one
and every user of that server gains it.
They live in the home folder, at
`packages/node_modules/`, and they are
loaded when the server starts — which
is why every command in this chapter is
followed, sooner or later, by a restart.

## Install one

The command is a single line, and needs
the same `THELOUNGE_HOME` discipline as
every other command in this guide:

```bash
thelounge install thelounge-theme-solarized
```

```
[INFO] Retrieving information about the package...
[INFO] Installing thelounge-theme-solarized v1.2.0...
[INFO] thelounge-theme-solarized v1.2.0 has been successfully installed.
```

(transcript `t11`). Under the folder,
the proof is plain: `packages/node_modules/`
now holds `thelounge-theme-solarized`.
Its companions keep the shelf tidy:

```bash
thelounge outdated   # what has a newer version waiting
thelounge upgrade    # take the newer versions
thelounge uninstall thelounge-theme-solarized
```

The lab ran the first of those —
`No outdated packages`, a minute after
installing the latest — and describes
the other two from the command set
rather than exercising them: uninstalling
the lab's only specimen would have
unproven the chapter above it.

## The restart loads it

Starting the server again, its log
announces the shelf before it announces
the users:

```
[INFO] Package thelounge-theme-solarized v1.2.0 loaded
[INFO] User reader loaded
```

and the next sign-in's `configuration`
event carries the new list:

```
themes=[default, morning, thelounge-theme-solarized]
```

Two themes were there all along.
**Default** is the standard look, and
**morning** is a second built-in theme
that ships inside the program — worth
knowing before you go shopping, because
a change of clothes may already be
installed. Choosing a theme is a
per-user setting in the page; installing
one is the operator's job, done above.
What a theme can change is the client's
appearance — colours, spacing, mood.
What it cannot do is change behaviour:
themes here are stylesheets with a
manifest, not plugins with powers, and
that smallness is a safety property
worth appreciating in a program that
holds your accounts. The wider package
family exists, and its other members
are described in the project's
documentation; the lab exercised the
theme because it is the package nearly
every operator actually installs.
