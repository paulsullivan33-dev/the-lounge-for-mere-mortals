#!/usr/bin/env node
/*
 * lounge-client.js - drives The Lounge the way its web page does:
 * over the socket.io API. Prints every interesting event with a
 * timestamp so the output can serve as a lab transcript.
 *
 * Usage:
 *   node lounge-client.js public                 public-mode chat session
 *   node lounge-client.js badpass                sign in with a wrong password
 *   node lounge-client.js persist1               private: connect, join, read live, disconnect
 *   node lounge-client.js persist2               private: reconnect with token, show what waited
 *   node lounge-client.js deadnet                private: connect to a dead IRC port (failure)
 *   node lounge-client.js upload                 private: upload a file, fetch it back
 *
 * Env: LOUNGE_URL (default http://127.0.0.1:18093),
 *      LOUNGE_USER / LOUNGE_PASS for private mode.
 */
"use strict";

const { io } = require("socket.io-client");
const fs = require("fs");
const path = require("path");

const URL = process.env.LOUNGE_URL || "http://127.0.0.1:18093";
const STATE = path.join(__dirname, "state.json");
const scenario = process.argv[2] || "public";

const IRC = {
  name: "LabNet",
  host: "127.0.0.1",
  port: 16667,
  tls: false,
  nick: "lounger",
  username: "lounger",
  realname: "Lounger (lab fixture)",
  join: "#lounge-lab",
};

