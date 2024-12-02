# Astro CUBE CSS Boilerplate testing Tailwind CSS v4.0 alpha

Fork of [Astro CUBE Boilerplate](https://github.com/frankstallone/astro-cube-boilerplate).

## TODO/TOFIX

- [x] Replace all tokens, now added in `./src/css/variables/*`.
- [ ] Tailwind's media query function `screen()`, found in `./src/css/components/grid.css`, currently doesn't work in v4.0.0-alpha.7.
- [ ] Add utilities, inc: region-space, flow-space, and gutter. `tailwind.config.mjs` doesn't do anything at this time.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |
