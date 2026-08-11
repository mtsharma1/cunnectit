# Internal camera support (archived)

This folder contains the former internal camera presence, device, administrator, and WebRTC support feature.

The feature was intentionally removed from the public website. Its files live outside the active Next.js `app`, `components`, and `lib` directories, so none of its pages, API endpoints, browser prompts, or background presence requests are available in the website.

The existing database tables and historical camera-related records were not deleted. This avoids destructive data loss and allows the feature to be restored later if required.

To restore the feature, review its security and privacy design first, move the files back to their original paths, and explicitly add the `VisitorCameraPresence` component to the desired page.
