---
title: Push or pull: how a CI runner gets its work
summary: Why letting workers ask for jobs can be safer than having a controller send them.
date: 2026-10-20
read: 5 min
tags: CI/CD, Security
draft: true
diagram: pushpull
caption: Push needs a way into the worker’s network. Pull only needs the worker to reach out.
---
Every CI system has to answer a simple question: how does a job get from the place that decides it should run to the machine that runs it? There are two basic answers, and the choice shapes your security posture more than most people expect.

## Push: the controller reaches out

In a push model, something central decides a job is ready and delivers it to a worker. For that to work, the worker has to be reachable, or the controller needs credentials powerful enough to start work on it. On infrastructure you own, that usually means opening inbound access into the network where the workers live, and holding credentials that can act on them.

## Pull: the worker asks

In a pull model, the worker starts the conversation. It asks a job service "is there anything for me?" over an outbound connection, claims a job if one exists, runs it, and reports the result back. Nothing needs to reach into the worker's network, and the worker only ever holds the permission to claim and run jobs.

## What you trade

Pull is not free. Workers poll or hold a long connection, so you have to manage latency and load on the job service. You need a clear way to hand a job to exactly one worker, and to recover when a worker disappears halfway through. Push gives you immediate delivery and simple routing, but a bigger network surface to defend.

For CI on self-hosted GPU hardware that runs code from many contributors, I lean toward pull. The machines doing the risky work should be the ones with the fewest doors open, and the extra bookkeeping is a fair price for hardware you cannot afford to expose.
