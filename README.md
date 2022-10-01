# dfe-client-ts
 ## Dope Fish Engine Client

 This is a rough conversion of the *Dope Fish Engine* client from vanilla JS into *TypeScript*. The purpose of this version is both to start using a strictly-typed language for the engine and also to act as a stepping stone to ease the eventual conversion into *WebAssembly*.

 ## Demo
 See the client in action here:
 https://anjackthemage.github.io/dfe-client-ts/

 Click in the window to gain focus (enables mouselook). Move with WSAD, jump with Spacebar.

 ## Setup
 After you clone this repo, you will need to run `npm install` to set up dependencies. (Currently we are only using the *TypeScript* module, just for the compiler.)
 Once the dependencies are installed you can run `tsc` to compile the source back into JavaScript.
 Alternatively you can just run `npx tsc` to compile without installing the *TypeScript* module.

 ## Run
 To run the client, you just need to host the files. We've included `serve.cmd` and `serve.sh` which run a simple python HTTP server, for convenience.