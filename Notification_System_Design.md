# Stage 1

## Priority Inbox — Top N Priority Notifications

This document outlines the architecture, algorithm, and implementation details for generating the Top N prioritized notifications.

### Algorithm Design & Approach

To implement the required priority rules:
1. **Priority Rule 1 (Category Weight):** `Placement` > `Result` > `Event`
2. **Priority Rule 2 (Recency):** Within the same category, newer notifications (based on `Timestamp`) must appear before older ones.

#### Traditional Approach vs. Grouped Sorting Approach

- **Traditional Approach (Single Sort Pass):** A single pass with a custom comparator that performs category priority lookup and parses date strings for every comparison. This incurs $O(M \log M)$ overhead with higher constant factors because date string parsing is called repeatedly.
- **Grouped Sorting Approach (Implemented):** 
  1. We split the incoming array of notifications into specific sub-arrays based on category (`placements`, `results`, `events`, `other`) in a single $O(M)$ scan.
  2. We sort each sub-array independently by timestamp in descending order. Sorting smaller arrays requires fewer comparisons than sorting one large array.
  3. We concatenate the sorted groups back together in the exact order of their priority: `[...placements, ...results, ...events, ...other]`.
  4. We slice the top $N$ items to return.

This approach is highly maintainable, has excellent constant-factor performance, and avoids complex, nested comparator functions.

### Maintaining the Top 10 Efficiently with Incoming Streams

As new notifications arrive, we can maintain the Top 10 list without sorting the entire historical dataset:

1. **Incremental Insertion (Priority List):**
   * Keep a sorted array of the current Top 10 items.
   * For each new incoming notification, check if it has a higher priority than the 10th item in our sorted array.
   * If yes, use binary search to find its correct insertion index in the array ($O(\log 10) \approx 3.3$ comparisons), insert it, and remove the 10th item.
   * This maintains the Top 10 in $O(1)$ time per update.

2. **Bounded Min-Heap (Priority Queue):**
   * Maintain a Min-Heap of size 10 where the root element always holds the lowest priority item in the top 10.
   * When a new notification arrives, compare it with the root. If it has higher priority, replace the root and run `heapify` (which takes $O(\log 10) = O(1)$ time).
   * This is optimal for memory and update speed when handling massive streams.

### Time & Space Complexity

- **Time Complexity (Initial Batch):** 
  - **Category Splitting:** $O(M)$ to partition notifications.
  - **Sorting Groups:** Let the sizes of the lists be $M_1, M_2, M_3$. The time spent sorting is $O(M_1 \log M_1 + M_2 \log M_2 + M_3 \log M_3)$, which is strictly less than sorting the entire list $O(M \log M)$ at once.
  - **Concatenation and Slicing:** $O(M + N)$.
  - **Total Time Complexity:** $O(M \log M)$ in the worst-case (if all items belong to a single category), but significantly faster in typical scenarios where categories are balanced.
- **Space Complexity:** $O(M)$ to hold the partitioned arrays.

### Verification and Logging

The system is fully integrated with the logging middleware. The following sequence of events is logged with appropriate severity:
1. `Notification fetch started` (Info)
2. `Notification fetch completed successfully` (Info) / `Notification fetch failed` (Error)
3. `Priority calculation started` (Info)
4. `Priority calculation completed` (Info)
5. `Unexpected error` (Error)
