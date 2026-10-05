# Install Guide

Status: draft, 5 October 2026. Written for presenters setting up a Mac to run the Bird Table demo. In the demo, an AI coding agent adds a range safety alert to a military common operating picture. Facts about outside products are labelled confirmed (with where and when they were checked), or unconfirmed.

## What You Need

A Mac with an Apple silicon chip (M1 or later), an internet connection for the setup, and about half an hour. You do not need to be an engineer. Every command below is typed, or pasted, into the Terminal app exactly as shown.

You do not need a GitHub account: the demo's code is public, and nothing in the demo is sent back to GitHub. You do need a Cosine account, for the coding agent.

## Step 1: Install Git

Open Terminal and type `git --version`. If macOS offers to install the 'command line developer tools', accept, and wait for it to finish. Git is how you download the demo, and how the demo command keeps each run separate.

Then tell Git a name and email, which it records against any change made on your Mac, including any the agent makes:

    git config --global user.name "Your Name"
    git config --global user.email "you@example.com"

## Step 2: Install Homebrew

Homebrew installs the other two things the demo needs. In Terminal:

    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

It explains what it will do and pauses; press Return to carry on. It asks for your Mac's password; type it and press Enter (nothing appears as you type). If it ends by printing 'Next steps' with commands to run, run them exactly as shown. Then close Terminal and open it again, and check with `brew --version`.

## Step 3: Install Node

Node runs the picture. In Terminal:

    brew install node

Then check it with `node --version`. The demo needs 22.12 or later on the 22 line, or 24, or 26 or later; Homebrew's current Node is fine.

## Step 4: Install and Sign In to Cosine CLI

Cosine CLI is the AI coding agent the audience watches.

Use the same version of Cosine that the demo was rehearsed with; the demo's owner tells you which. The public version, called `cos`, installs with:

    brew install CosineAI/tap/cos

Check it with `cos --version`, then sign in with `cos login`, which opens a browser page to sign in to your Cosine account. When the page shows that you are signed in, switch back to Terminal.

## Step 5: Set Up the Model Cosine Uses

Not decided yet. Every presenter must use exactly the same model setup that was used in rehearsal, or the rehearsal results mean little. The demo's owner tells you which setup that is.

## Step 6: Download the Demo

In Terminal:

    git clone https://github.com/sebmatthews/bird-table.git
    cd bird-table
    npm install

This makes a folder called bird-table in your home folder and installs what the picture needs. Whenever you run the demo, open Terminal and go into it first with `cd bird-table`.

## Step 7: Check Everything Is Ready

In the bird-table folder:

    ./demo.sh check

It checks Node, the installed packages, Git, the saved backup, Cosine and the tests, and says 'Ready for a demo', or names what to fix. It changes none of the demo's code.

## If Something Goes Wrong

Write down the exact message Terminal shows and send it to the demo's owner. Do not try other commands you find online; the demo depends on every Mac being set up the same way.

## Where These Facts Come From

- Homebrew's install command, and its pause before it starts: https://brew.sh, checked 5 October 2026
- Homebrew's Node package, version 26.10.0, with ready-built packages for Apple silicon Macs: https://formulae.brew.sh/formula/node, checked 5 October 2026
- Cosine CLI install with Homebrew, `cos --version` and `cos login`, and the sign-in success page: https://cosine.sh/docs/cli/install-and-authenticate-the-cli, checked 5 October 2026
- Git and the command line developer tools prompt: https://developer.apple.com/forums/thread/672087, checked 5 October 2026
- Node versions the demo's tools need: the engines fields of Vite 8.3.2 (20.19 or later on the 20 line, or 22.12 or later) and Vitest 5.0.3 (22.12 or later on the 22 line, 24, or 26 or later) in the npm registry, checked 5 October 2026