function stamp() {
  return new Date().toTimeString().slice(0, 8);
}
function log(...args) {
  console.log(`[${stamp()}]`, ...args);
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

let state = {};
try {
  state = JSON.parse(fs.readFileSync(STATE, "utf8"));
} catch {}
function saveState() {
  fs.writeFileSync(STATE, JSON.stringify(state, null, 2));
}

function describeChan(c) {
  const msgs = (c.messages || []).map(
    (m) => `    msg#${m.id} <${m.from ? m.from.nick : "?"}> ${m.text}`
  );
  return [
    `  chan#${c.id} ${c.name || "(lobby)"} type=${c.type} unread=${c.unread} highlight=${c.highlight} totalMessages=${c.totalMessages}`,
    ...msgs,
  ].join("\n");
}

async function main() {
  const socket = io(URL, { reconnection: false, transports: ["websocket", "polling"] });
  let chanId = null;
  let lobbyId = null;
  let resolveInit;
  const initPromise = new Promise((r) => (resolveInit = r));

  socket.on("connect", () => log("socket connected", socket.id));
  socket.on("disconnect", (why) => log("socket disconnected:", why));
  socket.on("connect_error", (e) => log("connect_error:", e.message));

  socket.on("auth:start", () => {
    log("event auth:start (server asks for sign-in)");
    if (scenario === "badpass") {
      socket.emit("auth:perform", { user: "reader", password: "definitely-wrong" });
      log("sent auth:perform with a wrong password");
    } else if (scenario === "public") {
      log("(public mode: no sign-in expected)");
    } else if (state.token && scenario !== "persist1") {
      socket.emit("auth:perform", {
        user: process.env.LOUNGE_USER || "reader",
        token: state.token,
        lastMessage: state.lastMessage || -1,
      });
      log("sent auth:perform with saved session token");
    } else {
      socket.emit("auth:perform", {
        user: process.env.LOUNGE_USER || "reader",
        password: process.env.LOUNGE_PASS || "",
      });
      log("sent auth:perform with user + password");
    }
  });
  socket.on("auth:success", () => log("event auth:success"));
  socket.on("auth:failed", () => {
    log("event auth:failed  <-- sign-in refused, as expected");
    setTimeout(() => process.exit(0), 500);
  });
  socket.on("configuration", (cfg) => {
    log(
      "event configuration: public=" + cfg.public,
      "themes=[" + (cfg.themes || []).map((t) => t.name).join(", ") + "]",
      "fileUpload=" + (cfg.fileUpload ? "enabled" : "disabled"),
      "defaultNetwork=" + (cfg.defaults ? cfg.defaults.name : "?")
    );
  });
  socket.on("init", (data) => {
    log("event init: active=" + data.active + " networks=" + data.networks.length);
    if (data.token) {
      state.token = data.token;
      saveState();
      log("  session token issued by server (saved for reconnect)");
    }
    for (const n of data.networks) {
      log(` network "${n.name}" nick=${n.nick} server=${n.serverOptions ? "" : ""}${n.host || ""}`);
      for (const c of n.channels) log(describeChan(c));
    }
    resolveInit(data);
  });
  socket.on("network", (data) => {
    const n = data.network;
    log(`event network: "${n.name}" channels:`);
    for (const c of n.channels) log(describeChan(c));
    const lobby = n.channels.find((c) => c.type === "lobby");
    if (lobby) lobbyId = lobby.id;
    const ch = n.channels.find((c) => c.type === "channel");
    if (ch && !chanId) chanId = ch.id;
  });
  socket.on("network:status", (d) => log("event network:status", JSON.stringify(d)));
  socket.on("join", (data) => {
    log(`event join: chan#${data.chan.id} ${data.chan.name} type=${data.chan.type}`);
    chanId = data.chan.id;
  });
  socket.on("msg", (data) => {
    const m = data.msg;
    if (m.id && (!state.lastMessage || m.id > state.lastMessage)) {
      state.lastMessage = m.id;
      saveState();
    }
    log(
      `event msg chan#${data.chan}: <${m.from ? m.from.nick : "(" + m.type + ")"}> ${m.text}` +
        (m.highlight ? "  [HIGHLIGHT]" : "") +
        (m.self ? "  [self]" : "")
    );
  });
  socket.on("msg:special", (d) => log("event msg:special chan#" + d.chan, JSON.stringify(d.data).slice(0, 160)));
  socket.on("topic", (d) => log("event topic chan#" + d.chan, JSON.stringify(d.topic)));
  socket.on("users", (d) => log("event users chan#" + d.chan));
  socket.on("nick", (d) => log("event nick:", d.nick));
  socket.on("open", (id) => log("event open: chan#" + id));
  socket.on("more", (d) => {
    log(`event more: chan#${d.chan.id} totalMessages=${d.totalMessages} messages=${d.messages.length}`);
    for (const m of d.messages) log(`    older msg#${m.id} <${m.from ? m.from.nick : "?"}> ${m.text}`);
  });

  const input = (target, text) => {
    log(`>>> input chan#${target}: ${text}`);
    socket.emit("input", { target, text });
  };

  if (scenario === "badpass") {
    await sleep(4000);
    log("no auth:success seen (expected). done");
    process.exit(0);
  }

  const init = await initPromise;

  if (scenario === "public") {
    log("--- creating network LabNet (127.0.0.1:16667), joining #lounge-lab");
    socket.emit("network:new", IRC);
    for (let i = 0; i < 20 && !chanId; i++) await sleep(500);
    if (chanId) {
      await sleep(2000);
      input(chanId, "Hello from The Lounge window");
      await sleep(1500);
      input(chanId, "/me settles in");
      await sleep(11000); // let the speaker talk, incl. a highlight
      socket.emit("open", chanId);
      log(">>> open chan#" + chanId + " (mark as read)");
      await sleep(1000);
    } else {
      log("!! no channel joined");
    }
    log("--- disconnecting socket (public mode: session should vanish)");
    socket.disconnect();
    await sleep(1000);
    process.exit(0);
  }

  if (scenario === "deadnet") {
    log("--- creating network pointing at a dead port (127.0.0.1:19999)");
    socket.emit("network:new", { ...IRC, name: "DeadNet", port: 19999, join: "" });
    await sleep(8000);
    log("--- done (see lobby messages above)");
    process.exit(0);
  }

  if (scenario === "persist1") {
    const existing = init.networks[0];
    if (!existing) {
      log("--- creating network LabNet (127.0.0.1:16667), joining #lounge-lab");
      socket.emit("network:new", { ...IRC, nick: "reader" });
      await sleep(4000);
    } else {
      const ch = existing.channels.find((c) => c.type === "channel");
      if (ch) chanId = ch.id;
      log("--- network already exists, channel id " + chanId);
    }
    if (chanId) {
      input(chanId, "First message from the signed-in reader");
      await sleep(12000); // speaker talks live
      socket.emit("open", chanId);
      log(">>> open chan#" + chanId + " (mark as read, then leave)");
      await sleep(1000);
    }
    log("--- disconnecting socket; IRC connection must STAY up (private mode)");
    socket.disconnect();
    await sleep(1000);
    process.exit(0);
  }

  if (scenario === "persist2") {
    const net = init.networks[0];
    if (net) {
      const ch = net.channels.find((c) => c.type === "channel");
      if (ch) {
        chanId = ch.id;
        log(`--- after reconnect: channel unread=${ch.unread} highlight=${ch.highlight}`);
        socket.emit("more", { target: chanId, lastId: -1 });
        await sleep(1500);
        socket.emit("open", chanId);
        log(">>> open chan#" + chanId + " (mark as read)");
        await sleep(1000);
      }
    } else {
      log("!! no networks after reconnect");
    }
    log("--- verdict printed above; disconnecting");
    socket.disconnect();
    await sleep(500);
    process.exit(0);
  }

  if (scenario === "upload") {
    log("--- asking server for an upload token (upload:auth)");
    const token = await new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), 5000);
      socket.once("upload:auth", (t) => {
        clearTimeout(timer);
        resolve(t);
      });
      socket.emit("upload:auth");
    });
    log("upload token received:", token ? String(token).slice(0, 12) + "..." : token);
    if (token) {
      state.uploadToken = token;
      saveState();
      const file = path.join(__dirname, "fixture-upload.txt");
      fs.writeFileSync(file, "A small fixture file for the upload lab.\nSecond line, same file.\n");
      const form = new FormData();
      form.append("file", new Blob([fs.readFileSync(file)]), "fixture-upload.txt");
      const res = await fetch(URL + "/uploads/new/" + token, {
        method: "POST",
        body: form,
      });
      const body = await res.json().catch(() => ({}));
      log("POST /uploads ->", res.status, JSON.stringify(body));
      if (body.url) {
        state.uploadUrl = body.url;
        saveState();
        const full = body.url.startsWith("http") ? body.url : URL + "/" + body.url.replace(/^\//, "");
        const got = await fetch(full);
        const text = await got.text();
        log("GET " + full + " ->", got.status);
        log("fetched body matches uploaded file:", text === fs.readFileSync(file, "utf8"));
      }
    }
    process.exit(0);
  }

  log("unknown scenario");
  process.exit(1);
}

main().catch((e) => {
  console.error("client error:", e);
  process.exit(1);
});
