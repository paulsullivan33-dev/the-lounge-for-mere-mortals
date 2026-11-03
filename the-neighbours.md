# The Neighbours

Every tool in this chapter solves some
part of the same problem — IRC ends when
you disconnect — and each is
characterised honestly here, from its
own documentation and reputation. Only
The Lounge was run in this guide's lab;
nothing in this chapter is a benchmark.

## A terminal client and a terminal multiplexer

The oldest answer is to not use a
bouncer at all: run a text-mode IRC
client — **WeeChat** or **irssi** — in a
**tmux** session on an always-on
machine, and reattach to the session
when you want your channels. It is
genuinely good: featherweight, scriptable,
entirely keyboard-driven, and your
scrollback is right where you left it.
What it does not give you is the web:
no browser on a borrowed machine, no
phone-friendly window, no image previews
or easy file sharing, and the reattach
dance (SSH in, find the session) is a
toll every single time. People who live
in terminals stop noticing the toll.
Everyone else is The Lounge's audience.

## ZNC, the classic bouncer

**ZNC** is the tool The Lounge is most
directly descended from in spirit: a
dedicated bouncer that holds your
connections and replays what you missed,
which you then point an ordinary IRC
client at — any client, on any device.
That split is its strength and its cost.
Strength: your favourite client keeps
working, and several devices can attach
to the same buffered connection at once,
each replaying independently. Cost: you
run and configure a bouncer *and* a
client on every device, and the
batteries (web interface, easy accounts,
history you can search) are add-ons of
varying polish where The Lounge has
them built in. If you already love an
IRC client, ZNC keeps it alive. If what
you want is a window that simply works
in a browser, that is the gap The Lounge
was written into.

## The other web clients

**Kiwi IRC** is a web client often
embedded in project websites — click and
you are in the support channel — which
makes it a door for visitors more than a
home for regulars; staying connected
long-term is not its centre of gravity.
**Gamja** is a lean, modern web client
usually paired with the **soju** bouncer:
the same two-part shape as ZNC, rebuilt
with newer protocol features, and an
operator's project rather than a
one-command install. **Convos** is the
closest neighbour of all — a self-hosted,
always-on web chat with accounts, built
on the same idea — and the choice
between it and The Lounge is mostly
taste, ecosystem, and which project's
decisions you prefer living with.

## The hosted answer: IRCCloud

**IRCCloud** does the whole thing as a
service: their servers stay connected,
their web and mobile clients are
polished, and there is nothing to
install or maintain. The price is the
mirror of chapter 1's line: your
conversations pass through and rest on
someone else's machine, under someone
else's account decisions, at a
subscription's pleasure. For many people
that trade is right. The Lounge exists
for the people who would rather hold the
middle themselves.

## And the different road entirely

Much group chat has left IRC's shape
altogether. **Matrix** — the subject of
its own guide in this series — gives you
accounts, history and federation as
properties of the network itself rather
than of a bouncer you bolt on, with
bridges that reach into IRC networks
from the other side. If you are starting
a community today, that may be the
honest recommendation. If your community
already lives on IRC — and decades of
them do — the tools above are how you
live there comfortably, and The Lounge
is the one that asks the least of every
device you own.
