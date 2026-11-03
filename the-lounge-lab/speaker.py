#!/usr/bin/env python3
"""speaker.py - a raw-socket IRC client that plays the second person.

Connects to the lab IRC server, joins a channel, prints everything it
receives with timestamps, and reads commands from standard input:

    say <text>      send a channel message
    quit            part and disconnect

Usage: speaker.py <nick> <channel> [port]
Driven by a shell pipeline with sleeps, e.g.:

    { sleep 2; echo "say Hello there"; sleep 2; echo quit; } \
        | python3 speaker.py greeter '#lounge-lab'
"""

import socket
import sys
import threading
import time

HOST = "127.0.0.1"


def stamp():
    return time.strftime("%H:%M:%S")


def main():
    nick = sys.argv[1]
    channel = sys.argv[2]
    port = int(sys.argv[3]) if len(sys.argv) > 3 else 16667

    sock = socket.create_connection((HOST, port))
    f = sock.makefile("r", encoding="utf-8", errors="replace")

    def send(line):
        print(f"[{stamp()}] >>> {line}", flush=True)
        sock.sendall((line + "\r\n").encode())

    def reader():
        for line in f:
            if not line:
                break  # socket closed; do not spin on EOF
            line = line.rstrip("\r\n")
            print(f"[{stamp()}] <<< {line}", flush=True)
            if line.startswith("PING"):
                token = line.split(":", 1)[-1]
                sock.sendall(f"PONG :{token}\r\n".encode())
            if " 433 " in line:  # nick already in use: a stray speaker?
                print(f"[{stamp()}] !!! nick in use, aborting", flush=True)
                import os

                os._exit(1)
            if " 001 " in line:  # welcome: registration complete
                send(f"JOIN {channel}")

    t = threading.Thread(target=reader, daemon=True)
    t.start()

    send(f"NICK {nick}")
    send(f"USER {nick} 0 * :{nick} (lab fixture)")

    for cmd in sys.stdin:
        cmd = cmd.rstrip("\n")
        if cmd.startswith("say "):
            send(f"PRIVMSG {channel} :{cmd[4:]}")
        elif cmd.startswith("raw "):
            send(cmd[4:])
        elif cmd == "quit":
            send(f"PART {channel} :bye")
            send("QUIT :speaker done")
            break
        elif cmd == "ping":
            send("PING :speaker-check")
    time.sleep(1)
    sock.close()


if __name__ == "__main__":
    main()
