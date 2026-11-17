---
title: Threat modeling a CI cluster with STRIDE
summary: Six questions, applied to every component of a system that runs other people's code.
date: 2026-10-08
read: 5 min
tags: Security, CI/CD
draft: true
---
STRIDE is a checklist of six ways something can go wrong, meant to be applied to each part of a system's data flow diagram. It is simple enough to use on a whiteboard, which is its main virtue. Here is how each letter looks for a CI cluster that runs other people's code.

## Spoofing

Can someone pretend to be a trusted identity? Think of a forged webhook that claims to come from your source host, or a rogue machine registering itself as a worker. The fixes are authentication on every hop and short-lived, narrowly scoped credentials.

## Tampering

Can data be changed in transit or at rest? Build artifacts, job definitions and base images are all inputs someone could alter. Signed images and verified job definitions make tampering visible.

## Repudiation

Can someone deny what they did? When a job misbehaves you need to know who triggered it and what it ran. Audit logs that the job itself cannot edit answer that.

## Information disclosure

Can secrets leak? Jobs run with tokens and environment variables, and their logs are often readable by many people. Keep secrets away from untrusted jobs, and scrub what reaches the logs.

## Denial of service

Can someone exhaust the system? One runaway or malicious job can hold a GPU for hours. Quotas, timeouts and fair scheduling keep a single job from starving everyone else.

## Elevation of privilege

Can a job break out of its sandbox? Running untrusted code on your own hardware makes this the one that keeps you up at night. Isolation per job, such as a fresh VM that is destroyed afterwards, plus network policies that block everything the job does not need, limits the blast radius.

None of this is exotic. The value is in walking every component through the same six questions and writing down the answers, so the gaps show up before an attacker finds them.
