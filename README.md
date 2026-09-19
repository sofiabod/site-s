# sofia bodnar 

personal portfolio site 

Events are grouped by year in `src/events.ts`. The 2026 `events` list contains a separate block for each event, with a title, optional subtitle and link, and photos. To add photos, put the images in `public/photos/2026/` and add their `src` and `alt` to the event's `photos` array. Set `portrait: true` for a tall photo that should span both gallery rows, or `aspectRatio` to preserve a different thumbnail shape.

The 2025 `photos` array keeps the original gallery. Each entry has `src`, `alt`, and an event `href`. Both years support an optional `cover` image for the hover reveal; Z Fellows uses this effect on its two photos. A 2026 photo can also have its own `href`, such as an event recap post.
