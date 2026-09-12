import { useScrollStoryMode } from "./useScrollStoryMode";
import { ScrollStoryPinned } from "./ScrollStoryPinned";
import { ScrollStoryFallback } from "./ScrollStoryFallback";

/** Root switch between the pinned 3D scroll sequence and its static fallback. */
export function ScrollStory() {
  const { isCompact } = useScrollStoryMode();
  return isCompact ? <ScrollStoryFallback /> : <ScrollStoryPinned />;
}
