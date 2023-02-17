# Kuuma: Substrate Vault

## Project Name

Kuuma: Substrate Vault with complex hierarchical and granular transaction approval policies.


## Project Description

Kuuma is an app that provides a simple user interface for creating and managing [Substrate](https://substrate.io/) "vaults" with complex hierarchical and granular transaction approval policies.

A "vault" is a high-level keyless account abstraction that uses a [pure/anonymous proxy](https://wiki.polkadot.network/docs/learn-proxies#anonymous-proxy-pure-proxy) as the user-facing account/address 
that is in turn controlled by other [proxy accounts](https://wiki.polkadot.network/docs/learn-proxies), that can be [standard accounts (private key accounts)](https://wiki.polkadot.network/docs/learn-accounts), [multi-signature accounts](https://wiki.polkadot.network/docs/learn-account-multisig) 
or even other pure/anonymous proxies, based on complex hierarchical and granular transaction approval policies.

Kuuma leverages the composability of Substrate's robust and powerful account primitives to provide features like:

- Complex and hierarchical transaction approval policies (e.g. either the CEO alone, or the CFO and COO together, or any other combination of 3 executives can approve transactions).
- Granular access control based on the type of transaction and role of the signatories by leveraging the different delegation types available for proxy accounts (e.g different sets of approval policies and signatories for transfers, staking, governance, auctions etc).
- Account and/or key rotation and approval policy changes while preserving the same user-facing vault address.
- Ability to prevent destructive and unrecoverable proxy related actions when using the Kuuma interface (e.g. not allowing users to remove the last any type proxy from a vault).


To minimize the risk of potentially destructive approval policy management actions due to order of execution of approval policy management transactions, Kuuma executes all changes to approval polices as [batchAll](https://polkadot.js.org/docs/substrate/extrinsics#batchallcalls-veccall) calls which are atomically executed.

## Team

| Name           | Email                   | Github                                            |
|----------------|-------------------------|---------------------------------------------------|
| David Semakula | hello@davidsemakula.com | [davidsemakula](https://github.com/davidsemakula) |


## Category

01 Interfaces and Experiences


## The Problem

Substrate and Polkadot provide very robust and powerful account primitives including [proxy](https://wiki.polkadot.network/docs/learn-proxies), [pure/anonymous proxy](https://wiki.polkadot.network/docs/learn-proxies#anonymous-proxy-pure-proxy), [multi-signature](https://wiki.polkadot.network/docs/learn-account-multisig) and [standard (private key)](https://wiki.polkadot.network/docs/learn-accounts) accounts
which can be composed into complex and flexible high-level abstractions to model complex real-world account relationships and access control structures.

However, there are very few foolproof and user-friendly UI (user interface) tools that allow non-technical users to leverage these capabilities to create and manage accounts with complex hierarchical and granular transaction approval policies for both personal and corporate use.
Kuuma aims to change this.


## How we use Substrate

Kuuma's functionality relies on the [proxy](https://github.com/paritytech/substrate/tree/master/frame/proxy), [mutlisig](https://github.com/paritytech/substrate/tree/master/frame/multisig) and [utility](https://github.com/paritytech/substrate/tree/master/frame/utility) pallets which it interacts with through the [@polkadot/api](https://www.npmjs.com/package/@polkadot/api) library.


## Technology Stack
[TypeScript](https://www.typescriptlang.org/), [React.js](https://reactjs.org/), [polkadot{.js}](https://polkadot.js.org/)


## Video Demo
[https://www.loom.com/share/f71a7b50af4a4eb18c52d102dfc9cbe2](https://www.loom.com/share/f71a7b50af4a4eb18c52d102dfc9cbe2)


## Instructions

### For Demos and Testing

- Go to [https://kuuma.davidsemakula.com](https://kuuma.davidsemakula.com)


### For Developers

#### Install dependencies

```shell
yarn install
```

#### Start a local dev server.

```sh
yarn start
```

Go to [http://localhost:3000/](http://localhost:3000/) to use the app


## Miscellaneous

Kuuma was built for [Polkadot Hackathon Global Series: Europe Edition](https://www.polkadotglobalseries.com/)


## License
This code is released under GPL-3.0