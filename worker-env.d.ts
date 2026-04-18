declare namespace Cloudflare {
  interface Env {
    WORKERS_CI_COMMIT_SHA: string;
    WORKERS_CI_BUILD_UUID: string;
  }
}
