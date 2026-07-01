/**
 * PYQ seed — IIT BHU placement drive questions + commonly asked OA questions.
 * Sources: WhatsApp screenshots from drive + well-known company OA patterns.
 * Run: node src/modules/prep/question.seed.js
 * Safe to re-run (upserts by slug).
 */

import "dotenv/config";
import mongoose from "mongoose";
import env from "../../config/env.js";
import Question from "./question.model.js";

const QUESTIONS = [

  // ═══════════════════════════════════════════════════════════
  //  AMAZON
  // ═══════════════════════════════════════════════════════════

  {
    company: "Amazon", section: "OA",
    title: "Find Pairs with Divisible Sum",
    slug: "amazon-find-pairs-divisible-sum",
    question: "Amazon offers a discount on pairs of products whose combined cost is divisible by x. Given an array of n product costs, find the number of pairs (i, j) where i < j and cost[i] + cost[j] is divisible by x.",
    functionSignature: "findPairs(int x, int[] cost): int",
    constraints: ["1 ≤ x ≤ 2×10⁹", "1 ≤ n ≤ 10⁵", "1 ≤ cost[i] ≤ 10⁹"],
    examples: [{ input: "n=5, x=60, cost=[31,25,85,29,35]", output: "3", explanation: "Pairs: (31,29)→60, (25,35)→60, (85,35)→120" }],
    difficulty: "Medium", tags: ["modular arithmetic", "hash map", "counting"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Amazon", section: "OA",
    title: "Find Capable Winners",
    slug: "amazon-find-capable-winners",
    question: "Amazon is hosting a tournament with n players. Each player has three power boosters: power_a[i], power_b[i], power_c[i]. Player X beats player Y if X can arrange their boosters to win ≥2 of 3 head-to-head comparisons against Y's optimal arrangement. Return the count of players who can defeat every other player.",
    functionSignature: "findCapableWinners(int[] power_a, int[] power_b, int[] power_c): int",
    constraints: ["2 ≤ n ≤ 10⁵", "1 ≤ power_a/b/c[i] ≤ 10⁹", "All booster values are pairwise distinct"],
    examples: [{ input: "n=4, power_a=[3,4,1,16], power_b=[2,11,5,6], power_c=[8,7,9,10]", output: "2", explanation: "Players 2 and 4 can beat all others." }],
    difficulty: "Hard", tags: ["greedy", "sorting", "game theory"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Amazon", section: "OA",
    title: "Minimize Maximum Parcels",
    slug: "amazon-minimize-max-parcels",
    question: "Amazon has n delivery agents. Agent i has parcels[i] parcels. Distribute extra_parcels additional parcels among agents to minimize the maximum parcels any single agent delivers.",
    functionSignature: "getMinMaxParcels(int[] parcels, long extra_parcels): long",
    constraints: ["1 ≤ n ≤ 10⁵", "0 ≤ parcels[i] ≤ 10⁹", "1 ≤ extra_parcels ≤ 10¹²"],
    examples: [{ input: "n=5, parcels=[7,5,1,9,1], extra_parcels=25", output: "10", explanation: "Binary search on answer. Optimal max = 10." }],
    difficulty: "Medium", tags: ["binary search", "greedy"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Amazon", section: "OA",
    title: "Find Outlier Value",
    slug: "amazon-find-outlier-value",
    question: "An AWS array has (n-2) normal numbers and 2 special values: the sum of normal numbers, and an outlier. Find and return the greatest possible outlier (the element that is neither a normal number nor their sum).",
    functionSignature: "getOutlierValue(int[] arr): int",
    constraints: ["4 ≤ n ≤ 10⁵", "All elements are distinct", "-10⁹ ≤ arr[i] ≤ 10⁹"],
    examples: [{ input: "n=6, arr=[4,1,3,16,2,10]", output: "16", explanation: "Normal numbers {1,2,3,4}, sum=10, outlier=16." }],
    difficulty: "Medium", tags: ["arrays", "math", "prefix sum"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Amazon", section: "OA",
    title: "Minimum Difficulty of a Job Schedule",
    slug: "amazon-min-difficulty-job-schedule",
    question: "You want to schedule a list of jobs in d days. Jobs must be performed in the given order — to work on job i, you must finish all jobs j where j < i. The difficulty of a day is the maximum job difficulty during that day. The total difficulty is the sum of difficulties over all d days. Return the minimum difficulty of the job schedule. Return -1 if it is not possible.",
    functionSignature: "minDifficulty(int[] jobDifficulty, int d): int",
    constraints: ["1 ≤ jobDifficulty.length ≤ 300", "0 ≤ jobDifficulty[i] ≤ 1000", "1 ≤ d ≤ 10"],
    examples: [{ input: "jobDifficulty=[6,5,4,3,2,1], d=2", output: "7", explanation: "Day 1: [6,5,4,3,2], max=6. Day 2: [1], max=1. Total=7." }],
    difficulty: "Hard", tags: ["dynamic programming", "stack"], year: 2023, platform: "HackerRank",
  },

  {
    company: "Amazon", section: "OA",
    title: "Subarray Sum Equals K",
    slug: "amazon-subarray-sum-k",
    question: "Amazon's monitoring system tracks request counts. Given an array of integers nums and an integer k, return the total number of continuous subarrays whose sum equals to k.",
    functionSignature: "subarraySum(int[] nums, int k): int",
    constraints: ["1 ≤ nums.length ≤ 2×10⁴", "-1000 ≤ nums[i] ≤ 1000", "-10⁷ ≤ k ≤ 10⁷"],
    examples: [{ input: "nums=[1,1,1], k=2", output: "2", explanation: "Subarrays [1,1] starting at index 0 and 1 both sum to 2." }],
    difficulty: "Medium", tags: ["prefix sum", "hash map"], year: 2023, platform: "HackerRank",
  },

  {
    company: "Amazon", section: "OA",
    title: "Reorder Routes to Reach City Zero",
    slug: "amazon-reorder-routes-city-zero",
    question: "There are n cities numbered 0 to n-1 and n-1 roads forming a tree. Roads are directed. Reorient the minimum number of roads so that every city can reach city 0.",
    functionSignature: "minReorder(int n, int[][] connections): int",
    constraints: ["2 ≤ n ≤ 5×10⁴", "connections.length == n-1", "connections[i].length == 2"],
    examples: [{ input: "n=6, connections=[[0,1],[1,3],[2,3],[4,0],[4,5]]", output: "3", explanation: "Roads [0→1], [1→3], [4→5] need to be reversed." }],
    difficulty: "Medium", tags: ["BFS", "DFS", "graphs", "trees"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  MICROSOFT
  // ═══════════════════════════════════════════════════════════

  {
    company: "Microsoft", section: "OA",
    title: "Minimize Difference by Digit Swapping",
    slug: "microsoft-minimize-difference-digit-swap",
    question: "Given two strings S and T of equal length representing large integers, swap corresponding digits (at the same position) to minimize the absolute difference |S−T|. Return the minimum number of swaps to achieve this minimum difference.",
    functionSignature: "solution(char* S, char* T): int",
    constraints: ["1 ≤ length(S) = length(T) ≤ 100,000", "No leading zeros", "Only digit characters"],
    examples: [{ input: 'S="29162", T="10524"', output: "2", explanation: "Swap positions 2 and 4 to minimize |S−T|." }],
    difficulty: "Medium", tags: ["greedy", "strings", "math"], year: 2024, platform: "Codility",
  },

  {
    company: "Microsoft", section: "OA",
    title: "Best Card Set (Poker Hands)",
    slug: "microsoft-best-card-set",
    question: "Given N cards in \"<rank><suit>\" format, detect the strongest possible hand from (weakest to strongest): single card, pair, triple, five in a row, suit (flush), triple and a pair (full house). Return the set name and the cards selected.",
    functionSignature: "Results solution(vector<string>& cards)  // Returns { set_name, selected_cards }",
    constraints: ["1 ≤ N ≤ 10", "All cards are distinct", "Valid <rank><suit> format"],
    examples: [{ input: 'cards=["10D","10H","10C","2S","2H","JH","JC"]', output: '{ set_name: "a triple and a pair", selected_cards: ["10D","10H","10C","JH","JC"] }', explanation: "Full house beats all other sets." }],
    difficulty: "Medium", tags: ["simulation", "sorting", "cards"], year: 2024, platform: "Codility",
  },

  {
    company: "Microsoft", section: "OA",
    title: "Minimum Road Reorientation (Tree)",
    slug: "microsoft-minimum-road-reorientation",
    question: "A tree of N+1 cities with N directed roads. Reorient the minimum number of roads so that all cities can reach city 0.",
    functionSignature: "solution(int[] A, int[] B, int N): int",
    constraints: ["1 ≤ N ≤ 100,000", "Arrays A and B describe N directed edges", "Roads form a tree"],
    examples: [{ input: "N=4, A=[0,2,3,4], B=[1,0,2,1]", output: "2", explanation: "Flip 2 roads to make all paths lead to node 0." }],
    difficulty: "Hard", tags: ["graphs", "trees", "BFS", "DFS"], year: 2024, platform: "Codility",
  },

  {
    company: "Microsoft", section: "OA",
    title: "Longest Red-Green Tile Sequence",
    slug: "microsoft-longest-tile-sequence",
    question: "N tiles, each a two-character string (R or G for left/right squares). Two tiles are connectable if the right square of the left tile matches the left square of the right tile. Find the maximum number of tiles that can form a valid sequence.",
    functionSignature: "solution(char* A[], int N): int",
    constraints: ["1 ≤ N ≤ 100,000", "Each tile is exactly 2 chars from {R, G}"],
    examples: [{ input: 'N=7, A=["RR","GR","RG","GR","GR","GR","RR"]', output: "6", explanation: "Select 6 tiles that form a valid chain." }],
    difficulty: "Medium", tags: ["dynamic programming", "graphs", "sequences"], year: 2024, platform: "Codility",
  },

  {
    company: "Microsoft", section: "OA",
    title: "Maximum Subarray",
    slug: "microsoft-maximum-subarray",
    question: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    functionSignature: "maxSubArray(int[] nums): int",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    examples: [{ input: "nums=[-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum = 6." }],
    difficulty: "Easy", tags: ["dynamic programming", "divide and conquer", "Kadane's algorithm"], year: 2023, platform: "Codility",
  },

  {
    company: "Microsoft", section: "OA",
    title: "Merge Intervals",
    slug: "microsoft-merge-intervals",
    question: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    functionSignature: "merge(int[][] intervals): int[][]",
    constraints: ["1 ≤ intervals.length ≤ 10⁴", "intervals[i].length == 2", "0 ≤ starti ≤ endi ≤ 10⁴"],
    examples: [{ input: "intervals=[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "[1,3] and [2,6] overlap → [1,6]." }],
    difficulty: "Medium", tags: ["sorting", "intervals", "arrays"], year: 2023, platform: "Codility",
  },

  // ═══════════════════════════════════════════════════════════
  //  GOOGLE
  // ═══════════════════════════════════════════════════════════

  {
    company: "Google", section: "OA",
    title: "First Subsequence with One Change",
    slug: "google-first-subsequence-one-change",
    question: "Given strings A and B, find if A contains B as a subsequence where you can change at most 1 character in B (except the first). Return the first 1-based starting index in A, or -1 if not found.",
    functionSignature: "firstOccurence(string A, string B): int",
    constraints: ["1 ≤ T ≤ 10", "1 ≤ |A|, |B| ≤ 2000"],
    examples: [{ input: "A=daabe, B=abe", output: "2", explanation: "B occurs at index 2 without any change." }, { input: "A=lhs, B=rhs", output: "-1", explanation: "First char cannot be changed; 'r' not in A." }],
    difficulty: "Medium", tags: ["strings", "subsequence", "two pointers"], year: 2024, platform: "HackerEarth",
  },

  {
    company: "Google", section: "OA",
    title: "Maximum Level Sum of Binary Tree",
    slug: "google-max-level-sum-binary-tree",
    question: "Given the root of a binary tree, return the smallest level X such that the sum of all node values at level X is maximal. The root is at level 1.",
    functionSignature: "maxLevelSum(TreeNode root): int",
    constraints: ["Number of nodes in tree: [1, 10⁴]", "-10⁵ ≤ Node.val ≤ 10⁵"],
    examples: [{ input: "root=[1,7,0,7,-8,null,null]", output: "2", explanation: "Level 1 sum=1, Level 2 sum=7+0=7, Level 3 sum=7-8=-1. Max sum is at level 2." }],
    difficulty: "Medium", tags: ["BFS", "binary tree", "level order"], year: 2024, platform: "HackerEarth",
  },

  {
    company: "Google", section: "OA",
    title: "Trapping Rain Water",
    slug: "google-trapping-rain-water",
    question: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    functionSignature: "trap(int[] height): int",
    constraints: ["n == height.length", "1 ≤ n ≤ 2×10⁴", "0 ≤ height[i] ≤ 10⁵"],
    examples: [{ input: "height=[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "The elevation map traps 6 units of rain water." }],
    difficulty: "Hard", tags: ["two pointers", "stack", "dynamic programming"], year: 2023, platform: "HackerEarth",
  },

  {
    company: "Google", section: "OA",
    title: "Word Break",
    slug: "google-word-break",
    question: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    functionSignature: "wordBreak(String s, List<String> wordDict): boolean",
    constraints: ["1 ≤ s.length ≤ 300", "1 ≤ wordDict.length ≤ 1000", "1 ≤ wordDict[i].length ≤ 20"],
    examples: [{ input: 's="leetcode", wordDict=["leet","code"]', output: "true", explanation: '"leetcode" = "leet" + "code".' }],
    difficulty: "Medium", tags: ["dynamic programming", "BFS", "memoization"], year: 2023, platform: "HackerEarth",
  },

  {
    company: "Google", section: "OA",
    title: "Number of Islands",
    slug: "google-number-of-islands",
    question: "Given an m×n 2D binary grid of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    functionSignature: "numIslands(char[][] grid): int",
    constraints: ["1 ≤ m, n ≤ 300", "grid[i][j] is '0' or '1'"],
    examples: [{ input: "grid=[[1,1,0],[1,0,0],[0,0,1]]", output: "2", explanation: "Two separate landmasses." }],
    difficulty: "Medium", tags: ["BFS", "DFS", "union find", "matrix"], year: 2023, platform: "HackerEarth",
  },

  // ═══════════════════════════════════════════════════════════
  //  ADOBE
  // ═══════════════════════════════════════════════════════════

  {
    company: "Adobe", section: "OA",
    title: "K Closest Points to Origin",
    slug: "adobe-k-closest-points",
    question: "Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane, return the k closest points to the origin (0, 0). Distance is Euclidean. Answer can be returned in any order.",
    functionSignature: "kClosest(int[][] points, int k): int[][]",
    constraints: ["1 ≤ k ≤ points.length ≤ 10⁴", "-10⁴ ≤ xi, yi ≤ 10⁴"],
    examples: [{ input: "points=[[1,3],[-2,2]], k=1", output: "[[-2,2]]", explanation: "√8 < √10, so (-2,2) is closer." }],
    difficulty: "Medium", tags: ["heap", "sorting", "divide and conquer"], year: 2024, platform: "Codility",
  },

  {
    company: "Adobe", section: "OA",
    title: "Find the Duplicate Number",
    slug: "adobe-find-duplicate",
    question: "Given an array nums containing n+1 integers where each integer is in [1, n], there is only one repeated number. Find and return this repeated number using O(1) extra space (no modifying the array).",
    functionSignature: "findDuplicate(int[] nums): int",
    constraints: ["1 ≤ n ≤ 10⁵", "nums.length == n+1", "1 ≤ nums[i] ≤ n", "Only one duplicate"],
    examples: [{ input: "nums=[1,3,4,2,2]", output: "2", explanation: "2 appears twice." }],
    difficulty: "Medium", tags: ["Floyd's cycle detection", "binary search", "arrays"], year: 2024, platform: "Codility",
  },

  {
    company: "Adobe", section: "OA",
    title: "Median of Two Sorted Arrays",
    slug: "adobe-median-two-sorted-arrays",
    question: "Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays combined. The overall run time complexity should be O(log(m+n)).",
    functionSignature: "findMedianSortedArrays(int[] nums1, int[] nums2): double",
    constraints: ["0 ≤ m, n ≤ 1000", "-10⁶ ≤ nums1[i], nums2[j] ≤ 10⁶"],
    examples: [{ input: "nums1=[1,3], nums2=[2]", output: "2.00000", explanation: "Merged: [1,2,3], median = 2." }],
    difficulty: "Hard", tags: ["binary search", "divide and conquer", "arrays"], year: 2024, platform: "Codility",
  },

  {
    company: "Adobe", section: "OA",
    title: "Paint House II",
    slug: "adobe-paint-house-ii",
    question: "There are n houses in a row, each must be painted with one of k colors. The cost of painting house i with color j is costs[i][j]. No two adjacent houses can have the same color. Find the minimum cost to paint all houses.",
    functionSignature: "minCostII(int[][] costs): int",
    constraints: ["costs.length == n", "costs[i].length == k", "1 ≤ n ≤ 100", "2 ≤ k ≤ 20", "1 ≤ costs[i][j] ≤ 20"],
    examples: [{ input: "costs=[[1,5,3],[2,9,4]]", output: "5", explanation: "Paint house 0 color 0 (cost 1), house 1 color 2 (cost 4). Total = 5." }],
    difficulty: "Hard", tags: ["dynamic programming", "arrays"], year: 2023, platform: "Codility",
  },

  {
    company: "Adobe", section: "OA",
    title: "Count of Smaller Numbers After Self",
    slug: "adobe-count-smaller-after-self",
    question: "Given an integer array nums, return an integer array counts where counts[i] is the number of smaller elements to the right of nums[i].",
    functionSignature: "countSmaller(int[] nums): List<Integer>",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    examples: [{ input: "nums=[5,2,6,1]", output: "[2,1,1,0]", explanation: "5 has [2,1] smaller to its right; 2 has [1]; 6 has [1]; 1 has []." }],
    difficulty: "Hard", tags: ["merge sort", "BIT/Fenwick tree", "divide and conquer"], year: 2023, platform: "Codility",
  },

  // ═══════════════════════════════════════════════════════════
  //  GOLDMAN SACHS
  // ═══════════════════════════════════════════════════════════

  {
    company: "Goldman Sachs", section: "OA",
    title: "Gold Mine Problem",
    slug: "goldman-gold-mine",
    question: "Given a gold mine of m×n cells, each cell has a positive integer representing gold. A miner starts at any cell in the first column and can move to the right, right-up, or right-down at each step. Find the maximum gold collected.",
    functionSignature: "getMaxGold(int[][] mine): int",
    constraints: ["1 ≤ m, n ≤ 50", "1 ≤ mine[i][j] ≤ 100"],
    examples: [{ input: "mine=[[1,3,3],[2,1,4],[0,6,4]]", output: "12", explanation: "Path: 2→6→4 = 12." }],
    difficulty: "Medium", tags: ["dynamic programming", "matrix"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Goldman Sachs", section: "OA",
    title: "Count Number of Hops",
    slug: "goldman-count-hops",
    question: "A frog can jump 1, 2, or 3 steps at a time. Count the total number of ways it can reach the nth step from 0. Return the result modulo 10⁹+7.",
    functionSignature: "countHops(int n): int",
    constraints: ["1 ≤ n ≤ 10⁵"],
    examples: [{ input: "n=4", output: "7", explanation: "Ways: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2, 1+3, 3+1." }],
    difficulty: "Easy", tags: ["dynamic programming", "tribonacci"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Goldman Sachs", section: "OA",
    title: "Maximum Profit with Cooldown",
    slug: "goldman-max-profit-cooldown",
    question: "You have an array prices where prices[i] is the stock price on day i. Find the maximum profit with as many buy/sell transactions as you like, but after selling you must wait one day (cooldown) before buying again.",
    functionSignature: "maxProfit(int[] prices): int",
    constraints: ["1 ≤ prices.length ≤ 5000", "0 ≤ prices[i] ≤ 1000"],
    examples: [{ input: "prices=[1,2,3,0,2]", output: "3", explanation: "Buy day 0, sell day 1 (+1). Cooldown day 2. Buy day 3, sell day 4 (+2). Total=3." }],
    difficulty: "Medium", tags: ["dynamic programming", "state machine"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Goldman Sachs", section: "OA",
    title: "Decode String",
    slug: "goldman-decode-string",
    question: "Given an encoded string, return its decoded string. The encoding rule is: k[encoded_string] means the encoded_string is repeated exactly k times.",
    functionSignature: "decodeString(String s): String",
    constraints: ["1 ≤ s.length ≤ 30", "s contains lowercase letters, digits, and square brackets", "k is guaranteed to be in [1, 300]"],
    examples: [{ input: 's="3[a2[c]]"', output: '"accaccacc"', explanation: '2[c]="cc", then 3[a+"cc"]="accaccacc".' }],
    difficulty: "Medium", tags: ["stack", "recursion", "strings"], year: 2023, platform: "HackerRank",
  },

  {
    company: "Goldman Sachs", section: "CS Fundamentals",
    title: "LRU Cache Design",
    slug: "goldman-lru-cache",
    question: "Design a data structure that follows the Least Recently Used (LRU) cache eviction policy. Implement get(key) and put(key, value) each in O(1) time.",
    functionSignature: "class LRUCache { LRUCache(int capacity); int get(int key); void put(int key, int value); }",
    constraints: ["1 ≤ capacity ≤ 3000", "0 ≤ key ≤ 10⁴", "0 ≤ value ≤ 10⁵", "At most 2×10⁵ calls to get and put"],
    examples: [{ input: "LRUCache(2); put(1,1); put(2,2); get(1)→1; put(3,3); get(2)→-1 (evicted)", output: "1, -1", explanation: "Capacity 2. After putting 3, key 2 (LRU) is evicted." }],
    difficulty: "Medium", tags: ["hash map", "doubly linked list", "design"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  MORGAN STANLEY
  // ═══════════════════════════════════════════════════════════

  {
    company: "Morgan Stanley", section: "OA",
    title: "Largest Rectangle in Histogram",
    slug: "morgan-largest-rectangle-histogram",
    question: "Given an array of integers heights representing the histogram's bar heights where each bar has a width of 1, return the area of the largest rectangle in the histogram.",
    functionSignature: "largestRectangleArea(int[] heights): int",
    constraints: ["1 ≤ heights.length ≤ 10⁵", "0 ≤ heights[i] ≤ 10⁴"],
    examples: [{ input: "heights=[2,1,5,6,2,3]", output: "10", explanation: "Rectangle of height 5, width 2 (bars index 2-3) = area 10." }],
    difficulty: "Hard", tags: ["stack", "monotonic stack", "arrays"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Morgan Stanley", section: "OA",
    title: "Maximum Profit — Multiple Transactions",
    slug: "morgan-max-profit-multiple",
    question: "Given an array prices of stock prices over time, find the maximum profit with at most 2 transactions (a transaction = buy then sell). You must sell before buying again.",
    functionSignature: "maxProfit(int[] prices): int",
    constraints: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁵"],
    examples: [{ input: "prices=[3,3,5,0,0,3,1,4]", output: "6", explanation: "Buy day 3 (price 0), sell day 5 (price 3), buy day 6 (price 1), sell day 7 (price 4). Profit = 3+3=6." }],
    difficulty: "Hard", tags: ["dynamic programming", "arrays"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Morgan Stanley", section: "OA",
    title: "Binary Tree Right Side View",
    slug: "morgan-binary-tree-right-view",
    question: "Given the root of a binary tree, return the values of the nodes you can see ordered from top to bottom when looking from the right side.",
    functionSignature: "rightSideView(TreeNode root): List<Integer>",
    constraints: ["Number of nodes: [0, 100]", "-100 ≤ Node.val ≤ 100"],
    examples: [{ input: "root=[1,2,3,null,5,null,4]", output: "[1,3,4]", explanation: "Rightmost node at each level: 1, 3, 4." }],
    difficulty: "Medium", tags: ["BFS", "DFS", "binary tree"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Morgan Stanley", section: "OA",
    title: "Minimum Number of Platforms",
    slug: "morgan-min-platforms",
    question: "Given arrival and departure times of trains at a station, find the minimum number of platforms required so no train waits.",
    functionSignature: "findPlatform(int[] arr, int[] dep, int n): int",
    constraints: ["1 ≤ n ≤ 10⁵", "1 ≤ arr[i] ≤ dep[i] ≤ 2359"],
    examples: [{ input: "arr=[900,940,950,1100,1500,1800], dep=[910,1200,1120,1130,1900,2000]", output: "3", explanation: "Three trains overlap at peak time." }],
    difficulty: "Medium", tags: ["sorting", "greedy", "interval scheduling"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  JP MORGAN
  // ═══════════════════════════════════════════════════════════

  {
    company: "JPMorgan", section: "OA",
    title: "ATM Cash Dispense",
    slug: "jpmorgan-atm-cash-dispense",
    question: "An ATM has denominations [500, 200, 100, 50, 20, 10]. Given an amount to dispense, return the minimum number of notes used, and the breakdown per denomination. Return -1 if the amount cannot be dispensed exactly.",
    functionSignature: "dispense(int amount): Map<Integer, Integer>",
    constraints: ["10 ≤ amount ≤ 10⁶", "amount is a multiple of 10"],
    examples: [{ input: "amount=1380", output: "{500:2, 200:1, 50:1, 20:1, 10:1}", explanation: "2×500 + 1×200 + 1×50 + 1×20 + 1×10 = 1380. Total 6 notes." }],
    difficulty: "Easy", tags: ["greedy", "coin change", "simulation"], year: 2024, platform: "HackerRank",
  },

  {
    company: "JPMorgan", section: "OA",
    title: "Valid Parentheses",
    slug: "jpmorgan-valid-parentheses",
    question: "Given a string s containing only '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of bracket and in correct order.",
    functionSignature: "isValid(String s): boolean",
    constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only"],
    examples: [{ input: 's="()[]{}"', output: "true" }, { input: 's="(]"', output: "false" }],
    difficulty: "Easy", tags: ["stack", "strings"], year: 2024, platform: "HackerRank",
  },

  {
    company: "JPMorgan", section: "OA",
    title: "Maximum Profit from Trades",
    slug: "jpmorgan-max-profit-trades",
    question: "A trading system has a log of buy/sell orders. Given prices array and integer k, find the maximum profit using at most k transactions. A transaction = one buy + one sell.",
    functionSignature: "maxProfit(int k, int[] prices): int",
    constraints: ["0 ≤ k ≤ 100", "0 ≤ prices.length ≤ 1000", "0 ≤ prices[i] ≤ 1000"],
    examples: [{ input: "k=2, prices=[2,4,1,7]", output: "8", explanation: "Buy at 2, sell at 4 (+2). Buy at 1, sell at 7 (+6). Total=8." }],
    difficulty: "Hard", tags: ["dynamic programming", "finance"], year: 2023, platform: "HackerRank",
  },

  {
    company: "JPMorgan", section: "CS Fundamentals",
    title: "Design Rate Limiter",
    slug: "jpmorgan-rate-limiter",
    question: "Design a rate limiter that allows at most N requests per second per user. Implement shouldAllow(userId, timestamp) which returns true if the request is within the limit, false otherwise. Use the sliding window algorithm.",
    functionSignature: "class RateLimiter { boolean shouldAllow(String userId, long timestamp); }",
    constraints: ["N = 100 requests/second", "Timestamps are in milliseconds", "Up to 10⁶ concurrent users"],
    examples: [{ input: "N=2, calls: shouldAllow('u1',1000)→true, shouldAllow('u1',1500)→true, shouldAllow('u1',1800)→false", output: "true, true, false", explanation: "Third call: 3 requests within 1 second window." }],
    difficulty: "Hard", tags: ["sliding window", "design", "system design"], year: 2024, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  FLIPKART
  // ═══════════════════════════════════════════════════════════

  {
    company: "Flipkart", section: "OA",
    title: "Largest Subarray with Zero Sum",
    slug: "flipkart-largest-subarray-zero-sum",
    question: "Given an array of integers (including negatives), find the length of the longest subarray whose sum is exactly 0.",
    functionSignature: "maxLen(int[] arr): int",
    constraints: ["1 ≤ n ≤ 10⁵", "-10³ ≤ arr[i] ≤ 10³"],
    examples: [{ input: "arr=[15,-2,2,-8,1,7,10,23]", output: "5", explanation: "Subarray [-2,2,-8,1,7] sums to 0 with length 5." }],
    difficulty: "Medium", tags: ["prefix sum", "hash map", "arrays"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Flipkart", section: "OA",
    title: "Maximum of All Subarrays of Size K",
    slug: "flipkart-max-sliding-window",
    question: "Given an array nums and integer k, return the maximum element of every contiguous subarray of size k (sliding window maximum).",
    functionSignature: "maxSlidingWindow(int[] nums, int k): int[]",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴", "1 ≤ k ≤ nums.length"],
    examples: [{ input: "nums=[1,3,-1,-3,5,3,6,7], k=3", output: "[3,3,5,5,6,7]", explanation: "Sliding window of size 3 over the array." }],
    difficulty: "Hard", tags: ["deque", "sliding window", "monotonic queue"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Flipkart", section: "OA",
    title: "Search in Rotated Sorted Array",
    slug: "flipkart-search-rotated-array",
    question: "Given a sorted array rotated at an unknown pivot index, and a target value, return the index of target. If not found, return -1. Must run in O(log n).",
    functionSignature: "search(int[] nums, int target): int",
    constraints: ["1 ≤ nums.length ≤ 5000", "-10⁴ ≤ nums[i], target ≤ 10⁴", "All values unique"],
    examples: [{ input: "nums=[4,5,6,7,0,1,2], target=0", output: "4", explanation: "Binary search adapted for rotation." }],
    difficulty: "Medium", tags: ["binary search", "arrays"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Flipkart", section: "OA",
    title: "Clone Graph",
    slug: "flipkart-clone-graph",
    question: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node contains a value and a list of its neighbors.",
    functionSignature: "cloneGraph(Node node): Node",
    constraints: ["Number of nodes: [0, 100]", "1 ≤ Node.val ≤ 100", "Node.val is unique", "No repeated edges, no self-loops"],
    examples: [{ input: "adjList=[[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]", explanation: "Return deep clone of the 4-node graph." }],
    difficulty: "Medium", tags: ["BFS", "DFS", "hash map", "graphs"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  UBER
  // ═══════════════════════════════════════════════════════════

  {
    company: "Uber", section: "OA",
    title: "Find the City with Fewest Reachable Neighbors",
    slug: "uber-city-fewest-neighbors",
    question: "There are n cities connected by some flights. Each flight [u,v,w] connects cities u and v with weight w. Find the city with the smallest number of cities reachable with cost ≤ distanceThreshold. If there are multiple, return the city with the greatest index.",
    functionSignature: "findTheCity(int n, int[][] edges, int distanceThreshold): int",
    constraints: ["2 ≤ n ≤ 100", "edges.length == number of edges", "1 ≤ distanceThreshold ≤ 10⁴"],
    examples: [{ input: "n=4, edges=[[0,1,3],[1,2,1],[1,3,4],[2,3,1]], distanceThreshold=4", output: "3", explanation: "City 3 reaches [1,2] = 2 cities. No city reaches fewer." }],
    difficulty: "Medium", tags: ["Floyd-Warshall", "Dijkstra", "graphs", "shortest path"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Uber", section: "OA",
    title: "Course Schedule II",
    slug: "uber-course-schedule-ii",
    question: "There are n courses labeled 0 to n-1. Some courses have prerequisites: [a, b] means you must take b before a. Return a valid ordering to take all courses, or an empty array if impossible (cycle exists).",
    functionSignature: "findOrder(int numCourses, int[][] prerequisites): int[]",
    constraints: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ numCourses*(numCourses-1)"],
    examples: [{ input: "numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]", output: "[0,2,1,3]", explanation: "Topological sort of the prerequisite graph." }],
    difficulty: "Medium", tags: ["topological sort", "BFS", "DFS", "directed acyclic graph"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Uber", section: "OA",
    title: "Evaluate Division",
    slug: "uber-evaluate-division",
    question: "Given equations (pairs of strings) and values (doubles), where equations[i] = [Ai, Bi] and values[i] = Ai/Bi, answer queries each of which asks the value of Cj/Dj. Return -1.0 if the answer does not exist.",
    functionSignature: "calcEquation(List<List<String>> equations, double[] values, List<List<String>> queries): double[]",
    constraints: ["1 ≤ equations.length ≤ 20", "0.0 < values[i] ≤ 20.0", "1 ≤ queries.length ≤ 20"],
    examples: [{ input: "equations=[[a,b],[b,c]], values=[2.0,3.0], queries=[[a,c],[b,a]]", output: "[6.0, 0.5]", explanation: "a/b=2, b/c=3 so a/c=6. b/a=0.5." }],
    difficulty: "Medium", tags: ["BFS", "DFS", "union find", "graphs", "weighted graph"], year: 2023, platform: "HackerRank",
  },

  {
    company: "Uber", section: "OA",
    title: "Minimum Cost to Connect All Points",
    slug: "uber-min-cost-connect-points",
    question: "Given an array of points representing coordinates on a 2D plane, find the minimum cost to connect all points. The cost between two points is the Manhattan distance |xi-xj|+|yi-yj|. All points must be connected (minimum spanning tree).",
    functionSignature: "minCostConnectPoints(int[][] points): int",
    constraints: ["1 ≤ points.length ≤ 1000", "-10⁶ ≤ xi, yi ≤ 10⁶", "All pairs distinct"],
    examples: [{ input: "points=[[0,0],[2,2],[3,10],[5,2],[7,0]]", output: "20", explanation: "Prim's or Kruskal's MST on Manhattan distance graph." }],
    difficulty: "Medium", tags: ["Prim's algorithm", "Kruskal's algorithm", "MST", "union find"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  WALMART LABS
  // ═══════════════════════════════════════════════════════════

  {
    company: "Walmart", section: "OA",
    title: "Maximum Sum Rectangle in 2D Matrix",
    slug: "walmart-max-sum-rectangle-2d",
    question: "Given a 2D matrix, find the submatrix that has the maximum sum. Return the maximum sum.",
    functionSignature: "maxSumRectangle(int[][] matrix): int",
    constraints: ["1 ≤ m, n ≤ 100", "-100 ≤ matrix[i][j] ≤ 100"],
    examples: [{ input: "matrix=[[1,2,-1,-4,-20],[-8,-3,4,2,1],[3,8,10,1,3],[-4,-1,1,7,-6]]", output: "29", explanation: "Submatrix [[4,2,1],[10,1,3],[1,7,-6]] has sum 29." }],
    difficulty: "Hard", tags: ["Kadane's algorithm", "dynamic programming", "matrix"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Walmart", section: "OA",
    title: "Minimum Swaps to Sort",
    slug: "walmart-minimum-swaps-sort",
    question: "Given an array of n distinct elements, find the minimum number of swaps required to sort the array in ascending order.",
    functionSignature: "minSwaps(int[] arr): int",
    constraints: ["1 ≤ n ≤ 10⁵", "1 ≤ arr[i] ≤ 10⁶", "All elements distinct"],
    examples: [{ input: "arr=[4,3,2,1]", output: "2", explanation: "Swap 4 and 1, then swap 3 and 2." }],
    difficulty: "Medium", tags: ["arrays", "sorting", "cycle detection"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Walmart", section: "OA",
    title: "Minimum Platforms Required",
    slug: "walmart-min-platforms",
    question: "Given arrival and departure times of trains, find the minimum number of platforms required at the railway station so that no train has to wait.",
    functionSignature: "minPlatforms(int[] arrival, int[] departure): int",
    constraints: ["1 ≤ n ≤ 10⁵", "1 ≤ arrival[i] < departure[i] ≤ 2359"],
    examples: [{ input: "arrival=[900,940,950], departure=[910,1200,1120]", output: "2", explanation: "Two trains overlap between 950 and 910." }],
    difficulty: "Medium", tags: ["sorting", "greedy", "intervals"], year: 2024, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  SALESFORCE
  // ═══════════════════════════════════════════════════════════

  {
    company: "Salesforce", section: "OA",
    title: "Design HashMap",
    slug: "salesforce-design-hashmap",
    question: "Design a HashMap without using any built-in hash table libraries. Implement put(key, value), get(key), and remove(key). All keys and values are non-negative integers.",
    functionSignature: "class MyHashMap { void put(int key, int val); int get(int key); void remove(int key); }",
    constraints: ["0 ≤ key, value ≤ 10⁶", "At most 10⁴ calls to put, get, remove"],
    examples: [{ input: "put(1,1); put(2,2); get(1)→1; get(3)→-1; put(2,1); get(2)→1; remove(2); get(2)→-1", output: "1, -1, 1, -1", explanation: "Correct HashMap behavior with chaining or open addressing." }],
    difficulty: "Easy", tags: ["design", "hash table", "linked list"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Salesforce", section: "OA",
    title: "Word Search in Grid",
    slug: "salesforce-word-search-grid",
    question: "Given an m×n board of characters and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically), and the same cell cannot be used more than once.",
    functionSignature: "exist(char[][] board, String word): boolean",
    constraints: ["1 ≤ m, n ≤ 6", "1 ≤ word.length ≤ 15", "board and word consist of only lowercase and uppercase English letters"],
    examples: [{ input: 'board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCCED"', output: "true", explanation: "Path exists following grid adjacency." }],
    difficulty: "Medium", tags: ["backtracking", "DFS", "matrix"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Salesforce", section: "OA",
    title: "LFU Cache",
    slug: "salesforce-lfu-cache",
    question: "Design and implement a Least Frequently Used (LFU) cache with get(key) and put(key, value) in O(1). When the cache reaches capacity, evict the key with the lowest frequency. If there is a tie, evict the least recently used among them.",
    functionSignature: "class LFUCache { LFUCache(int capacity); int get(int key); void put(int key, int value); }",
    constraints: ["0 ≤ capacity ≤ 10⁴", "0 ≤ key ≤ 10⁵", "0 ≤ value ≤ 10⁹", "At most 2×10⁵ calls"],
    examples: [{ input: "cap=2; put(1,1); put(2,2); get(1)→1; put(3,3); get(2)→-1 (evicted)", output: "1, -1", explanation: "Key 2 had frequency 1, key 1 had frequency 2 after get. So 2 was evicted." }],
    difficulty: "Hard", tags: ["design", "hash map", "doubly linked list", "frequency count"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  SAMSUNG
  // ═══════════════════════════════════════════════════════════

  {
    company: "Samsung", section: "OA",
    title: "Moving Target BFS",
    slug: "samsung-moving-target-bfs",
    question: "On an N×N grid, a player starts at position (r,c). A target moves to an adjacent cell every second. Find the minimum time for the player to catch the target if both move optimally — player tries to minimize, target tries to maximize the time. Both can move in 4 directions or stay still.",
    functionSignature: "minTimeToCatch(int N, int pr, int pc, int tr, int tc): int",
    constraints: ["3 ≤ N ≤ 10", "Grid positions within bounds", "Player and target start at different positions"],
    examples: [{ input: "N=5, player=(0,0), target=(4,4)", output: "8", explanation: "Optimal BFS with game-theoretic pursuit." }],
    difficulty: "Hard", tags: ["BFS", "game theory", "2D grid", "simulation"], year: 2024, platform: "Samsung Online",
  },

  {
    company: "Samsung", section: "OA",
    title: "Find Peak Element",
    slug: "samsung-find-peak-element",
    question: "A peak element is an element that is strictly greater than its neighbors. Given an integer array nums, find a peak element and return its index. If the array contains multiple peaks, return the index of any peak. Must run in O(log n).",
    functionSignature: "findPeakElement(int[] nums): int",
    constraints: ["1 ≤ nums.length ≤ 1000", "-2³¹ ≤ nums[i] ≤ 2³¹-1", "nums[-1] = nums[n] = -∞"],
    examples: [{ input: "nums=[1,2,3,1]", output: "2", explanation: "nums[2]=3 is a peak (3>2 and 3>1)." }],
    difficulty: "Medium", tags: ["binary search", "arrays"], year: 2024, platform: "Samsung Online",
  },

  {
    company: "Samsung", section: "OA",
    title: "Rotate 2D Matrix",
    slug: "samsung-rotate-matrix",
    question: "Given an n×n 2D matrix representing an image, rotate the image 90 degrees clockwise in-place.",
    functionSignature: "rotate(int[][] matrix): void",
    constraints: ["n == matrix.length == matrix[i].length", "1 ≤ n ≤ 20", "-1000 ≤ matrix[i][j] ≤ 1000"],
    examples: [{ input: "matrix=[[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]", explanation: "Transpose then reverse each row." }],
    difficulty: "Medium", tags: ["matrix", "math", "in-place"], year: 2023, platform: "Samsung Online",
  },

  // ═══════════════════════════════════════════════════════════
  //  ORACLE
  // ═══════════════════════════════════════════════════════════

  {
    company: "Oracle", section: "OA",
    title: "Employees Earning More Than Managers",
    slug: "oracle-employees-more-than-managers",
    question: "Given the Employee table with columns Id, Name, Salary, ManagerId — write a SQL query to find employees who earn more than their managers.",
    functionSignature: "SELECT e.Name AS Employee FROM Employee e JOIN Employee m ON e.ManagerId = m.Id WHERE e.Salary > m.Salary",
    constraints: ["Table: Employee(Id INT, Name VARCHAR, Salary INT, ManagerId INT)"],
    examples: [{ input: "Id=1,Name=Joe,Salary=70000,ManagerId=3 | Id=3,Name=Sam,Salary=60000,ManagerId=null", output: "Joe", explanation: "Joe earns 70000 > Sam (manager) earns 60000." }],
    difficulty: "Easy", tags: ["SQL", "self join", "database"], year: 2024, platform: "Oracle OA",
  },

  {
    company: "Oracle", section: "OA",
    title: "Rank Scores",
    slug: "oracle-rank-scores",
    question: "Write a SQL query to rank scores in the Scores table. If two scores are tied, both should have the same rank. After a tie, the next rank number should be the next consecutive integer (dense rank).",
    functionSignature: "SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS rank FROM Scores",
    constraints: ["Table: Scores(Id INT, Score DECIMAL(3,2))"],
    examples: [{ input: "Scores: [(1,3.50),(2,3.65),(3,4.00),(4,3.85),(5,4.00),(6,3.65)]", output: "4.00→1, 4.00→1, 3.85→2, 3.65→3, 3.65→3, 3.50→4", explanation: "Dense rank: no gaps after ties." }],
    difficulty: "Medium", tags: ["SQL", "window functions", "ranking"], year: 2024, platform: "Oracle OA",
  },

  {
    company: "Oracle", section: "OA",
    title: "Serialize and Deserialize Binary Tree",
    slug: "oracle-serialize-deserialize-tree",
    question: "Design an algorithm to serialize and deserialize a binary tree. serialize(root) converts the tree to a string, deserialize(data) reconstructs the original tree.",
    functionSignature: "class Codec { String serialize(TreeNode root); TreeNode deserialize(String data); }",
    constraints: ["Number of nodes: [0, 10⁴]", "-1000 ≤ Node.val ≤ 1000"],
    examples: [{ input: "root=[1,2,3,null,null,4,5]", output: "Serialize then deserialize returns original tree", explanation: "BFS or DFS encoding with null markers." }],
    difficulty: "Hard", tags: ["BFS", "DFS", "binary tree", "design", "string"], year: 2023, platform: "Oracle OA",
  },

  // ═══════════════════════════════════════════════════════════
  //  INTUIT
  // ═══════════════════════════════════════════════════════════

  {
    company: "Intuit", section: "OA",
    title: "House Robber II",
    slug: "intuit-house-robber-ii",
    question: "Houses are arranged in a circle — the first and last are adjacent. You can't rob two adjacent houses. Given an integer array nums representing amounts, return the maximum amount you can rob tonight.",
    functionSignature: "rob(int[] nums): int",
    constraints: ["1 ≤ nums.length ≤ 100", "0 ≤ nums[i] ≤ 1000"],
    examples: [{ input: "nums=[2,3,2]", output: "3", explanation: "Rob house 2 (amount 3). Can't rob houses 1 and 3 with that." }],
    difficulty: "Medium", tags: ["dynamic programming", "arrays"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Intuit", section: "OA",
    title: "Maximum Product Subarray",
    slug: "intuit-max-product-subarray",
    question: "Given an integer array nums, find a contiguous non-empty subarray that has the largest product, and return the product.",
    functionSignature: "maxProduct(int[] nums): int",
    constraints: ["1 ≤ nums.length ≤ 2×10⁴", "-10 ≤ nums[i] ≤ 10", "The product of any prefix or suffix fits in a 32-bit integer"],
    examples: [{ input: "nums=[2,3,-2,4]", output: "6", explanation: "Subarray [2,3] has largest product 6." }],
    difficulty: "Medium", tags: ["dynamic programming", "arrays"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Intuit", section: "OA",
    title: "Combination Sum",
    slug: "intuit-combination-sum",
    question: "Given an array of distinct integers candidates and a target integer target, return all unique combinations of candidates where the chosen numbers sum to target. Numbers from candidates may be used unlimited times.",
    functionSignature: "combinationSum(int[] candidates, int target): List<List<Integer>>",
    constraints: ["1 ≤ candidates.length ≤ 30", "2 ≤ candidates[i] ≤ 40", "1 ≤ target ≤ 40"],
    examples: [{ input: "candidates=[2,3,6,7], target=7", output: "[[2,2,3],[7]]", explanation: "2+2+3=7 and 7=7." }],
    difficulty: "Medium", tags: ["backtracking", "recursion", "arrays"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  ATLASSIAN
  // ═══════════════════════════════════════════════════════════

  {
    company: "Atlassian", section: "OA",
    title: "Minimum Window Substring",
    slug: "atlassian-minimum-window-substring",
    question: "Given strings s and t, return the minimum window substring of s that contains every character in t (including duplicates). If no such window exists, return an empty string.",
    functionSignature: "minWindow(String s, String t): String",
    constraints: ["1 ≤ s.length, t.length ≤ 10⁵", "s and t consist of uppercase and lowercase English letters"],
    examples: [{ input: 's="ADOBECODEBANC", t="ABC"', output: '"BANC"', explanation: 'Minimum window containing A, B, C is "BANC".' }],
    difficulty: "Hard", tags: ["sliding window", "hash map", "two pointers"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Atlassian", section: "OA",
    title: "Design URL Shortener",
    slug: "atlassian-design-url-shortener",
    question: "Design a URL shortening service (like bit.ly). Implement encode(longUrl) which returns a shortened URL and decode(shortUrl) which returns the original URL. The algorithm must use base62 encoding.",
    functionSignature: "class Codec { String encode(String longUrl); String decode(String shortUrl); }",
    constraints: ["Any valid URL is acceptable", "Up to 10⁶ URLs stored", "Short URL must be at most 7 characters (base62 of counter)"],
    examples: [{ input: 'encode("https://leetcode.com/problems/design-tinyurl")', output: '"http://tinyurl.com/4e9iAk"', explanation: "Base62 encode of auto-increment counter." }],
    difficulty: "Medium", tags: ["design", "hash map", "encoding", "system design"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Atlassian", section: "OA",
    title: "Jump Game II",
    slug: "atlassian-jump-game-ii",
    question: "Given a 0-indexed array nums where nums[i] is the maximum jump length from position i, return the minimum number of jumps to reach nums[n-1]. It is guaranteed the answer exists.",
    functionSignature: "jump(int[] nums): int",
    constraints: ["1 ≤ nums.length ≤ 10⁴", "0 ≤ nums[i] ≤ 1000"],
    examples: [{ input: "nums=[2,3,1,1,4]", output: "2", explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last." }],
    difficulty: "Medium", tags: ["greedy", "BFS", "dynamic programming"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  NUTANIX
  // ═══════════════════════════════════════════════════════════

  {
    company: "Nutanix", section: "OA",
    title: "Find Median from Data Stream",
    slug: "nutanix-median-data-stream",
    question: "Design a data structure that supports adding integers and finding the median of the current data stream. Implement addNum(int num) and findMedian() in O(log n) and O(1) respectively.",
    functionSignature: "class MedianFinder { void addNum(int num); double findMedian(); }",
    constraints: ["-10⁵ ≤ num ≤ 10⁵", "At most 5×10⁴ calls to addNum and findMedian", "findMedian is called at least once"],
    examples: [{ input: "addNum(1); addNum(2); findMedian()→1.5; addNum(3); findMedian()→2.0", output: "1.5, 2.0", explanation: "Use max-heap + min-heap to maintain balance." }],
    difficulty: "Hard", tags: ["two heaps", "design", "sorting"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Nutanix", section: "OA",
    title: "Alien Dictionary",
    slug: "nutanix-alien-dictionary",
    question: "Given a list of strings words sorted lexicographically by the rules of a new alien language, derive the order of letters in this language. Return the characters in the alien language order, or empty string if no valid order exists.",
    functionSignature: "alienOrder(String[] words): String",
    constraints: ["1 ≤ words.length ≤ 100", "1 ≤ words[i].length ≤ 100", "words[i] consists of lowercase English letters"],
    examples: [{ input: 'words=["wrt","wrf","er","ett","rftt"]', output: '"wertf"', explanation: "Topological sort of derived character ordering constraints." }],
    difficulty: "Hard", tags: ["topological sort", "BFS", "DFS", "graphs"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Nutanix", section: "OA",
    title: "Max Consecutive Ones III",
    slug: "nutanix-max-consecutive-ones-iii",
    question: "Given a binary array nums and integer k, return the maximum number of consecutive 1s after flipping at most k 0s to 1s.",
    functionSignature: "longestOnes(int[] nums, int k): int",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "nums[i] is 0 or 1", "0 ≤ k ≤ nums.length"],
    examples: [{ input: "nums=[1,1,1,0,0,0,1,1,1,1,0], k=2", output: "6", explanation: "Flip positions 5 and 10 (or similar). Window [0,0,1,1,1,1] = 6 ones." }],
    difficulty: "Medium", tags: ["sliding window", "binary array", "two pointers"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  SPRINKLR
  // ═══════════════════════════════════════════════════════════

  {
    company: "Sprinklr", section: "OA",
    title: "LRU Cache Implementation",
    slug: "sprinklr-lru-cache",
    question: "Implement an LRU (Least Recently Used) Cache with O(1) get and put. The cache has a fixed capacity. When full, evict the least recently used item before inserting a new one.",
    functionSignature: "class LRUCache { LRUCache(int cap); int get(int key); void put(int key, int val); }",
    constraints: ["1 ≤ capacity ≤ 3000", "0 ≤ key ≤ 10⁴", "At most 2×10⁵ calls"],
    examples: [{ input: "cap=2; put(1,1); put(2,2); get(1)→1; put(3,3) evicts key 2; get(2)→-1", output: "1, -1", explanation: "After get(1), key 1 becomes most recent. Key 2 is LRU when 3 is inserted." }],
    difficulty: "Medium", tags: ["design", "hash map", "doubly linked list"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Sprinklr", section: "OA",
    title: "All Anagrams in String",
    slug: "sprinklr-all-anagrams-string",
    question: "Given strings s and p, return an array of all start indices of p's anagrams in s. Characters in p can be in any order within the window.",
    functionSignature: "findAnagrams(String s, String p): List<Integer>",
    constraints: ["1 ≤ s.length, p.length ≤ 3×10⁴", "s and p consist of lowercase English letters"],
    examples: [{ input: 's="cbaebabacd", p="abc"', output: "[0,6]", explanation: "Anagram at index 0: cba; at index 6: bac." }],
    difficulty: "Medium", tags: ["sliding window", "hash map", "strings"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Sprinklr", section: "OA",
    title: "Group Anagrams",
    slug: "sprinklr-group-anagrams",
    question: "Given an array of strings strs, group the anagrams together. Return the groups in any order.",
    functionSignature: "groupAnagrams(String[] strs): List<List<String>>",
    constraints: ["1 ≤ strs.length ≤ 10⁴", "0 ≤ strs[i].length ≤ 100", "strs[i] consists of lowercase English letters"],
    examples: [{ input: 'strs=["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: "Sort each string as a key, group by key." }],
    difficulty: "Medium", tags: ["hash map", "strings", "sorting"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  DE SHAW
  // ═══════════════════════════════════════════════════════════

  {
    company: "DE Shaw", section: "OA",
    title: "Count Inversions in Array",
    slug: "deshaw-count-inversions",
    question: "Given an array of N integers, count the number of inversions — pairs (i,j) where i<j and arr[i]>arr[j]. Return the count modulo 10⁹+7.",
    functionSignature: "countInversions(int[] arr): long",
    constraints: ["1 ≤ N ≤ 5×10⁵", "1 ≤ arr[i] ≤ 10⁹"],
    examples: [{ input: "arr=[2,4,1,3,5]", output: "3", explanation: "Inversions: (2,1),(4,1),(4,3)." }],
    difficulty: "Hard", tags: ["merge sort", "BIT/Fenwick tree", "divide and conquer"], year: 2024, platform: "HackerRank",
  },

  {
    company: "DE Shaw", section: "OA",
    title: "Median in Data Stream (Sliding Window)",
    slug: "deshaw-sliding-window-median",
    question: "Given an integer array nums and integer k, there is a sliding window of size k moving from left to right. Return the median array for each window position.",
    functionSignature: "medianSlidingWindow(int[] nums, int k): double[]",
    constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵", "-2³¹ ≤ nums[i] ≤ 2³¹-1"],
    examples: [{ input: "nums=[1,3,-1,-3,5,3,6,7], k=3", output: "[1.0,-1.0,-1.0,3.0,5.0,6.0]", explanation: "Median of each window of size 3." }],
    difficulty: "Hard", tags: ["sliding window", "heap", "ordered set"], year: 2024, platform: "HackerRank",
  },

  {
    company: "DE Shaw", section: "OA",
    title: "Minimum Number of Arrows to Burst Balloons",
    slug: "deshaw-arrows-burst-balloons",
    question: "Balloons are fixed to the wall. Each balloon spans [xstart, xend]. An arrow shot vertically at x bursts all balloons where xstart ≤ x ≤ xend. Return the minimum number of arrows needed to burst all balloons.",
    functionSignature: "findMinArrowShots(int[][] points): int",
    constraints: ["1 ≤ points.length ≤ 10⁵", "points[i].length == 2", "-2³¹ ≤ xstart ≤ xend ≤ 2³¹-1"],
    examples: [{ input: "points=[[10,16],[2,8],[1,6],[7,12]]", output: "2", explanation: "Shoot at x=6 (bursts 2,8 and 1,6), at x=11 (bursts 10,16 and 7,12)." }],
    difficulty: "Medium", tags: ["greedy", "sorting", "intervals"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  TOWER RESEARCH CAPITAL
  // ═══════════════════════════════════════════════════════════

  {
    company: "Tower Research", section: "OA",
    title: "Order Book Matching Engine",
    slug: "tower-order-book-matching",
    question: "Simulate a simplified stock order book. Process a sequence of orders (buy/sell with price and quantity). A buy and sell match when buy_price ≥ sell_price. Execute the trade at the sell price, reducing quantities. Return the list of executed trades as (price, qty) pairs.",
    functionSignature: "processOrders(String[] orders): List<int[]>  // orders format: 'B price qty' or 'S price qty'",
    constraints: ["1 ≤ orders.length ≤ 10⁴", "1 ≤ price ≤ 10⁶", "1 ≤ qty ≤ 10⁴"],
    examples: [{ input: "orders=['B 100 10','B 101 5','S 99 8','S 102 3']", output: "[(99,8),(99,5)]", explanation: "Sell at 99 matches first buy bid at 101 (8 units), then 100 (5 units left from bid=101 is 2, so sell 5 from bid=100)." }],
    difficulty: "Hard", tags: ["heap", "priority queue", "simulation", "design"], year: 2024, platform: "Tower OA",
  },

  {
    company: "Tower Research", section: "OA",
    title: "Sliding Window Maximum",
    slug: "tower-sliding-window-maximum",
    question: "Given an array of integers and a window of size k, find the maximum element in each sliding window position. Optimize to O(n) using a monotonic deque.",
    functionSignature: "maxSlidingWindow(int[] nums, int k): int[]",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴", "1 ≤ k ≤ nums.length"],
    examples: [{ input: "nums=[1,3,-1,-3,5,3,6,7], k=3", output: "[3,3,5,5,6,7]", explanation: "Monotonic deque maintains indices of candidates for maximum." }],
    difficulty: "Hard", tags: ["deque", "monotonic deque", "sliding window"], year: 2024, platform: "Tower OA",
  },

  {
    company: "Tower Research", section: "OA",
    title: "Jump Game IV",
    slug: "tower-jump-game-iv",
    question: "Given an array of integers arr, you start at index 0. In one step you can go to index i+1, i-1, or any j such that arr[i] == arr[j]. Return the minimum number of steps to reach the last index.",
    functionSignature: "minJumps(int[] arr): int",
    constraints: ["1 ≤ arr.length ≤ 5×10⁴", "-10⁸ ≤ arr[i] ≤ 10⁸"],
    examples: [{ input: "arr=[100,-23,-23,404,100,23,23,23,3,404]", output: "3", explanation: "0→4 (same value 100)→5→9 (same value 404). 3 jumps." }],
    difficulty: "Hard", tags: ["BFS", "hash map", "graphs"], year: 2023, platform: "Tower OA",
  },

  // ═══════════════════════════════════════════════════════════
  //  SHARECHAT
  // ═══════════════════════════════════════════════════════════

  {
    company: "ShareChat", section: "OA",
    title: "Shortest Path in Weighted Graph",
    slug: "sharechat-shortest-path-weighted",
    question: "Given a directed weighted graph with n nodes and edges, find the shortest path from source src to all other nodes (Dijkstra's algorithm). Return an array dist[] of shortest distances. Return -1 for unreachable nodes.",
    functionSignature: "dijkstra(int n, int[][] edges, int src): int[]",
    constraints: ["1 ≤ n ≤ 10⁴", "1 ≤ edges.length ≤ 10⁵", "1 ≤ weight ≤ 10⁴"],
    examples: [{ input: "n=5, edges=[[0,1,4],[0,2,2],[1,3,5],[2,1,1],[2,3,8],[3,4,2]], src=0", output: "[0,3,2,8,10]", explanation: "Shortest paths from 0 to all nodes using Dijkstra." }],
    difficulty: "Medium", tags: ["Dijkstra", "priority queue", "graphs", "shortest path"], year: 2024, platform: "HackerRank",
  },

  {
    company: "ShareChat", section: "OA",
    title: "Copy List with Random Pointer",
    slug: "sharechat-copy-list-random",
    question: "A linked list where each node has a next pointer and a random pointer that can point to any node or null. Return a deep copy of the list in O(n) time and O(1) space.",
    functionSignature: "copyRandomList(Node head): Node",
    constraints: ["0 ≤ n ≤ 1000", "-10⁴ ≤ Node.val ≤ 10⁴", "Node.random is null or points to some node"],
    examples: [{ input: "head=[[7,null],[13,0],[11,4],[10,2],[1,0]]", output: "Deep copy of the list", explanation: "Clone nodes, weave copies in, extract cloned list." }],
    difficulty: "Medium", tags: ["linked list", "hash map", "in-place"], year: 2024, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  MEESHO
  // ═══════════════════════════════════════════════════════════

  {
    company: "Meesho", section: "OA",
    title: "Product of Array Except Self",
    slug: "meesho-product-except-self",
    question: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i]. Solve in O(n) without using division.",
    functionSignature: "productExceptSelf(int[] nums): int[]",
    constraints: ["2 ≤ nums.length ≤ 10⁵", "-30 ≤ nums[i] ≤ 30", "Product fits in a 32-bit integer"],
    examples: [{ input: "nums=[1,2,3,4]", output: "[24,12,8,6]", explanation: "Left pass × Right pass gives each element's product-except-self." }],
    difficulty: "Medium", tags: ["prefix product", "arrays"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Meesho", section: "OA",
    title: "Longest Palindromic Substring",
    slug: "meesho-longest-palindromic-substring",
    question: "Given a string s, return the longest palindromic substring in s.",
    functionSignature: "longestPalindrome(String s): String",
    constraints: ["1 ≤ s.length ≤ 1000", "s consists of only digits and English letters"],
    examples: [{ input: 's="babad"', output: '"bab"', explanation: '"aba" is also valid. Expand around center approach.' }],
    difficulty: "Medium", tags: ["dynamic programming", "expand around center", "Manacher's algorithm"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Meesho", section: "OA",
    title: "3Sum",
    slug: "meesho-three-sum",
    question: "Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i≠j≠k≠i and nums[i]+nums[j]+nums[k]=0. The solution set must not contain duplicate triplets.",
    functionSignature: "threeSum(int[] nums): List<List<Integer>>",
    constraints: ["3 ≤ nums.length ≤ 3000", "-10⁵ ≤ nums[i] ≤ 10⁵"],
    examples: [{ input: "nums=[-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "Sort + two pointers. Skip duplicates." }],
    difficulty: "Medium", tags: ["two pointers", "sorting", "arrays"], year: 2024, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  ZOMATO
  // ═══════════════════════════════════════════════════════════

  {
    company: "Zomato", section: "OA",
    title: "Find Nearest Restaurants (K Closest Points)",
    slug: "zomato-nearest-restaurants",
    question: "Zomato needs to find the k nearest restaurants to a user location. Given an array of restaurant coordinates and a user location, return the k closest restaurants by Euclidean distance.",
    functionSignature: "kClosestRestaurants(int[][] restaurants, int[] user, int k): int[][]",
    constraints: ["1 ≤ k ≤ restaurants.length ≤ 10⁴", "-10⁴ ≤ coordinates ≤ 10⁴"],
    examples: [{ input: "restaurants=[[1,2],[3,4],[5,6]], user=[0,0], k=2", output: "[[1,2],[3,4]]", explanation: "√5 < √25 < √61. Closest 2 are [1,2] and [3,4]." }],
    difficulty: "Medium", tags: ["heap", "sorting", "geometry"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Zomato", section: "OA",
    title: "Maximum Distance in Arrays",
    slug: "zomato-max-distance-arrays",
    question: "You have m arrays sorted in increasing order. Pick one integer from each of two different arrays and maximize the absolute difference. Return the maximum absolute difference.",
    functionSignature: "maxDistance(List<List<Integer>> arrays): int",
    constraints: ["2 ≤ m ≤ 10⁵", "1 ≤ arrays[i].length ≤ 500", "-10⁴ ≤ arrays[i][j] ≤ 10⁴"],
    examples: [{ input: "arrays=[[1,2,3],[4,5],[1,2,3]]", output: "4", explanation: "max(|1-5|, |3-4|) = 4. Take 1 from array 0 and 5 from array 1." }],
    difficulty: "Medium", tags: ["arrays", "greedy"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Zomato", section: "OA",
    title: "Minimum Cost Path (Delivery Routing)",
    slug: "zomato-minimum-cost-path",
    question: "A delivery agent starts at (0,0) in an m×n grid and must reach (m-1,n-1). Each cell has a movement cost. The agent can move right, down, left, or up. Find the path with minimum total cost.",
    functionSignature: "minCostPath(int[][] grid): int",
    constraints: ["1 ≤ m, n ≤ 100", "0 ≤ grid[i][j] ≤ 1000"],
    examples: [{ input: "grid=[[1,3,1],[1,5,1],[4,2,1]]", output: "7", explanation: "Path 1→3→1→1→1 = 7." }],
    difficulty: "Medium", tags: ["dynamic programming", "Dijkstra", "BFS"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  CISCO
  // ═══════════════════════════════════════════════════════════

  {
    company: "Cisco", section: "OA",
    title: "Network Delay Time",
    slug: "cisco-network-delay-time",
    question: "There are n nodes in a network. Given a list of directed edges times[i] = [ui, vi, wi] where wi is the travel time from ui to vi, a signal starts from node k. Return the minimum time for all nodes to receive the signal. Return -1 if not all nodes can be reached.",
    functionSignature: "networkDelayTime(int[][] times, int n, int k): int",
    constraints: ["1 ≤ k ≤ n ≤ 100", "1 ≤ times.length ≤ 6000", "1 ≤ wi ≤ 100"],
    examples: [{ input: "times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2", output: "2", explanation: "Node 2→1 takes 1, 2→3→4 takes 2. All nodes receive in max 2 units." }],
    difficulty: "Medium", tags: ["Dijkstra", "Bellman-Ford", "graphs", "shortest path"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Cisco", section: "OA",
    title: "Redundant Connection",
    slug: "cisco-redundant-connection",
    question: "A tree of n nodes (1 to n) has one extra edge added. The graph has n nodes and n edges. Find and return the edge that is redundant — removing it leaves a valid tree.",
    functionSignature: "findRedundantConnection(int[][] edges): int[]",
    constraints: ["n == edges.length", "3 ≤ n ≤ 1000", "edges[i].length == 2", "1 ≤ ai < bi ≤ n", "All pairs are distinct"],
    examples: [{ input: "edges=[[1,2],[1,3],[2,3]]", output: "[2,3]", explanation: "Removing [2,3] leaves a valid tree [1-2, 1-3]." }],
    difficulty: "Medium", tags: ["union find", "DFS", "graphs"], year: 2024, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  QUALCOMM
  // ═══════════════════════════════════════════════════════════

  {
    company: "Qualcomm", section: "OA",
    title: "Single Number III (Bit Manipulation)",
    slug: "qualcomm-single-number-iii",
    question: "Given an integer array nums where exactly two elements appear only once and all other elements appear exactly twice, find the two elements that appear only once. Must use O(1) extra space.",
    functionSignature: "singleNumber(int[] nums): int[]",
    constraints: ["2 ≤ nums.length ≤ 3×10⁴", "-2³¹ ≤ nums[i] ≤ 2³¹-1", "Exactly two elements appear once"],
    examples: [{ input: "nums=[1,2,1,3,2,5]", output: "[3,5]", explanation: "XOR all elements to get 3^5. Use lowest set bit to separate the two groups." }],
    difficulty: "Medium", tags: ["bit manipulation", "XOR", "arrays"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Qualcomm", section: "OA",
    title: "Shortest Path in Binary Matrix",
    slug: "qualcomm-shortest-path-binary-matrix",
    question: "Given an n×n binary matrix grid, return the length of the shortest clear path from top-left (0,0) to bottom-right (n-1,n-1). A clear path has all 0s and moves in 8 directions. Return -1 if no path exists.",
    functionSignature: "shortestPathBinaryMatrix(int[][] grid): int",
    constraints: ["n == grid.length == grid[i].length", "1 ≤ n ≤ 100", "grid[i][j] is 0 or 1"],
    examples: [{ input: "grid=[[0,1],[1,0]]", output: "2", explanation: "Path (0,0)→(1,1) diagonally. Length = 2." }],
    difficulty: "Medium", tags: ["BFS", "matrix", "shortest path"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Qualcomm", section: "OA",
    title: "Reverse Bits",
    slug: "qualcomm-reverse-bits",
    question: "Reverse the bits of a given 32-bit unsigned integer and return the result. This is a fundamental embedded-systems / DSP problem.",
    functionSignature: "reverseBits(int n): int",
    constraints: ["Input is a 32-bit unsigned integer"],
    examples: [{ input: "n=00000010100101000001111010011100 (binary)", output: "00111001011110000010100101000000 → 964176192", explanation: "Reverse all 32 bits." }],
    difficulty: "Easy", tags: ["bit manipulation", "divide and conquer"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  GRAVITON RESEARCH
  // ═══════════════════════════════════════════════════════════

  {
    company: "Graviton", section: "OA",
    title: "Minimum Cost to Reach Destination",
    slug: "graviton-min-cost-destination",
    question: "Given a weighted directed graph with n nodes, find the minimum cost path from node 0 to node n-1 using at most k stops. Return -1 if no such route exists. (Bellman-Ford with k iterations)",
    functionSignature: "findCheapestPrice(int n, int[][] flights, int src, int dst, int k): int",
    constraints: ["1 ≤ n ≤ 100", "0 ≤ flights.length ≤ n*(n-1)/2", "flights[i]=[from,to,price]", "0 ≤ k < n"],
    examples: [{ input: "n=4, flights=[[0,1,100],[1,2,100],[2,3,100],[0,2,500]], src=0, dst=3, k=1", output: "500", explanation: "0→2→3=500+100 but only 1 stop allowed: 0→2 (500), then 2→3 (another stop — k=1 allows 2 stops total)." }],
    difficulty: "Medium", tags: ["Bellman-Ford", "BFS", "dynamic programming", "graphs"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Graviton", section: "OA",
    title: "Maximum Flow (Ford-Fulkerson)",
    slug: "graviton-maximum-flow",
    question: "Given a directed graph with source s and sink t where each edge has a capacity, find the maximum flow from s to t. Implement using Ford-Fulkerson with BFS (Edmonds-Karp).",
    functionSignature: "maxFlow(int n, int[][] capacity, int s, int t): int",
    constraints: ["2 ≤ n ≤ 100", "0 ≤ capacity[u][v] ≤ 10⁶"],
    examples: [{ input: "n=6, s=0, t=5, graph has capacities [0→1:16,0→2:13,1→3:12,2→1:4,2→4:14,3→2:9,3→5:20,4→3:7,4→5:4]", output: "23", explanation: "Maximum flow from 0 to 5 is 23 by augmenting path algorithm." }],
    difficulty: "Hard", tags: ["max flow", "BFS", "graph algorithms", "Edmonds-Karp"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Graviton", section: "OA",
    title: "Minimum Window to Sort Array",
    slug: "graviton-min-window-sort-array",
    question: "Given an integer array nums, find the shortest subarray which, if sorted, makes the entire array sorted. Return the length of this subarray. Return 0 if already sorted.",
    functionSignature: "findUnsortedSubarray(int[] nums): int",
    constraints: ["1 ≤ nums.length ≤ 10⁴", "-10⁵ ≤ nums[i] ≤ 10⁵"],
    examples: [{ input: "nums=[2,6,4,8,10,9,15]", output: "5", explanation: "Subarray [6,4,8,10,9] (indices 1-5) needs to be sorted." }],
    difficulty: "Medium", tags: ["sorting", "two pointers", "arrays"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  PHONEPE
  // ═══════════════════════════════════════════════════════════

  {
    company: "PhonePe", section: "OA",
    title: "Transaction Fraud Detection",
    slug: "phonepe-transaction-fraud",
    question: "Given a stream of transactions for a user, flag a transaction as suspicious if: (1) it is more than 2× the average of last 5 transactions, OR (2) the same amount appears 3+ times in the last 10 transactions. Return the list of flagged transaction indices.",
    functionSignature: "detectFraud(int[] amounts): List<Integer>",
    constraints: ["1 ≤ amounts.length ≤ 10⁵", "1 ≤ amounts[i] ≤ 10⁶"],
    examples: [{ input: "amounts=[100,100,200,100,500,100]", output: "[4]", explanation: "avg of last 5 before index 4 is (100+100+200+100)/4=125. 500>2×125=250 → flagged." }],
    difficulty: "Medium", tags: ["sliding window", "hash map", "arrays", "simulation"], year: 2024, platform: "HackerRank",
  },

  {
    company: "PhonePe", section: "OA",
    title: "Merge K Sorted Lists",
    slug: "phonepe-merge-k-sorted-lists",
    question: "Given an array of k linked lists, each sorted in ascending order, merge all linked lists into one sorted linked list and return it.",
    functionSignature: "mergeKLists(ListNode[] lists): ListNode",
    constraints: ["k == lists.length", "0 ≤ k ≤ 10⁴", "0 ≤ lists[i].length ≤ 500", "-10⁴ ≤ lists[i][j].val ≤ 10⁴"],
    examples: [{ input: "lists=[[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]", explanation: "Min-heap of size k for O(n log k) merge." }],
    difficulty: "Hard", tags: ["heap", "priority queue", "linked list", "divide and conquer"], year: 2024, platform: "HackerRank",
  },

  {
    company: "PhonePe", section: "OA",
    title: "Implement Trie",
    slug: "phonepe-implement-trie",
    question: "Implement a Trie (prefix tree) with insert(word), search(word), and startsWith(prefix) methods. Used for PhonePe's autocomplete in the payment search feature.",
    functionSignature: "class Trie { void insert(String word); boolean search(String word); boolean startsWith(String prefix); }",
    constraints: ["1 ≤ word.length, prefix.length ≤ 2000", "word and prefix consist of lowercase English letters", "At most 3×10⁴ calls"],
    examples: [{ input: 'insert("apple"); search("apple")→true; search("app")→false; startsWith("app")→true', output: "true, false, true", explanation: "Standard Trie with TrieNode array of 26." }],
    difficulty: "Medium", tags: ["trie", "design", "strings"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  RAZORPAY
  // ═══════════════════════════════════════════════════════════

  {
    company: "Razorpay", section: "OA",
    title: "Minimum Coin Change",
    slug: "razorpay-minimum-coin-change",
    question: "Given an array of coin denominations and an amount, return the minimum number of coins needed to make up that amount. Return -1 if the amount cannot be made up.",
    functionSignature: "coinChange(int[] coins, int amount): int",
    constraints: ["1 ≤ coins.length ≤ 12", "1 ≤ coins[i] ≤ 2³¹-1", "0 ≤ amount ≤ 10⁴"],
    examples: [{ input: "coins=[1,5,6,9], amount=11", output: "2", explanation: "11 = 5+6. Two coins." }],
    difficulty: "Medium", tags: ["dynamic programming", "BFS", "greedy"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Razorpay", section: "OA",
    title: "Design Payment Retry System",
    slug: "razorpay-payment-retry-system",
    question: "Design a payment retry scheduler. Each payment has a retry count and exponential backoff delay (2^attempt seconds). Given a list of payment events (paymentId, status), schedule retries and return the final status (success/failed) of each payment after maximum 5 attempts.",
    functionSignature: "processPayments(int[][] payments, int[][] events): Map<Integer,String>",
    constraints: ["1 ≤ payments ≤ 10⁴", "Max 5 retry attempts per payment", "Backoff: 2^attempt seconds"],
    examples: [{ input: "payments=[1,2,3], events: p1 fails at t=0, p1 succeeds at t=1", output: "{1:'success', ...}", explanation: "Retry after 1s. Use priority queue sorted by next_attempt_time." }],
    difficulty: "Medium", tags: ["design", "priority queue", "simulation"], year: 2024, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  ADOBE (CS Fundamentals + System Design)
  // ═══════════════════════════════════════════════════════════

  {
    company: "Adobe", section: "CS Fundamentals",
    title: "Virtual vs Pure Virtual Functions in C++",
    slug: "adobe-virtual-pure-virtual",
    question: "Explain the difference between virtual and pure virtual functions in C++. When would you use each? What is an abstract class and how does it relate to pure virtual functions? Write an example demonstrating runtime polymorphism.",
    functionSignature: "// Conceptual — no function signature",
    constraints: [],
    examples: [{ input: "class Shape { virtual double area() = 0; };  class Circle : public Shape { double area() { return 3.14*r*r; } };", output: "Shape is abstract (pure virtual area()); Circle must implement area()", explanation: "Pure virtual (=0) forces derived classes to implement the method. Virtual without =0 provides a default implementation." }],
    difficulty: "Medium", tags: ["OOP", "C++", "polymorphism", "inheritance"], year: 2024, platform: "Adobe Interview",
  },

  {
    company: "Adobe", section: "System Design",
    title: "Design Adobe Photoshop Undo System",
    slug: "adobe-design-undo-system",
    question: "Design the undo/redo system for Adobe Photoshop. The system must support: apply operation, undo (revert last operation), redo (reapply undone operation), and snapshot (save current state). Discuss data structures and storage trade-offs.",
    functionSignature: "class PhotoshopUndoSystem { void apply(Operation op); void undo(); void redo(); void snapshot(); }",
    constraints: ["Up to 10⁴ operations in history", "Snapshot creates a checkpoint", "Memory efficient — avoid storing full image each step"],
    examples: [{ input: "apply(blur), apply(crop), undo → crop undone, redo → crop reapplied", output: "Stack for undo (command pattern), separate stack for redo, snapshots as checkpoints", explanation: "Command pattern: store reversible commands. Incremental diff storage to save memory." }],
    difficulty: "Hard", tags: ["system design", "command pattern", "stack", "design patterns"], year: 2024, platform: "Adobe Interview",
  },

  // ═══════════════════════════════════════════════════════════
  //  AMAZON — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Amazon", section: "OA",
    title: "Two Sum",
    slug: "amazon-two-sum",
    question: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target. Each input has exactly one solution and you may not use the same element twice.",
    functionSignature: "twoSum(int[] nums, int target): int[]",
    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "Exactly one valid answer exists"],
    examples: [{ input: "nums=[2,7,11,15], target=9", output: "[0,1]", explanation: "nums[0]+nums[1]=2+7=9." }],
    difficulty: "Easy", tags: ["hash map", "arrays"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Amazon", section: "OA",
    title: "Partition Labels",
    slug: "amazon-partition-labels",
    question: "A string s is given. Partition it into as many parts as possible so that each letter appears in at most one part. Return a list of integers representing the sizes of these parts.",
    functionSignature: "partitionLabels(String s): List<Integer>",
    constraints: ["1 ≤ s.length ≤ 500", "s consists of lowercase English letters"],
    examples: [{ input: 's="ababcbacadefegdehijhklij"', output: "[9,7,8]", explanation: "Partitions: 'ababcbaca','defegde','hijhklij'. Each letter only in one part." }],
    difficulty: "Medium", tags: ["greedy", "two pointers", "strings"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Amazon", section: "OA",
    title: "Top K Frequent Elements",
    slug: "amazon-top-k-frequent",
    question: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order. Your algorithm must run in better than O(n log n) time.",
    functionSignature: "topKFrequent(int[] nums, int k): int[]",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "k is in range [1, number of unique elements]", "Guaranteed answer is unique"],
    examples: [{ input: "nums=[1,1,1,2,2,3], k=2", output: "[1,2]", explanation: "Bucket sort or heap gives O(n) / O(n log k)." }],
    difficulty: "Medium", tags: ["heap", "bucket sort", "hash map"], year: 2023, platform: "HackerRank",
  },

  {
    company: "Amazon", section: "OA",
    title: "Word Ladder",
    slug: "amazon-word-ladder",
    question: "Given two words beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord. Each step must change exactly one letter and the transformed word must be in wordList.",
    functionSignature: "ladderLength(String beginWord, String endWord, List<String> wordList): int",
    constraints: ["1 ≤ beginWord.length ≤ 10", "endWord.length == beginWord.length", "1 ≤ wordList.length ≤ 5000"],
    examples: [{ input: 'beginWord="hit", endWord="cog", wordList=["hot","dot","dog","lot","log","cog"]', output: "5", explanation: "hit→hot→dot→dog→cog is the shortest path (5 words)." }],
    difficulty: "Hard", tags: ["BFS", "strings", "shortest path"], year: 2023, platform: "HackerRank",
  },

  {
    company: "Amazon", section: "OA",
    title: "Spiral Matrix",
    slug: "amazon-spiral-matrix",
    question: "Given an m×n matrix, return all elements of the matrix in spiral order (clockwise from top-left).",
    functionSignature: "spiralOrder(int[][] matrix): List<Integer>",
    constraints: ["m == matrix.length", "n == matrix[i].length", "1 ≤ m, n ≤ 10", "-100 ≤ matrix[i][j] ≤ 100"],
    examples: [{ input: "matrix=[[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]", explanation: "Traverse boundaries inward layer by layer." }],
    difficulty: "Medium", tags: ["matrix", "simulation", "arrays"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  GOOGLE — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Google", section: "OA",
    title: "Candy Distribution",
    slug: "google-candy",
    question: "n children stand in a row, each with a rating value. Distribute candies such that: every child gets at least 1 candy, children with a higher rating than their neighbors get more candies. Find the minimum number of candies needed.",
    functionSignature: "candy(int[] ratings): int",
    constraints: ["n == ratings.length", "1 ≤ n ≤ 2×10⁴", "0 ≤ ratings[i] ≤ 2×10⁴"],
    examples: [{ input: "ratings=[1,0,2]", output: "5", explanation: "Distribute [2,1,2]. Min total = 5." }],
    difficulty: "Hard", tags: ["greedy", "arrays", "two-pass"], year: 2024, platform: "HackerEarth",
  },

  {
    company: "Google", section: "OA",
    title: "Text Justification",
    slug: "google-text-justification",
    question: "Given an array of strings words and a width maxWidth, format the text such that each line has exactly maxWidth characters and is fully justified (left and right). Extra spaces between words should be distributed as evenly as possible; if uneven, extra spaces go to the left slots. The last line should be left-justified.",
    functionSignature: "fullJustify(String[] words, int maxWidth): List<String>",
    constraints: ["1 ≤ words.length ≤ 300", "1 ≤ words[i].length ≤ 20", "1 ≤ maxWidth ≤ 100", "words[i].length ≤ maxWidth"],
    examples: [{ input: 'words=["This","is","an","example","of","text","justification."], maxWidth=16', output: '["This    is    an","example  of text","justification.  "]', explanation: "Each line padded to exactly maxWidth." }],
    difficulty: "Hard", tags: ["strings", "simulation", "greedy"], year: 2024, platform: "HackerEarth",
  },

  {
    company: "Google", section: "OA",
    title: "Design Search Autocomplete System",
    slug: "google-search-autocomplete",
    question: "Design a search autocomplete system. Input method: input(char c) — if c is '#', the user has finished typing and the sentence is stored with its frequency. Otherwise, return the top 3 most frequent historical sentences that have the prefix formed so far. Ties broken by ASCII order.",
    functionSignature: "class AutocompleteSystem { AutocompleteSystem(String[] sentences, int[] times); List<String> input(char c); }",
    constraints: ["1 ≤ sentences.length ≤ 100", "1 ≤ sentences[i].length ≤ 100", "Frequencies are positive integers"],
    examples: [{ input: 'sentences=["i love you","island","iroman"], times=[5,3,2]; input("i")→["i love you","island","iroman"]', output: "Top-3 by frequency", explanation: "Trie + frequency map. Insert on '#'." }],
    difficulty: "Hard", tags: ["trie", "design", "priority queue", "strings"], year: 2024, platform: "HackerEarth",
  },

  {
    company: "Google", section: "OA",
    title: "Jump Game",
    slug: "google-jump-game",
    question: "Given an integer array nums where nums[i] is the maximum jump length from position i, return true if you can reach the last index, false otherwise.",
    functionSignature: "canJump(int[] nums): boolean",
    constraints: ["1 ≤ nums.length ≤ 10⁴", "0 ≤ nums[i] ≤ 10⁵"],
    examples: [{ input: "nums=[2,3,1,1,4]", output: "true", explanation: "Jump 1 from 0 to 1, then 3 to reach last." }, { input: "nums=[3,2,1,0,4]", output: "false", explanation: "Always stuck at index 3." }],
    difficulty: "Medium", tags: ["greedy", "dynamic programming", "arrays"], year: 2023, platform: "HackerEarth",
  },

  // ═══════════════════════════════════════════════════════════
  //  MICROSOFT — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Microsoft", section: "OA",
    title: "Edit Distance",
    slug: "microsoft-edit-distance",
    question: "Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) required to convert word1 to word2.",
    functionSignature: "minDistance(String word1, String word2): int",
    constraints: ["0 ≤ word1.length, word2.length ≤ 500", "word1 and word2 consist of lowercase English letters"],
    examples: [{ input: 'word1="horse", word2="ros"', output: "3", explanation: "horse→rorse(replace h→r)→rose(remove r)→ros(remove e). 3 ops." }],
    difficulty: "Hard", tags: ["dynamic programming", "strings", "Levenshtein"], year: 2024, platform: "Codility",
  },

  {
    company: "Microsoft", section: "OA",
    title: "Validate Binary Search Tree",
    slug: "microsoft-validate-bst",
    question: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST requires left subtree values < node, right subtree values > node, and all subtrees must also be valid BSTs.",
    functionSignature: "isValidBST(TreeNode root): boolean",
    constraints: ["Number of nodes: [1, 10⁴]", "-2³¹ ≤ Node.val ≤ 2³¹-1"],
    examples: [{ input: "root=[5,1,4,null,null,3,6]", output: "false", explanation: "Node 4 (right child of root) is less than root 5, violating BST property." }],
    difficulty: "Medium", tags: ["binary tree", "DFS", "recursion"], year: 2024, platform: "Codility",
  },

  {
    company: "Microsoft", section: "OA",
    title: "Longest Common Subsequence",
    slug: "microsoft-lcs",
    question: "Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence is a sequence that appears in the same relative order but not necessarily contiguous.",
    functionSignature: "longestCommonSubsequence(String text1, String text2): int",
    constraints: ["1 ≤ text1.length, text2.length ≤ 1000", "text1 and text2 consist of lowercase English letters"],
    examples: [{ input: 'text1="abcde", text2="ace"', output: "3", explanation: 'LCS is "ace", length 3.' }],
    difficulty: "Medium", tags: ["dynamic programming", "strings"], year: 2023, platform: "Codility",
  },

  // ═══════════════════════════════════════════════════════════
  //  GOLDMAN SACHS — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Goldman Sachs", section: "OA",
    title: "Maximum Circular Subarray Sum",
    slug: "goldman-max-circular-subarray",
    question: "Given a circular integer array nums, return the maximum possible sum of a non-empty subarray. A circular array means the end connects back to the beginning.",
    functionSignature: "maxSubarraySumCircular(int[] nums): int",
    constraints: ["n == nums.length", "1 ≤ n ≤ 3×10⁴", "-3×10⁴ ≤ nums[i] ≤ 3×10⁴"],
    examples: [{ input: "nums=[1,-2,3,-2]", output: "3", explanation: "Subarray [3] has max sum = 3." }, { input: "nums=[5,-3,5]", output: "10", explanation: "Circular path [5,5] sums to 10." }],
    difficulty: "Medium", tags: ["dynamic programming", "Kadane's algorithm", "circular array"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Goldman Sachs", section: "OA",
    title: "Minimum Cost to Cut a Stick",
    slug: "goldman-min-cost-cut-stick",
    question: "Given a wooden stick of length n and an array cuts indicating positions to cut, find the minimum total cost to cut the stick. The cost of each cut is the length of the stick being cut. You can change the order of cuts.",
    functionSignature: "minCost(int n, int[] cuts): int",
    constraints: ["2 ≤ n ≤ 10⁶", "1 ≤ cuts.length ≤ min(n-1, 100)", "1 ≤ cuts[i] ≤ n-1", "All cut positions are distinct"],
    examples: [{ input: "n=7, cuts=[1,3,4,5]", output: "16", explanation: "Interval DP. Optimal order gives cost 7+4+3+2=16." }],
    difficulty: "Hard", tags: ["dynamic programming", "interval DP"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Goldman Sachs", section: "OA",
    title: "Kth Largest Element in Array",
    slug: "goldman-kth-largest",
    question: "Given an integer array nums and an integer k, return the kth largest element in the array (not the kth distinct element). Achieve this without fully sorting the array.",
    functionSignature: "findKthLargest(int[] nums, int k): int",
    constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    examples: [{ input: "nums=[3,2,1,5,6,4], k=2", output: "5", explanation: "Quickselect O(n) average or min-heap O(n log k)." }],
    difficulty: "Medium", tags: ["heap", "quickselect", "divide and conquer"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  MORGAN STANLEY — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Morgan Stanley", section: "OA",
    title: "Count BST Keys in a Range",
    slug: "morgan-count-bst-range",
    question: "Given a BST root and two integers lo and hi, return the count of all nodes whose values are in the inclusive range [lo, hi]. Optimize by pruning branches outside the range.",
    functionSignature: "rangeSumBST(TreeNode root, int low, int high): int",
    constraints: ["Number of nodes: [1, 2×10⁴]", "1 ≤ Node.val ≤ 10⁵", "1 ≤ low ≤ high ≤ 10⁵"],
    examples: [{ input: "root=[10,5,15,3,7,null,18], low=7, high=15", output: "3", explanation: "Nodes 7, 10, 15 are in range [7,15]." }],
    difficulty: "Easy", tags: ["BST", "DFS", "recursion", "pruning"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Morgan Stanley", section: "CS Fundamentals",
    title: "Process Scheduling: FCFS vs SJF",
    slug: "morgan-process-scheduling",
    question: "Given n processes each with arrival_time and burst_time, compute the average waiting time and turnaround time for both FCFS and Shortest Job First (non-preemptive) scheduling algorithms. Determine which performs better for the given input.",
    functionSignature: "schedule(int[] arrival, int[] burst): ScheduleResult",
    constraints: ["1 ≤ n ≤ 100", "0 ≤ arrival[i] ≤ 1000", "1 ≤ burst[i] ≤ 100"],
    examples: [{ input: "arrival=[0,1,2,3], burst=[8,4,9,5]", output: "FCFS avg_wait=8.25, SJF avg_wait=4.5", explanation: "SJF reduces average waiting time by prioritizing shorter jobs." }],
    difficulty: "Medium", tags: ["operating systems", "scheduling", "simulation"], year: 2024, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  JP MORGAN — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "JPMorgan", section: "OA",
    title: "Longest Substring Without Repeating Characters",
    slug: "jpmorgan-longest-substring-no-repeat",
    question: "Given a string s, find the length of the longest substring without repeating characters.",
    functionSignature: "lengthOfLongestSubstring(String s): int",
    constraints: ["0 ≤ s.length ≤ 5×10⁴", "s consists of English letters, digits, symbols and spaces"],
    examples: [{ input: 's="abcabcbb"', output: "3", explanation: '"abc" is the longest substring without repeating characters.' }],
    difficulty: "Medium", tags: ["sliding window", "hash map", "strings"], year: 2024, platform: "HackerRank",
  },

  {
    company: "JPMorgan", section: "System Design",
    title: "Design a Distributed Transaction System",
    slug: "jpmorgan-distributed-transactions",
    question: "Design a distributed transaction system for banking operations. Support: transfer(accountA, accountB, amount) with ACID guarantees, handle network partitions (2-phase commit or saga pattern), and ensure no money is lost or duplicated. Discuss CAP theorem trade-offs.",
    functionSignature: "class TransactionSystem { boolean transfer(String from, String to, double amount); double getBalance(String account); }",
    constraints: ["Millions of accounts", "Thousands of concurrent transfers", "Strong consistency required for banking"],
    examples: [{ input: "transfer(A→B, 100) + network partition after debit", output: "Use 2PC or saga with compensating transactions. Log write-ahead journal.", explanation: "2PC: prepare phase locks both, commit phase completes both. Saga: debit A, if credit B fails, credit A back." }],
    difficulty: "Hard", tags: ["system design", "distributed systems", "ACID", "2PC", "saga pattern"], year: 2024, platform: "JPMorgan Interview",
  },

  // ═══════════════════════════════════════════════════════════
  //  FLIPKART — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Flipkart", section: "OA",
    title: "Wildcard Pattern Matching",
    slug: "flipkart-wildcard-matching",
    question: "Given an input string s and a pattern p with wildcards '?' (matches one character) and '*' (matches zero or more characters), implement pattern matching.",
    functionSignature: "isMatch(String s, String p): boolean",
    constraints: ["0 ≤ s.length ≤ 2000", "0 ≤ p.length ≤ 2000", "s and p contain only lowercase letters, '?', and '*'"],
    examples: [{ input: 's="adceb", p="*a*b"', output: "true", explanation: "'*' matches empty, 'a' matches 'a', '*' matches 'dce', 'b' matches 'b'." }],
    difficulty: "Hard", tags: ["dynamic programming", "recursion", "strings"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Flipkart", section: "OA",
    title: "Activity Selection Problem",
    slug: "flipkart-activity-selection",
    question: "Given n activities each with a start and end time, select the maximum number of non-overlapping activities a single person can perform.",
    functionSignature: "activitySelection(int[] start, int[] end): int",
    constraints: ["1 ≤ n ≤ 10⁵", "0 ≤ start[i] < end[i] ≤ 10⁹"],
    examples: [{ input: "start=[1,3,0,5,8,5], end=[2,4,6,7,9,9]", output: "4", explanation: "Select activities ending earliest: 1-2, 3-4, 5-7, 8-9 = 4 activities." }],
    difficulty: "Easy", tags: ["greedy", "sorting", "intervals"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  UBER — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Uber", section: "OA",
    title: "Design Uber Backend (System Design)",
    slug: "uber-design-backend",
    question: "Design the backend system for Uber ride matching. Handle: real-time driver location updates (GPS), rider requesting a ride (match nearest available driver within 5km), trip tracking, and surge pricing. Scale to 1M concurrent users.",
    functionSignature: "class UberSystem { void updateDriverLocation(String driverId, double lat, double lng); String requestRide(String riderId, double lat, double lng); }",
    constraints: ["1M concurrent users", "Driver location update every 4 seconds", "Match latency < 500ms", "Availability 99.99%"],
    examples: [{ input: "requestRide(rider1, 28.6, 77.2) with 50 available drivers nearby", output: "Match nearest driver using geospatial index (H3/Geohash), Pub-Sub for real-time updates", explanation: "Use quadtree or geohash for spatial indexing. Kafka for location stream. Redis for active driver state." }],
    difficulty: "Hard", tags: ["system design", "geospatial", "real-time", "pub-sub"], year: 2024, platform: "Uber Interview",
  },

  // ═══════════════════════════════════════════════════════════
  //  WALMART — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Walmart", section: "OA",
    title: "Buy and Sell Stock with Transaction Fee",
    slug: "walmart-stock-transaction-fee",
    question: "Given an array prices of stock prices and an integer fee, find the maximum profit you can achieve. You can complete as many transactions as you like, but you need to pay the transaction fee for each sale.",
    functionSignature: "maxProfit(int[] prices, int fee): int",
    constraints: ["1 ≤ prices.length ≤ 5×10⁴", "1 ≤ prices[i] ≤ 5×10⁴", "0 ≤ fee ≤ 5×10⁴"],
    examples: [{ input: "prices=[1,3,2,8,4,9], fee=2", output: "8", explanation: "Buy@1 sell@8(fee 2)+profit 5, buy@4 sell@9(fee 2)+profit 3. Total=8." }],
    difficulty: "Medium", tags: ["dynamic programming", "greedy"], year: 2024, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  SALESFORCE — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Salesforce", section: "OA",
    title: "Implement Magic Dictionary",
    slug: "salesforce-magic-dictionary",
    question: "Design a data structure that is initialized with a list of words. Support: buildDict(words) and search(word) which returns true if you can change exactly one character in the stored words to match the search word.",
    functionSignature: "class MagicDictionary { void buildDict(String[] dictionary); boolean search(String searchWord); }",
    constraints: ["1 ≤ dictionary.length ≤ 100", "1 ≤ dictionary[i].length ≤ 100", "All words in dictionary are distinct"],
    examples: [{ input: 'buildDict(["hello","leetcode"]); search("hello")→false; search("hhllo")→true', output: "false, true", explanation: '"hhllo" can become "hello" by changing one char.' }],
    difficulty: "Medium", tags: ["trie", "hash map", "strings", "design"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Salesforce", section: "System Design",
    title: "Design Salesforce CRM Feed",
    slug: "salesforce-design-crm-feed",
    question: "Design the activity feed for Salesforce CRM: each sales rep has a feed showing updates from accounts, opportunities, and contacts they follow. Support: post_update, follow, unfollow, get_feed (paginated, real-time). Scale to 100K users each following up to 1000 entities.",
    functionSignature: "class CRMFeed { void postUpdate(String entityId, String content); void follow(String userId, String entityId); List<Update> getFeed(String userId, int page); }",
    constraints: ["100K users", "1000 follows per user", "Feed response < 200ms", "Updates replicate in real-time"],
    examples: [{ input: "post to Opportunity#123 followed by 5000 users", output: "Fan-out on write (push to followers' feeds in Redis). Use Kafka for async fan-out. Pagination with cursor.", explanation: "Hybrid push-pull: push for active users, pull for inactive. Redis sorted set per user sorted by timestamp." }],
    difficulty: "Hard", tags: ["system design", "feed", "Redis", "Kafka"], year: 2024, platform: "Salesforce Interview",
  },

  // ═══════════════════════════════════════════════════════════
  //  SAMSUNG — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Samsung", section: "OA",
    title: "Jewels and Stones",
    slug: "samsung-jewels-and-stones",
    question: "You are given a string jewels representing the types of stones that are jewels, and a string stones representing all the stones you have. Return the number of stones that are also jewels. Letters are case sensitive.",
    functionSignature: "numJewelsInStones(String jewels, String stones): int",
    constraints: ["1 ≤ jewels.length, stones.length ≤ 50", "jewels and stones consist of only English letters", "All characters in jewels are unique"],
    examples: [{ input: 'jewels="aA", stones="aAAbbbb"', output: "3", explanation: "3 stones (a, A, A) are jewels." }],
    difficulty: "Easy", tags: ["hash set", "strings"], year: 2024, platform: "Samsung Online",
  },

  {
    company: "Samsung", section: "OA",
    title: "Minimum Number of Steps to Make Two Strings Anagram",
    slug: "samsung-min-steps-anagram",
    question: "Given two strings s and t, in one step you can replace any character of t with any other character. Return the minimum number of steps to make t an anagram of s.",
    functionSignature: "minSteps(String s, String t): int",
    constraints: ["1 ≤ s.length == t.length ≤ 5×10⁴", "s and t consist only of lowercase English letters"],
    examples: [{ input: 's="bab", t="aba"', output: "1", explanation: "Replace t[1]='b' with 'b' — wait, replace one char of t to make it anagram of s. bab↔aba: count differences in frequency." }],
    difficulty: "Easy", tags: ["hash map", "strings", "counting"], year: 2023, platform: "Samsung Online",
  },

  // ═══════════════════════════════════════════════════════════
  //  ORACLE — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Oracle", section: "OA",
    title: "Consecutive Numbers (SQL)",
    slug: "oracle-consecutive-numbers",
    question: "Given a Logs table with Id (auto-increment) and Num columns, find all numbers that appear at least three times consecutively.",
    functionSignature: "SELECT DISTINCT l1.Num AS ConsecutiveNums FROM Logs l1, Logs l2, Logs l3 WHERE l1.Id+1=l2.Id AND l2.Id+1=l3.Id AND l1.Num=l2.Num AND l2.Num=l3.Num",
    constraints: ["Table: Logs(Id INT AUTO_INCREMENT, Num INT)"],
    examples: [{ input: "Logs: [(1,1),(2,1),(3,1),(4,2),(5,1),(6,2),(7,2)]", output: "ConsecutiveNums: [1]", explanation: "Only 1 appears 3 consecutive times (rows 1,2,3)." }],
    difficulty: "Medium", tags: ["SQL", "self join", "consecutive rows"], year: 2024, platform: "Oracle OA",
  },

  {
    company: "Oracle", section: "CS Fundamentals",
    title: "ACID Properties and Isolation Levels",
    slug: "oracle-acid-isolation-levels",
    question: "Explain ACID properties (Atomicity, Consistency, Isolation, Durability) in databases. Describe the four standard SQL isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and the anomalies (dirty read, non-repeatable read, phantom read) each prevents.",
    functionSignature: "// Conceptual",
    constraints: [],
    examples: [{ input: "Transaction T1 reads a value, T2 updates it, T1 reads again — is this a dirty read or non-repeatable read?", output: "Non-repeatable read (T2 committed before T1's second read). Dirty read would be if T2 had NOT committed.", explanation: "Repeatable Read prevents non-repeatable reads. Serializable prevents phantom reads." }],
    difficulty: "Medium", tags: ["database", "ACID", "transactions", "isolation levels"], year: 2024, platform: "Oracle Interview",
  },

  // ═══════════════════════════════════════════════════════════
  //  INTUIT — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Intuit", section: "OA",
    title: "Generate Parentheses",
    slug: "intuit-generate-parentheses",
    question: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    functionSignature: "generateParenthesis(int n): List<String>",
    constraints: ["1 ≤ n ≤ 8"],
    examples: [{ input: "n=3", output: '["((()))","(()())","(())()","()(())","()()()"]', explanation: "Backtracking: track open and close counts. Add open if open<n, add close if close<open." }],
    difficulty: "Medium", tags: ["backtracking", "recursion", "strings"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Intuit", section: "OA",
    title: "Letter Combinations of a Phone Number",
    slug: "intuit-phone-number-combinations",
    question: "Given a string containing digits 2-9, return all possible letter combinations that the number could represent based on a phone keypad mapping. Return in any order.",
    functionSignature: "letterCombinations(String digits): List<String>",
    constraints: ["0 ≤ digits.length ≤ 4", "digits[i] is a digit in ['2','9']"],
    examples: [{ input: 'digits="23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]', explanation: "2→abc, 3→def. Backtrack through all combinations." }],
    difficulty: "Medium", tags: ["backtracking", "recursion", "strings"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  ATLASSIAN — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Atlassian", section: "OA",
    title: "Pacific Atlantic Water Flow",
    slug: "atlassian-pacific-atlantic",
    question: "Given an m×n matrix of non-negative integers representing heights of land, rain water flows to the top/left border (Pacific) and bottom/right border (Atlantic). Find all cells where water can flow to both oceans.",
    functionSignature: "pacificAtlantic(int[][] heights): List<List<Integer>>",
    constraints: ["m == heights.length", "n == heights[i].length", "1 ≤ m, n ≤ 200", "0 ≤ heights[i][j] ≤ 10⁵"],
    examples: [{ input: "heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]", explanation: "BFS/DFS from both borders inward (reverse flow)." }],
    difficulty: "Medium", tags: ["BFS", "DFS", "matrix", "multi-source BFS"], year: 2024, platform: "HackerRank",
  },

  {
    company: "Atlassian", section: "System Design",
    title: "Design Jira Issue Tracker",
    slug: "atlassian-design-jira",
    question: "Design a simplified Jira-like issue tracking system. Support: create_issue, update_status, add_comment, assign, search_issues (by project, status, assignee, label), sprint_board (active sprint issues grouped by status). Scale to 50M issues.",
    functionSignature: "// System design — no single function signature",
    constraints: ["50M issues", "1M daily active users", "Full-text search on title+description", "Real-time collaboration on issues"],
    examples: [{ input: "search_issues(project='CORE', status='IN_PROGRESS', assignee='alice')", output: "Paginated results. Use Elasticsearch for search, PostgreSQL for structured data, Redis for board cache.", explanation: "CQRS pattern: writes to Postgres, reads from Elasticsearch. Websockets for real-time comments." }],
    difficulty: "Hard", tags: ["system design", "search", "Elasticsearch", "CQRS"], year: 2024, platform: "Atlassian Interview",
  },

  // ═══════════════════════════════════════════════════════════
  //  NUTANIX — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Nutanix", section: "OA",
    title: "Decode Ways",
    slug: "nutanix-decode-ways",
    question: "A message containing letters A-Z can be encoded into numbers by 'A'→1, 'B'→2, ..., 'Z'→26. Given a string s of digits, return the number of ways to decode it.",
    functionSignature: "numDecodings(String s): int",
    constraints: ["1 ≤ s.length ≤ 100", "s contains only digits", "s may contain leading zeros"],
    examples: [{ input: 's="226"', output: "3", explanation: '"226" can decode as "BZ"(2+26), "VF"(22+6), "BBF"(2+2+6) — 3 ways.' }],
    difficulty: "Medium", tags: ["dynamic programming", "strings"], year: 2024, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  SPRINKLR — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Sprinklr", section: "OA",
    title: "Longest Repeating Character Replacement",
    slug: "sprinklr-longest-repeating-char-replacement",
    question: "Given a string s and integer k, you can replace any k characters to make the longest substring containing the same letter. Return the length of the longest such substring after performing at most k replacements.",
    functionSignature: "characterReplacement(String s, int k): int",
    constraints: ["1 ≤ s.length ≤ 10⁵", "s consists of uppercase English letters", "0 ≤ k ≤ s.length"],
    examples: [{ input: 's="AABABBA", k=1', output: "4", explanation: "Replace one 'B' in 'AABA' to get 'AAAA' (length 4) or similar." }],
    difficulty: "Medium", tags: ["sliding window", "strings", "two pointers"], year: 2024, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  SHARECHAT — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "ShareChat", section: "System Design",
    title: "Design a Short Video Feed (like Reels)",
    slug: "sharechat-design-video-feed",
    question: "Design ShareChat's short video feed. Features: upload video, personalized feed ranking (based on user interest, engagement, recency), infinite scroll, offline cache, and creator analytics. Scale to 100M DAU, 500K videos uploaded daily.",
    functionSignature: "// System design",
    constraints: ["100M DAU", "500K daily video uploads", "Feed latency < 100ms (cached)", "CDN for video delivery"],
    examples: [{ input: "getFeed(userId) for 100M users each with different interests", output: "ML-based ranking model, pre-computed feed in Redis, CDN for video segments, HLS adaptive bitrate streaming", explanation: "Two-stage ranking: cheap recall (collaborative filtering) → expensive ranking (ML model). Push top-K to Redis on publish." }],
    difficulty: "Hard", tags: ["system design", "feed ranking", "CDN", "ML recommendation"], year: 2024, platform: "ShareChat Interview",
  },

  // ═══════════════════════════════════════════════════════════
  //  DE SHAW — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "DE Shaw", section: "OA",
    title: "Burst Balloons",
    slug: "deshaw-burst-balloons",
    question: "Given n balloons indexed 0 to n-1, each with a number on it. Burst all balloons to maximize coins. Bursting balloon i gives nums[left]*nums[i]*nums[right] coins (where left and right are adjacent non-burst balloons). Edge balloons have virtual 1s on both sides.",
    functionSignature: "maxCoins(int[] nums): int",
    constraints: ["n == nums.length", "1 ≤ n ≤ 300", "0 ≤ nums[i] ≤ 100"],
    examples: [{ input: "nums=[3,1,5,8]", output: "167", explanation: "Burst 1(3*1*5=15), then 5(3*5*8=120), then 3(1*3*8=24), then 8(1*8*1=8). Total=167." }],
    difficulty: "Hard", tags: ["dynamic programming", "divide and conquer", "interval DP"], year: 2024, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  TOWER RESEARCH — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Tower Research", section: "OA",
    title: "Random Pick with Weight",
    slug: "tower-random-pick-weight",
    question: "You are given a 0-indexed array of positive integers w where w[i] describes the weight of the ith index. Implement pickIndex() that randomly picks an index in proportion to its weight. Important for sampling in quantitative finance.",
    functionSignature: "class Solution { Solution(int[] w); int pickIndex(); }",
    constraints: ["1 ≤ w.length ≤ 10⁴", "1 ≤ w[i] ≤ 10⁵", "pickIndex called at most 10⁴ times"],
    examples: [{ input: "w=[1,3]; pickIndex() called many times", output: "Index 0 returned ~25% of time, index 1 ~75%", explanation: "Prefix sum + binary search on random float in [0, total_weight)." }],
    difficulty: "Medium", tags: ["prefix sum", "binary search", "probability", "random"], year: 2024, platform: "Tower OA",
  },

  // ═══════════════════════════════════════════════════════════
  //  MEESHO — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Meesho", section: "OA",
    title: "Coin Change II (Count Ways)",
    slug: "meesho-coin-change-ii",
    question: "Given an amount and a list of coin denominations, return the number of distinct combinations that sum to amount. (Order doesn't matter — [1,1,2] and [2,1,1] count as the same.)",
    functionSignature: "change(int amount, int[] coins): int",
    constraints: ["1 ≤ coins.length ≤ 300", "1 ≤ coins[i] ≤ 5000", "0 ≤ amount ≤ 5000"],
    examples: [{ input: "amount=5, coins=[1,2,5]", output: "4", explanation: "5=5, 5=2+2+1, 5=2+1+1+1, 5=1+1+1+1+1. 4 ways." }],
    difficulty: "Medium", tags: ["dynamic programming", "combinatorics", "knapsack"], year: 2023, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  PHONEPE — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "PhonePe", section: "System Design",
    title: "Design UPI Payment System",
    slug: "phonepe-design-upi",
    question: "Design PhonePe's UPI payment infrastructure. Handle: initiate payment (debit source VPA, credit destination VPA), payment status tracking, idempotent retries, reconciliation, and fraud detection. Scale to 1B transactions/month.",
    functionSignature: "class UPISystem { String initiatePayment(String srcVPA, String dstVPA, double amount); String getStatus(String txnId); }",
    constraints: ["1B transactions/month (~400 TPS average, 10K TPS peak)", "Transaction latency < 2s (includes bank API call)", "Zero double-credit/double-debit", "99.99% uptime"],
    examples: [{ input: "initiatePayment(alice@oksbi, bob@paytm, 500.00)", output: "txnId=TXN123, status=PENDING → SUCCESS after NPCI approval", explanation: "Idempotency key on txnId. Two-phase: debit from UPI switch, credit to destination. Dead-letter queue for failed txns. Reconciliation job every 15 min." }],
    difficulty: "Hard", tags: ["system design", "payments", "distributed systems", "idempotency"], year: 2024, platform: "PhonePe Interview",
  },

  // ═══════════════════════════════════════════════════════════
  //  ZOMATO — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Zomato", section: "System Design",
    title: "Design Food Delivery System",
    slug: "zomato-design-delivery-system",
    question: "Design Zomato's real-time food delivery system. Handle: customer places order, restaurant accepts/rejects, delivery partner assignment (nearest available), real-time order tracking, estimated delivery time (ETA), and surge pricing. Scale to 5M daily orders.",
    functionSignature: "class DeliverySystem { String placeOrder(String customerId, String restaurantId, List<Item> items); void updateOrderStatus(String orderId, String status); ETA getETA(String orderId); }",
    constraints: ["5M orders/day (~58 TPS avg)", "ETA accuracy ±5 minutes", "Delivery partner location updated every 5s", "Order tracking real-time via WebSocket"],
    examples: [{ input: "placeOrder with 20 available delivery partners in 3km radius", output: "Assign nearest unassigned partner using geospatial index. Pub-Sub for status updates.", explanation: "Geohash for proximity. ML model for ETA using historical traffic. Kafka for order events. Redis for partner availability." }],
    difficulty: "Hard", tags: ["system design", "geospatial", "real-time", "ETA"], year: 2024, platform: "Zomato Interview",
  },

  // ═══════════════════════════════════════════════════════════
  //  CISCO — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Cisco", section: "OA",
    title: "Number of Islands II (Dynamic)",
    slug: "cisco-number-of-islands-ii",
    question: "Given an m×n grid initially all water, process n addLand operations that turn a water cell into land. After each operation, return the number of islands. An island is a maximal 4-connected group of land cells.",
    functionSignature: "numIslands2(int m, int n, int[][] positions): List<Integer>",
    constraints: ["1 ≤ m, n ≤ 10⁴", "1 ≤ positions.length ≤ 10⁴", "positions[i].length == 2", "0 ≤ ri < m, 0 ≤ ci < n"],
    examples: [{ input: "m=3, n=3, positions=[[0,0],[0,1],[1,2],[2,1]]", output: "[1,1,2,3]", explanation: "Union-Find: add land and union with adjacent land cells. Island count = # components." }],
    difficulty: "Hard", tags: ["union find", "matrix", "dynamic"], year: 2024, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  GRAVITON — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Graviton", section: "OA",
    title: "Critical Connections in a Network",
    slug: "graviton-critical-connections",
    question: "Given n servers and a list of connections, find all critical connections (bridges) — edges whose removal disconnects the network.",
    functionSignature: "criticalConnections(int n, List<List<Integer>> connections): List<List<Integer>>",
    constraints: ["2 ≤ n ≤ 10⁵", "n-1 ≤ connections.length ≤ 10⁵", "No repeated connections, no self-loops"],
    examples: [{ input: "n=4, connections=[[0,1],[1,2],[2,0],[1,3]]", output: "[[1,3]]", explanation: "Edge [1,3] is a bridge — removing it disconnects node 3." }],
    difficulty: "Hard", tags: ["Tarjan's algorithm", "DFS", "bridge finding", "graphs"], year: 2024, platform: "HackerRank",
  },

  // ═══════════════════════════════════════════════════════════
  //  RAZORPAY — more
  // ═══════════════════════════════════════════════════════════

  {
    company: "Razorpay", section: "OA",
    title: "Trapping Rain Water",
    slug: "razorpay-trapping-rain-water",
    question: "Given n non-negative integers representing an elevation map (width=1 per bar), compute how much water can be trapped after rainfall.",
    functionSignature: "trap(int[] height): int",
    constraints: ["n == height.length", "1 ≤ n ≤ 2×10⁴", "0 ≤ height[i] ≤ 10⁵"],
    examples: [{ input: "height=[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "Two pointer approach: track maxLeft and maxRight. Water at i = min(maxLeft, maxRight) - height[i]." }],
    difficulty: "Hard", tags: ["two pointers", "stack", "dynamic programming"], year: 2024, platform: "HackerRank",
  },

];

async function seed() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("✅ MongoDB connected");

  let inserted = 0;
  let updated = 0;

  for (const q of QUESTIONS) {
    const existing = await Question.findOne({ slug: q.slug });
    if (existing) {
      await Question.updateOne({ slug: q.slug }, { $set: q });
      updated++;
    } else {
      await Question.create(q);
      inserted++;
    }
  }

  console.log(`✅ Seed complete — ${inserted} inserted, ${updated} updated, ${QUESTIONS.length} total`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
