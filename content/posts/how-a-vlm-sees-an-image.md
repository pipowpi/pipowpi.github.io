---
title: How a vision-language model sees an image
summary: Patches, an encoder, and a small adapter: the three steps that turn pixels into something a language model can read.
date: 2026-10-02
read: 6 min
tags: VLMs, Deep learning
draft: true
---
A language model reads tokens. A picture is not made of tokens, so a vision-language model needs a bridge. Most designs follow the same three-step recipe.

## Step 1: cut the image into patches

A vision transformer splits the image into a grid of small patches, for example 16 by 16 pixels each. Every patch is flattened and projected into a vector, and position information is added so the model knows where each patch came from. The image becomes a sequence, much like a sentence.

## Step 2: encode the patches

A transformer encoder lets the patches attend to each other, so a patch showing part of a wheel can pick up context from the patches around it. The output is one embedding per patch describing what is there. The encoder is often pretrained with a contrastive objective like CLIP's, which pulls an image and its caption close together in embedding space.

## Step 3: project into the language model's space

The language model expects embeddings of a particular size and meaning. A small adapter, such as a linear layer or a short MLP, maps the image embeddings into that space. The language model then treats them like extra tokens placed before or alongside the text prompt, and generates its answer one token at a time as usual.

## Why the details matter

Each choice has a cost. More patches mean finer detail but a longer sequence and more compute. A frozen encoder is cheap to train but limits what the model can learn about images. Where and how the image tokens are injected changes how well the model can tie its words to specific regions. Much of VLM research is variations on these three decisions.
