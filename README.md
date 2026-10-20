# sofia bodnar 

personal portfolio site 

Performance review branch: the homepage is pre-rendered during `npm run build`,
then hydrated with Preact's React compatibility layer. The small stylesheet is
inlined into the HTML so rendering does not wait for a CSS request. Original
photos remain in `public/`; the build generates responsive AVIF/WebP derivatives
and a content-hashed manifest with `npm run images`. Run that command separately
when adding photos during development. The Hanken Grotesk font is served locally;
its license is in `public/licenses/hanken-grotesk.txt`. The local webring icon
comes from https://cs.uwatering.com/icon.black.svg.

Nothing in this branch has been pushed or deployed. See `PERFORMANCE-PROPOSAL.md`
for the measurements, tradeoffs, and proposed release.
