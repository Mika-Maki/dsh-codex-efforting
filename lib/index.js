/**
 * dsh-codex-efforting, node half.
 *
 * This package contributes browser presentation only: it takes over the
 * composer's `conversation.input.model` seat and renders the reasoning-effort
 * slider there. The empty `apply` gives the Loader a host-side row so the
 * package composes like any other plugin, while the browser half ships through
 * `exports["./client"]` and is wired by the `dsh.client` declaration.
 *
 * @module dsh-codex-efforting
 */

/** Host plugin body — no host-side contribution. */
export function apply() {}
