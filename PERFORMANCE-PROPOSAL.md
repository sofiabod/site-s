# Proposed rendering and image optimizations

Prepared locally for approval. Nothing has been pushed, merged, or deployed.
The review branch is `perf/rendering-and-images-review` in
`/Users/sonia/site-s-performance-review`, based on production commit `8a7e9f7`.
The baseline build reproduced the live site's exact JS and CSS filenames:
`index-B7r_cixt.js` and `index-BzMFUyzr.css`.
The older `/Users/sonia/site-s` checkout and its existing edits were left intact.

Review the production build at http://127.0.0.1:4176/ and the unchanged baseline
at http://127.0.0.1:4175/ while the local comparison server is running.

I recommend shipping the combined patch below after your approval. It preserves
the current dark design, content, navigation, and photo hover/focus treatment.

| Measured item | Current build | Proposed build | Reduction |
| --- | ---: | ---: | ---: |
| Mobile first content / LCP, median | 828 ms | 344 ms | 58% |
| Desktop first content / LCP, median | 824 ms | 340 ms | 59% |
| Completed initial resource transfers | 387.6 KB | 88.6 KB | 77% |
| Initial JS, gzip, excluding external analytics | 70.9 KB | 18.1 KB | 74% |
| Entire gallery image transfers, including hover layers | 8.87 MB | 0.369 MB | 96% |
| Entire gallery ready, mobile | 45.2 s | 2.8 s | 94% |
| Entire gallery ready, desktop | 47.4 s | 2.8 s | 94% |
| Mobile layout shift score | 0.0243 | 0.0226 | Small improvement |

These are local laboratory measurements, not production field data or a promise
for every visitor. Chromium used a fresh context and disabled cache, 1.6 Mbps
download, 150 ms latency, and 4× CPU throttling. Viewports were 390×844 at DPR 3
and 1440×1000 at DPR 2. Homepage numbers are medians of three runs per viewport;
the full-gallery measurements are one traversal per viewport, scrolling every
image into range and waiting for all 16 image layers to complete. Asset transfer
numbers include the test server's HTTP headers; file sizes use decimal KB/MB.
The original external Google font request remained real. The visit counter and
Vercel analytics were stubbed identically in both versions, avoiding test traffic
in your statistics. Their real production cost is not included. Measurements do
not assume savings from the removed video; only completed resource transfers
were counted. Browser long-task entries were empty in these runs, so no CPU
speedup is claimed from that metric.

The proposed changes are:

1. **Generate HTML during the build.** The current page starts with an empty root
   and must download and execute React before displaying content. The new build
   sends the homepage markup immediately and hydrates it for interactions. Its
   roughly 4 KB compressed stylesheet is included in the HTML, removing a
   separate render-blocking request. It remains a Vite static deployment; no running SSR server is required.
2. **Use Preact's React compatibility layer.** Existing JSX and component APIs
   remain, but the browser runtime is smaller. Initial JavaScript falls from
   225 KB to 52.6 KB uncompressed. Article code is loaded only if opened.
   This is the principal framework-level tradeoff: future React-specific
   integrations should be checked for Preact compatibility. React dependencies
   remain for the existing component/type ecosystem, but are aliased out of the
   browser bundle. The other optimizations can be retained if this runtime change
   is declined.
3. **Build responsive images from untouched originals.** The 21 referenced
   raster images total 9.72 MB. Even their largest generated AVIF/logo versions
   total only 0.793 MB. Photos have 320/560/840 px candidates; publication figures
   have 180/360/540 px candidates; logos target approximately 3× display size.
   Browsers select AVIF with WebP fallback. Image dimensions and async decoding
   are provided, and gallery images retain lazy loading. Both the photo and its
   hover cover are optimized. Re-encoding is lossy for photos; logos use lossless
   WebP after resizing. Original source files remain available. A future zoom or
   full-screen photo view would need larger candidates.
4. **Serve the same Hanken Grotesk font locally.** The upright font is preloaded,
   the italic file is requested only when used, and the license is included.
   The webring icon is also local. Neither Google Fonts nor the webring host is
   needed to render the proposed page.
5. **Remove invisible work and cache generated assets.** The hidden ASCII widget
   and its loader are removed. The background grid does not draw on viewports
   where it is hidden or when reduced motion is requested; resize draws are
   coalesced to animation frames. Hashed images and Vite assets receive a proposed
   one-year immutable cache policy in `vercel.json`. HTML is not given an immutable
   cache policy. The new CDN headers still need verification on Vercel after an
   approved deployment.

`npm run build`, `npm run lint`, `git diff --check`, and a Vite development-mode
smoke check passed. The build regenerates all image derivatives before bundling,
then renders static HTML. Every referenced generated image was checked on disk.
Chromium browser checks passed at mobile and desktop widths for all tabs,
restoring the saved tab after reload, all 16 gallery layers, publication images,
AVIF selection, forced WebP fallback, photo hover and keyboard focus, disabled
localStorage, reduced motion, no runtime errors, and no hidden butterfly or
external font requests. The homepage content and job links render with JavaScript
disabled. Screenshots were inspected. Safari/Firefox have not been tested here.

Reproduce the local production preview with `npm ci`, `npm run build`, then
`npm run preview -- --host 127.0.0.1 --port 4176` after stopping the comparison
server. Raw measurements, screenshots, and browser-check scripts are in
`/Users/sonia/site-s-diagnostics/2026-10-15/` (`baseline.json`, `final.json`,
`summary.json`, `verification.json`, `benchmark.mjs`, and `verify.mjs`).

The build approach follows [Vite's pre-rendering guidance](https://vite.dev/guide/ssr.html).
Image selection follows [responsive-image guidance](https://web.dev/learn/design/responsive-images?hl=en).
The runtime change uses [Preact's documented compatibility approach](https://preactjs.com/guide/v10/getting-started/).
These references explain the implementation; all numerical results above come
from the local measurements.

Approval requested for this specific local patch before any push or deployment.
Before release, check that production has not advanced from the recorded baseline;
reconcile any newer changes, then deploy only after approval.
