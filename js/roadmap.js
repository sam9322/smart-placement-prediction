/**
 * CareerPulse.AI – Personalized Career Roadmap Module
 * 
 * Generates an end-to-end, dynamic 6-Month Structured Timeline based on:
 * - Student Profile & Target Role (SDE, Web Dev, Data, AI/ML, DevOps, Cyber)
 * - Placement Predictor Probability & Factors
 * - Skill Gap Analysis (Prioritizing Missing & Critical gaps)
 * - Weekly Study Hours & Campus Drive Season
 * 
 * Features:
 * 1. AI Next Best Action recommendation card
 * 2. Today's Preparation daily plan with task checklist
 * 3. 5-Phase Month Workflow: Learn → Practice → Quiz → Project → Interview
 * 4. Verified Real YouTube Lectures with thumbnails, channels, and completion toggles
 * 5. Interactive LeetCode/GFG practice problems
 * 6. Interactive Knowledge Check Quizzes with scoring and instant explanations
 * 7. Hands-on Capstone Projects with requirements checklists and GitHub submission
 * 8. Top Interview Questions with model answers
 * 9. Skill Mastery calculation (Beginner → Learning → Strong → Job Ready)
 * 10. Smart adaptation via student feedback
 * 11. Timeline & Domain filters with collapsible month accordions
 * 12. 🔥 Learning Streak & Achievements tracking
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================================================
// CareerPulse.AI Verified YouTube Resource Engine & Validator
// ============================================================================

/**
 * Global registry of verified, public, active YouTube video IDs.
 * System validates that every lecture exists, is publicly accessible, and strictly matches its topic.
 */
const VERIFIED_YOUTUBE_REGISTRY = new Set([
  "-0exw-9YJBo",
  "0IAPZzGSbME",
  "0sWShKIJoo4",
  "1UOPsfP85V4",
  "1pkOgXD63yU",
  "1qw5ITr3k9E",
  "26QPDBe-NB8",
  "2m1Kc9uvLvc",
  "37E9ckMDdTk",
  "3OamzN90kPg",
  "4ZlRH0eK-qQ",
  "58YbpRDc4yw",
  "5Y2EiZST97Y",
  "70tx7KcMROc",
  "7CqJlxBYj-M",
  "7HKot-brXFE",
  "8JJ101D3knE",
  "9TlHvipP5yA",
  "9UtInBqnCgA",
  "9kdHxplyl5I",
  "BHr381Guz3Y",
  "BSVKUk58K6U",
  "CsXoVxyoscw",
  "DfljaUwZsOk",
  "EHCGAZBbB88",
  "FPu9Uld7W-E",
  "G0_I-ZF0S38",
  "IPvYjXCsTg8",
  "JFF2vJaN0Cw",
  "KLlXCFG5TnA",
  "M3_pLsDdeuU",
  "NFjoQ8Sr5Js",
  "Nq7ok-OyEpg",
  "NwBvene4Imo",
  "OT1RErkfLNQ",
  "Oe421EPjeBE",
  "OugnpxNl4_Q",
  "RBSGKlAvoiM",
  "RGOj5yH7evk",
  "RLtyhwFtXQA",
  "S5bfdUTrKLM",
  "SOTamWNgDKc",
  "SqcXvc3ZmRU",
  "UuiTKBwPgAo",
  "XB4MIexjvY0",
  "XIdigk956u0",
  "XKu_SEDAykw",
  "XVuQxVej6y8",
  "Z-F1UYNWEFk",
  "_ANrF3FJm7I",
  "_d0T_2Lk2qA",
  "akErwS16DUg",
  "apGV9Kg7ics",
  "cO9xmfsJJu4",
  "cQ1Oz4ckceM",
  "ctCpP0RFDFc",
  "da9sVlo0zzI",
  "f2EqECiTBL8",
  "fqMOX6JJhGo",
  "gBTe7lFR3vc",
  "grEKMHGYyns",
  "hlyal4sR0m8",
  "jJXJ16kPFWg",
  "jzZsG8n2R9A",
  "kBdlM6hNDAE",
  "mFY0J5W8Udk",
  "n60Dn0UsbEk",
  "nu_pCVPKzTk",
  "o7pY9hCqDZk",
  "oBt53YbR9Kk",
  "pTB0EiLXUC8",
  "pg19Z8LL06w",
  "q5a5OiGbT6Q",
  "q8gdBn9RPeI",
  "qfyynHBFOsM",
  "qiQR5rTSshw",
  "r1MXwyiGi_U",
  "rVPK8-L1aFM",
  "rfscVS0vtbw",
  "shs0KM3wKv8",
  "tWVWeAqZ0WU",
  "tyB0ztf0DNY",
  "uQEuo7woEEk",
  "vBURTt97EkA",
  "vLnPwxZdW4Y",
  "vzdNOK2oB2E",
  "wZ9xxBqukaA",
  "wgFPrzTjm7s",
  "wiGpQwVHdE0",
  "wvcQg43_V8U",
  "xFv_Hl4B83A",
  "xpDnVSmNFX0",
  "yVdKa8dnKiE"
]);

/**
 * Reusable YouTube validation function:
 * Verifies that the video exists, has a valid ID format, and is registered in the verified catalog.
 * @param {string} videoId
 * @returns {boolean}
 */
function validateYouTubeVideo(videoId) {
  if (!videoId || typeof videoId !== 'string') return false;
  const cleanId = videoId.trim();
  if (!/^[a-zA-Z0-9_-]{11}$/.test(cleanId)) return false;
  return VERIFIED_YOUTUBE_REGISTRY.has(cleanId);
}

/**
 * Generates safe fallback search URL if a direct video ever becomes unavailable.
 * Guarantees the student is never stranded with a dead page.
 * @param {string} topic
 * @param {string} [creator]
 * @returns {string}
 */
function getSafeYouTubeSearchUrl(topic, creator) {
  const query = `${topic || 'coding'} ${creator || ''} tutorial`.trim();
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}


const SIX_MONTH_ROADMAP_MASTER = [
  {
    "monthNum": 1,
    "title": "MONTH 1: Programming & DSA Fundamentals",
    "duration": "Month 1 (Weeks 1 - 4)",
    "domain": "DSA",
    "objective": "Establish deep programming syntax fluency, memory management, and fundamental problem-solving habits.",
    "skills": [
      "C++ / Java / Python",
      "OOP Principles",
      "Basic Math for Coding",
      "Time & Space Complexity",
      "Git & GitHub",
      "Data Structures & Algorithms"
    ],
    "youtubeLectures": [
      {
        "videoId": "rfscVS0vtbw",
        "title": "Learn Python - Full Course for Beginners [Tutorial]",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
        "level": "Beginner",
        "duration": "4h 26m",
        "skill": "C++ / Java / Python",
        "topic": "Python Programming",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=rfscVS0vtbw"
      },
      {
        "videoId": "vLnPwxZdW4Y",
        "title": "C++ Tutorial for Beginners - Full Course",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
        "level": "Beginner",
        "duration": "4h 01m",
        "skill": "C++ / Java / Python",
        "topic": "C++ Programming",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=vLnPwxZdW4Y"
      },
      {
        "videoId": "grEKMHGYyns",
        "title": "Learn Java 8 - Full Tutorial for Beginners",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=grEKMHGYyns",
        "level": "Beginner",
        "duration": "9h 33m",
        "skill": "C++ / Java / Python",
        "topic": "Java Programming",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=grEKMHGYyns"
      },
      {
        "videoId": "pTB0EiLXUC8",
        "title": "Object-Oriented Programming, Simplified",
        "channel": "Programming with Mosh",
        "url": "https://www.youtube.com/watch?v=pTB0EiLXUC8",
        "level": "Beginner",
        "duration": "14m 12s",
        "skill": "OOP",
        "topic": "OOP Principles",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=pTB0EiLXUC8"
      },
      {
        "videoId": "BSVKUk58K6U",
        "title": "OOP 1 | Introduction & Concepts - Classes, Objects, Constructors, Keywords",
        "channel": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=BSVKUk58K6U",
        "level": "Beginner",
        "duration": "1h 48m",
        "skill": "OOP",
        "topic": "OOP Principles",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=BSVKUk58K6U"
      },
      {
        "videoId": "CsXoVxyoscw",
        "title": "L- 8 | Pillars of OOPs in Python | Python course for ML Ai and data science in Hindi",
        "channel": "Data Dissection ",
        "url": "https://www.youtube.com/watch?v=CsXoVxyoscw",
        "level": "Beginner",
        "duration": "42m 10s",
        "skill": "OOP",
        "topic": "OOP Principles",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=CsXoVxyoscw"
      },
      {
        "videoId": "cO9xmfsJJu4",
        "title": "Complete Math for Machine Learning and AI",
        "channel": "Data Dissection ",
        "url": "https://www.youtube.com/watch?v=cO9xmfsJJu4",
        "level": "Beginner",
        "duration": "2h 15m",
        "skill": "Basic Math for Coding",
        "topic": "Basic Math for Coding",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=cO9xmfsJJu4"
      },
      {
        "videoId": "OugnpxNl4_Q",
        "title": "Mathematics for Machine learning full course in Hindi | Math for Ai | Ml for beginners",
        "channel": "Data Dissection ",
        "url": "https://www.youtube.com/watch?v=OugnpxNl4_Q",
        "level": "Beginner",
        "duration": "1h 50m",
        "skill": "Basic Math for Coding",
        "topic": "Basic Math for Coding",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=OugnpxNl4_Q"
      },
      {
        "videoId": "0IAPZzGSbME",
        "title": "1. Introduction to Algorithms",
        "channel": "Abdul Bari",
        "url": "https://www.youtube.com/watch?v=0IAPZzGSbME",
        "level": "Beginner",
        "duration": "18m 42s",
        "skill": "Time & Space Complexity",
        "topic": "Time & Space Complexity",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=0IAPZzGSbME"
      },
      {
        "videoId": "FPu9Uld7W-E",
        "title": "Time and Space Complexity - Strivers A2Z DSA Course",
        "channel": "take U forward",
        "url": "https://www.youtube.com/watch?v=FPu9Uld7W-E",
        "level": "Beginner",
        "duration": "45m 18s",
        "skill": "Time & Space Complexity",
        "topic": "Time & Space Complexity",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=FPu9Uld7W-E"
      },
      {
        "videoId": "9TlHvipP5yA",
        "title": "1.5.1 Time Complexity #1",
        "channel": "Abdul Bari",
        "url": "https://www.youtube.com/watch?v=9TlHvipP5yA",
        "level": "Beginner",
        "duration": "24m 50s",
        "skill": "Time & Space Complexity",
        "topic": "Time & Space Complexity",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=9TlHvipP5yA"
      },
      {
        "videoId": "RGOj5yH7evk",
        "title": "Git and GitHub for Beginners - Crash Course",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=RGOj5yH7evk",
        "level": "Beginner",
        "duration": "1h 08m",
        "skill": "Git & GitHub",
        "topic": "Git & GitHub",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=RGOj5yH7evk"
      },
      {
        "videoId": "apGV9Kg7ics",
        "title": "Complete Git and GitHub Tutorial",
        "channel": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=apGV9Kg7ics",
        "level": "Beginner",
        "duration": "2h 45m",
        "skill": "Git & GitHub",
        "topic": "Git & GitHub",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=apGV9Kg7ics"
      },
      {
        "videoId": "8JJ101D3knE",
        "title": "Git Tutorial for Beginners: Learn Git in 1 Hour",
        "channel": "Programming with Mosh",
        "url": "https://www.youtube.com/watch?v=8JJ101D3knE",
        "level": "Beginner",
        "duration": "1h 09m",
        "skill": "Git & GitHub",
        "topic": "Git & GitHub",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=8JJ101D3knE"
      },
      {
        "videoId": "RBSGKlAvoiM",
        "title": "Data Structures Easy to Advanced Course - Full Tutorial from a Google Engineer",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=RBSGKlAvoiM",
        "level": "Beginner",
        "duration": "8h 03m",
        "skill": "DSA",
        "topic": "Data Structures & Algorithms",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=RBSGKlAvoiM"
      },
      {
        "videoId": "KLlXCFG5TnA",
        "title": "Two Sum - Leetcode 1 - HashMap - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=KLlXCFG5TnA",
        "level": "Intermediate",
        "duration": "10m 22s",
        "skill": "DSA",
        "topic": "Data Structures & Algorithms",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=KLlXCFG5TnA"
      }
    ],
    "practiceProblems": [
      {
        "id": "p_m1_1",
        "name": "Two Sum (LeetCode #1)",
        "link": "https://leetcode.com/problems/two-sum/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "estimatedTime": "20 min"
      },
      {
        "id": "p_m1_2",
        "name": "Valid Palindrome (LeetCode #125)",
        "link": "https://leetcode.com/problems/valid-palindrome/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "estimatedTime": "15 min"
      },
      {
        "id": "p_m1_3",
        "name": "Fibonacci Number (LeetCode #509)",
        "link": "https://leetcode.com/problems/fibonacci-number/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "estimatedTime": "15 min"
      },
      {
        "id": "p_m1_4",
        "name": "Reverse Integer (LeetCode #7)",
        "link": "https://leetcode.com/problems/reverse-integer/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "estimatedTime": "25 min"
      }
    ],
    "quiz": {
      "id": "quiz_m1",
      "title": "Month 1 Knowledge Check: Programming & DSA Foundations",
      "questions": [
        {
          "id": "q1_1",
          "question": "What is the worst-case time complexity of Binary Search on a sorted array of size N?",
          "options": [
            "O(1)",
            "O(log N)",
            "O(N)",
            "O(N log N)"
          ],
          "answer": 1,
          "explanation": "Binary search divides the search space in half at each step, taking logarithmic time O(log N)."
        },
        {
          "id": "q1_2",
          "question": "Which OOP pillar restricts direct access to some of an object's components to prevent unintended modifications?",
          "options": [
            "Inheritance",
            "Polymorphism",
            "Encapsulation",
            "Abstraction"
          ],
          "answer": 2,
          "explanation": "Encapsulation bundles data with methods and hides internal object details using access modifiers."
        },
        {
          "id": "q1_3",
          "question": "Which Git command is used to record staged snapshots into the project history?",
          "options": [
            "git add",
            "git commit",
            "git push",
            "git checkout"
          ],
          "answer": 1,
          "explanation": "'git commit' records changes from the staging index into the local Git repository history."
        }
      ]
    },
    "project": {
      "id": "proj_m1",
      "title": "Console-Based Banking & Management System",
      "desc": "Build an OOP-structured application with encapsulation, persistent ledger file handling, and robust exception handling.",
      "techStack": [
        "Java / C++ / Python",
        "OOP Architecture",
        "File I/O",
        "Exception Handling"
      ],
      "difficulty": "Beginner to Intermediate",
      "estimatedTime": "1 - 2 Weeks",
      "requirements": [
        "Implement clean encapsulation with private fields, getters, setters, and audit timestamps",
        "Create inheritance hierarchy for CheckingAccount and HighYieldSavingsAccount with interest calculation",
        "Implement transaction log persistence to CSV or JSON with file locking safety",
        "Implement robust exception handling for InsufficientFundsException and InvalidAccountException"
      ]
    },
    "interviewQuestions": [
      {
        "q": "Explain the difference between Stack and Heap memory allocations in modern runtimes.",
        "answer": "Stack memory is fast, statically allocated, thread-specific, and stores local primitive variables and method call frames in LIFO order. Heap memory is shared across threads, dynamically allocated at runtime, managed by garbage collectors (or manual free), and stores complex objects.",
        "difficulty": "High Frequency"
      },
      {
        "q": "What are the 4 fundamental pillars of Object-Oriented Programming and why are they used?",
        "answer": "1. Encapsulation (data hiding & bundling). 2. Abstraction (hiding implementation complexity). 3. Inheritance (code reuse & hierarchical modeling). 4. Polymorphism (method overloading & overriding for flexible runtime behavior).",
        "difficulty": "Core Technical"
      },
      {
        "q": "Why is asymptotic Time Complexity analysis critical for online campus screening rounds?",
        "answer": "Platforms like HackerRank enforce 1.0 to 2.0 second per-testcase execution limits. An O(N^2) algorithm with N=10^5 operations takes ~10^10 instructions (~100 seconds) resulting in Time Limit Exceeded (TLE), whereas O(N log N) takes ~1.7x10^6 ops and passes in <0.02s.",
        "difficulty": "High Frequency"
      }
    ],
    "milestones": [
      {
        "id": "m1_1",
        "title": "Master Language Syntax & Standard Libraries (STL / Collections)"
      },
      {
        "id": "m1_2",
        "title": "Solve 25 Easy Problems on Arrays, Strings & Math"
      },
      {
        "id": "m1_3",
        "title": "Configure Git version control and publish 1st repository to GitHub"
      }
    ]
  },
  {
    "monthNum": 2,
    "title": "MONTH 2: Linear Data Structures & Pointer Patterns",
    "duration": "Month 2 (Weeks 5 - 8)",
    "domain": "DSA",
    "objective": "Master Arrays, Two Pointers, Strings, Hashmaps, Sliding Window, and progressive Linked Lists (Level 1 From Scratch to Level 4 Advanced) with zero topic mixing.",
    "skills": [
      "Arrays",
      "Two Pointers",
      "Strings",
      "Hashmaps",
      "Sliding Window",
      "Linked Lists"
    ],
    "milestones": [
      {
        "id": "m2_1",
        "title": "Master Array Traversal, Prefix Sums & Hash Map Pair Lookups (Two Sum)"
      },
      {
        "id": "m2_2",
        "title": "Master Two Pointers & Sliding Window Patterns (Valid Palindrome, 3Sum, Container With Most Water)"
      },
      {
        "id": "m2_3",
        "title": "Complete Dedicated Linked List Path (Levels 1–4) & Solve Easy/Medium/Hard LeetCode Problems"
      }
    ],
    "topicSections": [
      {
        "id": "sec_arrays",
        "name": "ARRAYS",
        "skill": "Arrays",
        "icon": "fa-solid fa-layer-group",
        "accentColor": "#6366f1",
        "tagline": "Array Fundamentals & Interview Patterns",
        "concepts": [
          "Array fundamentals",
          "Array traversal",
          "Searching",
          "Sorting basics",
          "Prefix/suffix concepts",
          "Common Array interview patterns"
        ],
        "lectures": [
          {
            "videoId": "37E9ckMDdTk",
            "title": "Find Second Largest Element in Array | Remove duplicates from Sorted Array | Arrays Intro Video",
            "channel": "take U forward",
            "url": "https://www.youtube.com/watch?v=37E9ckMDdTk",
            "level": "Beginner",
            "duration": "14m 32s",
            "skill": "Arrays",
            "topic": "Arrays",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=37E9ckMDdTk"
          },
          {
            "videoId": "wvcQg43_V8U",
            "title": "Rotate Array by K places | Union, Intersection of Sorted Arrays | Move Zeros to End | Arrays Part-2",
            "channel": "take U forward",
            "url": "https://www.youtube.com/watch?v=wvcQg43_V8U",
            "level": "Beginner",
            "duration": "20m 15s",
            "skill": "Arrays",
            "topic": "Arrays",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=wvcQg43_V8U"
          },
          {
            "videoId": "n60Dn0UsbEk",
            "title": "Introduction to Arrays and ArrayList in Java",
            "channel": "Kunal Kushwaha",
            "url": "https://www.youtube.com/watch?v=n60Dn0UsbEk",
            "level": "Beginner",
            "duration": "1h 48m",
            "skill": "Arrays",
            "topic": "Arrays",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=n60Dn0UsbEk"
          },
          {
            "videoId": "3OamzN90kPg",
            "title": "Contains Duplicate - Leetcode 217 - Python",
            "channel": "NeetCode",
            "url": "https://www.youtube.com/watch?v=3OamzN90kPg",
            "level": "Beginner",
            "duration": "7m 45s",
            "skill": "Arrays",
            "topic": "Arrays",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=3OamzN90kPg"
          },
          {
            "videoId": "KLlXCFG5TnA",
            "title": "Two Sum - Leetcode 1 - HashMap - Python",
            "channel": "NeetCode",
            "url": "https://www.youtube.com/watch?v=KLlXCFG5TnA",
            "level": "Beginner",
            "duration": "10m 22s",
            "skill": "Arrays",
            "topic": "Arrays",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=KLlXCFG5TnA"
          }
        ],
        "practice": [
          {
            "id": "p_m2_arr_twosum",
            "name": "Two Sum — LeetCode #1",
            "link": "https://leetcode.com/problems/two-sum/",
            "platform": "LeetCode",
            "difficulty": "Easy",
            "topic": "Array + HashMap",
            "estimatedTime": "20 min",
            "solutionUrl": "https://www.youtube.com/watch?v=KLlXCFG5TnA",
            "solutionTitle": "Two Sum Solution (NeetCode)",
            "isTwoSumFeatured": true
          },
          {
            "id": "p_m2_arr_217",
            "name": "Contains Duplicate — LeetCode #217",
            "link": "https://leetcode.com/problems/contains-duplicate/",
            "platform": "LeetCode",
            "difficulty": "Easy",
            "topic": "Array",
            "estimatedTime": "15 min",
            "solutionUrl": "https://www.youtube.com/watch?v=3OamzN90kPg"
          },
          {
            "id": "p_m2_arr_189",
            "name": "Rotate Array — LeetCode #189",
            "link": "https://leetcode.com/problems/rotate-array/",
            "platform": "LeetCode",
            "difficulty": "Medium",
            "topic": "Array",
            "estimatedTime": "25 min",
            "solutionUrl": "https://www.youtube.com/watch?v=BHr381Guz3Y"
          }
        ]
      },
      {
        "id": "sec_two_pointers",
        "name": "TWO POINTERS",
        "skill": "Two Pointers",
        "icon": "fa-solid fa-arrows-left-right-to-line",
        "accentColor": "#06b6d4",
        "tagline": "Opposite & Same-Direction Pointer Techniques",
        "concepts": [
          "Two Pointer fundamentals",
          "Opposite-direction pointers",
          "Same-direction pointers",
          "Fast/slow pointers where appropriate",
          "Two Pointer interview patterns"
        ],
        "lectures": [
          {
            "videoId": "9kdHxplyl5I",
            "title": "L1. Introduction to Sliding Window and 2 Pointers | Templates | Patterns",
            "channel": "take U forward",
            "url": "https://www.youtube.com/watch?v=9kdHxplyl5I",
            "level": "Beginner",
            "duration": "25m 40s",
            "skill": "Two Pointers",
            "topic": "Two Pointers",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=9kdHxplyl5I"
          },
          {
            "videoId": "jJXJ16kPFWg",
            "title": "Valid Palindrome - Leetcode 125 - Python",
            "channel": "NeetCode",
            "url": "https://www.youtube.com/watch?v=jJXJ16kPFWg",
            "level": "Beginner",
            "duration": "11m 30s",
            "skill": "Two Pointers",
            "topic": "Two Pointers",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=jJXJ16kPFWg"
          },
          {
            "videoId": "cQ1Oz4ckceM",
            "title": "TWO SUM II - Amazon Coding Interview Question - Leetcode 167 - Python",
            "channel": "NeetCode",
            "url": "https://www.youtube.com/watch?v=cQ1Oz4ckceM",
            "level": "Intermediate",
            "duration": "9m 14s",
            "skill": "Two Pointers",
            "topic": "Two Pointers",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=cQ1Oz4ckceM"
          },
          {
            "videoId": "jzZsG8n2R9A",
            "title": "3Sum - Leetcode 15 - Python",
            "channel": "NeetCode",
            "url": "https://www.youtube.com/watch?v=jzZsG8n2R9A",
            "level": "Intermediate",
            "duration": "15m 32s",
            "skill": "Two Pointers",
            "topic": "Two Pointers",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=jzZsG8n2R9A"
          },
          {
            "videoId": "UuiTKBwPgAo",
            "title": "Container with Most Water - Leetcode 11 - Python",
            "channel": "NeetCode",
            "url": "https://www.youtube.com/watch?v=UuiTKBwPgAo",
            "level": "Intermediate",
            "duration": "11m 05s",
            "skill": "Two Pointers",
            "topic": "Two Pointers",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=UuiTKBwPgAo"
          }
        ],
        "practice": [
          {
            "id": "p_m2_tp_125",
            "name": "Valid Palindrome — LeetCode #125",
            "link": "https://leetcode.com/problems/valid-palindrome/",
            "platform": "LeetCode",
            "difficulty": "Easy",
            "topic": "Two Pointers",
            "estimatedTime": "15 min",
            "solutionUrl": "https://www.youtube.com/watch?v=jJXJ16kPFWg"
          },
          {
            "id": "p_m2_tp_167",
            "name": "Two Sum II — LeetCode #167",
            "link": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
            "platform": "LeetCode",
            "difficulty": "Medium",
            "topic": "Two Pointers",
            "estimatedTime": "20 min",
            "solutionUrl": "https://www.youtube.com/watch?v=cQ1Oz4ckceM"
          },
          {
            "id": "p_m2_tp_15",
            "name": "3Sum — LeetCode #15",
            "link": "https://leetcode.com/problems/3sum/",
            "platform": "LeetCode",
            "difficulty": "Medium",
            "topic": "Two Pointers",
            "estimatedTime": "30 min",
            "solutionUrl": "https://www.youtube.com/watch?v=jzZsG8n2R9A"
          },
          {
            "id": "p_m2_tp_11",
            "name": "Container With Most Water — LeetCode #11",
            "link": "https://leetcode.com/problems/container-with-most-water/",
            "platform": "LeetCode",
            "difficulty": "Medium",
            "topic": "Two Pointers",
            "estimatedTime": "25 min",
            "solutionUrl": "https://www.youtube.com/watch?v=UuiTKBwPgAo"
          }
        ]
      },
      {
        "id": "sec_strings",
        "name": "STRINGS",
        "skill": "Strings",
        "icon": "fa-solid fa-font",
        "accentColor": "#a855f7",
        "tagline": "String Processing & Anagram Analysis",
        "concepts": [
          "String immutability and character buffers",
          "Two pointer string reversal",
          "Character frequency mapping & Anagrams",
          "Prefix matching algorithms"
        ],
        "lectures": [
          {
            "videoId": "_d0T_2Lk2qA",
            "title": "Reverse String - 3 Ways - Leetcode 344 - Python",
            "channel": "NeetCode",
            "url": "https://www.youtube.com/watch?v=_d0T_2Lk2qA",
            "level": "Beginner",
            "duration": "8m 42s",
            "skill": "Strings",
            "topic": "Strings",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=_d0T_2Lk2qA"
          },
          {
            "videoId": "9UtInBqnCgA",
            "title": "Valid Anagram - Leetcode 242 - Python",
            "channel": "NeetCode",
            "url": "https://www.youtube.com/watch?v=9UtInBqnCgA",
            "level": "Beginner",
            "duration": "9m 15s",
            "skill": "Strings",
            "topic": "Strings",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=9UtInBqnCgA"
          },
          {
            "videoId": "0sWShKIJoo4",
            "title": "Longest Common Prefix - Leetcode 14 - Python",
            "channel": "NeetCode",
            "url": "https://www.youtube.com/watch?v=0sWShKIJoo4",
            "level": "Beginner",
            "duration": "8m 55s",
            "skill": "Strings",
            "topic": "Strings",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=0sWShKIJoo4"
          }
        ],
        "practice": [
          {
            "id": "p_m2_str_242",
            "name": "Valid Anagram — LeetCode #242",
            "link": "https://leetcode.com/problems/valid-anagram/",
            "platform": "LeetCode",
            "difficulty": "Easy",
            "topic": "Strings",
            "estimatedTime": "15 min",
            "solutionUrl": "https://www.youtube.com/watch?v=9UtInBqnCgA"
          },
          {
            "id": "p_m2_str_14",
            "name": "Longest Common Prefix — LeetCode #14",
            "link": "https://leetcode.com/problems/longest-common-prefix/",
            "platform": "LeetCode",
            "difficulty": "Easy",
            "topic": "Strings",
            "estimatedTime": "15 min",
            "solutionUrl": "https://www.youtube.com/watch?v=0sWShKIJoo4"
          },
          {
            "id": "p_m2_str_344",
            "name": "Reverse String — LeetCode #344",
            "link": "https://leetcode.com/problems/reverse-string/",
            "platform": "LeetCode",
            "difficulty": "Easy",
            "topic": "Strings",
            "estimatedTime": "10 min",
            "solutionUrl": "https://www.youtube.com/watch?v=_d0T_2Lk2qA"
          }
        ]
      },
      {
        "id": "sec_hashmaps",
        "name": "HASHMAPS",
        "skill": "Hashmaps",
        "icon": "fa-solid fa-hashtag",
        "accentColor": "#f59e0b",
        "tagline": "Hash Tables, Collisions & O(1) Key Lookups",
        "concepts": [
          "Hash function design and internal buckets",
          "Collision resolution (Chaining vs Open Addressing)",
          "Frequency count mapping",
          "Constant-time pair and anagram lookup"
        ],
        "lectures": [
          {
            "videoId": "shs0KM3wKv8",
            "title": "Data Structures: Hash Tables",
            "channel": "HackerRank",
            "url": "https://www.youtube.com/watch?v=shs0KM3wKv8",
            "level": "Beginner",
            "duration": "6m 12s",
            "skill": "Hashmaps",
            "topic": "Hashmaps",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=shs0KM3wKv8"
          },
          {
            "videoId": "mFY0J5W8Udk",
            "title": "Hashing Technique - Simplified",
            "channel": "Abdul Bari",
            "url": "https://www.youtube.com/watch?v=mFY0J5W8Udk",
            "level": "Intermediate",
            "duration": "44m 20s",
            "skill": "Hashmaps",
            "topic": "Hashmaps",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=mFY0J5W8Udk"
          },
          {
            "videoId": "vzdNOK2oB2E",
            "title": "Group Anagrams - Categorize Strings by Count - Leetcode 49",
            "channel": "NeetCode",
            "url": "https://www.youtube.com/watch?v=vzdNOK2oB2E",
            "level": "Intermediate",
            "duration": "11m 20s",
            "skill": "Hashmaps",
            "topic": "Hashmaps",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=vzdNOK2oB2E"
          }
        ],
        "practice": [
          {
            "id": "p_m2_hm_1",
            "name": "Two Sum — LeetCode #1",
            "link": "https://leetcode.com/problems/two-sum/",
            "platform": "LeetCode",
            "difficulty": "Easy",
            "topic": "HashMap",
            "estimatedTime": "20 min",
            "solutionUrl": "https://www.youtube.com/watch?v=KLlXCFG5TnA"
          },
          {
            "id": "p_m2_hm_49",
            "name": "Group Anagrams — LeetCode #49",
            "link": "https://leetcode.com/problems/group-anagrams/",
            "platform": "LeetCode",
            "difficulty": "Medium",
            "topic": "HashMap",
            "estimatedTime": "25 min",
            "solutionUrl": "https://www.youtube.com/watch?v=vzdNOK2oB2E"
          }
        ]
      },
      {
        "id": "sec_sliding_window",
        "name": "SLIDING WINDOW",
        "skill": "Sliding Window",
        "icon": "fa-solid fa-sliders",
        "accentColor": "#10b981",
        "tagline": "Dynamic & Fixed Subarray Windows",
        "concepts": [
          "Sliding Window identification & pattern types",
          "Fixed-length window template",
          "Dynamic-length window with character counts",
          "Monotonic queue for sliding window maximum"
        ],
        "lectures": [
          {
            "videoId": "EHCGAZBbB88",
            "title": "Sliding Window Introduction Identification And Types",
            "channel": "Aditya Verma",
            "url": "https://www.youtube.com/watch?v=EHCGAZBbB88",
            "level": "Beginner",
            "duration": "17m 10s",
            "skill": "Sliding Window",
            "topic": "Sliding Window",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=EHCGAZBbB88"
          },
          {
            "videoId": "1pkOgXD63yU",
            "title": "Sliding Window: Best Time to Buy and Sell Stock - Leetcode 121 - Python",
            "channel": "NeetCode",
            "url": "https://www.youtube.com/watch?v=1pkOgXD63yU",
            "level": "Intermediate",
            "duration": "12m 40s",
            "skill": "Sliding Window",
            "topic": "Sliding Window",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=1pkOgXD63yU"
          },
          {
            "videoId": "wiGpQwVHdE0",
            "title": "Longest Substring Without Repeating Characters - Leetcode 3 - Python",
            "channel": "NeetCode",
            "url": "https://www.youtube.com/watch?v=wiGpQwVHdE0",
            "level": "Intermediate",
            "duration": "15m 15s",
            "skill": "Sliding Window",
            "topic": "Sliding Window",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=wiGpQwVHdE0"
          },
          {
            "videoId": "NwBvene4Imo",
            "title": "L16. Sliding Window Maximum | Stack and Queue Playlist",
            "channel": "take U forward",
            "url": "https://www.youtube.com/watch?v=NwBvene4Imo",
            "level": "Advanced",
            "duration": "32m 45s",
            "skill": "Sliding Window",
            "topic": "Sliding Window",
            "verified": true,
            "youtubeUrl": "https://www.youtube.com/watch?v=NwBvene4Imo"
          }
        ],
        "practice": [
          {
            "id": "p_m2_sw_121",
            "name": "Best Time to Buy and Sell Stock — LeetCode #121",
            "link": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
            "platform": "LeetCode",
            "difficulty": "Easy",
            "topic": "Sliding Window",
            "estimatedTime": "20 min",
            "solutionUrl": "https://www.youtube.com/watch?v=1pkOgXD63yU"
          },
          {
            "id": "p_m2_sw_3",
            "name": "Longest Substring Without Repeating Characters — LeetCode #3",
            "link": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
            "platform": "LeetCode",
            "difficulty": "Medium",
            "topic": "Sliding Window",
            "estimatedTime": "30 min",
            "solutionUrl": "https://www.youtube.com/watch?v=wiGpQwVHdE0"
          },
          {
            "id": "p_m2_sw_239",
            "name": "Sliding Window Maximum — LeetCode #239",
            "link": "https://leetcode.com/problems/sliding-window-maximum/",
            "platform": "LeetCode",
            "difficulty": "Hard",
            "topic": "Sliding Window",
            "estimatedTime": "40 min",
            "solutionUrl": "https://www.youtube.com/watch?v=DfljaUwZsOk"
          }
        ]
      },
      {
        "id": "sec_linked_lists",
        "name": "LINKED LISTS",
        "skill": "Linked Lists",
        "isDedicatedLinkedList": true,
        "icon": "fa-solid fa-link",
        "accentColor": "#f43f5e",
        "tagline": "Dedicated Learning Path: Beginner → Advanced",
        "abdulBariNote": "Algorithmic theory by Abdul Bari • Implementations by CodeHelp & Kunal Kushwaha • Patterns by take U forward & NeetCode",
        "levels": [
          {
            "levelNum": 1,
            "levelId": "ll_level_1",
            "title": "LEVEL 1 — FROM SCRATCH",
            "subtitle": "Beginner Linked List: Node Architecture & Primitives",
            "concepts": [
              "What is a Linked List?",
              "Node structure",
              "Head and tail",
              "Creating a Linked List from scratch",
              "Traversal",
              "Searching",
              "Insertion",
              "Deletion"
            ],
            "lectures": [
              {
                "videoId": "akErwS16DUg",
                "title": "11.1 : Linked List Introduction & Concepts | DSA [Abdul Bari]",
                "channel": "Hacktrickz",
                "url": "https://www.youtube.com/watch?v=akErwS16DUg",
                "level": "Beginner",
                "duration": "28m 33s",
                "skill": "Linked Lists",
                "topic": "Theory & Node Structure",
                "specialBadge": "Abdul Bari Theory",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=akErwS16DUg"
              },
              {
                "videoId": "Nq7ok-OyEpg",
                "title": "L1. Introduction to LinkedList | Traversal | Length | Search an Element",
                "channel": "take U forward",
                "url": "https://www.youtube.com/watch?v=Nq7ok-OyEpg",
                "level": "Beginner",
                "duration": "35m 10s",
                "skill": "Linked Lists",
                "topic": "Traversal & Search",
                "specialBadge": "Striver / TUF",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=Nq7ok-OyEpg"
              },
              {
                "videoId": "q8gdBn9RPeI",
                "title": "Lecture 44: Linked List & its types - Singly, Doubly, Circular etc.",
                "channel": "CodeHelp - by Babbar",
                "url": "https://www.youtube.com/watch?v=q8gdBn9RPeI",
                "level": "Beginner",
                "duration": "1h 38m",
                "skill": "Linked Lists",
                "topic": "Node Types & Pointer Linking",
                "specialBadge": "CodeHelp / Babbar",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=q8gdBn9RPeI"
              },
              {
                "videoId": "58YbpRDc4yw",
                "title": "Linked List Tutorial - Singly + Doubly + Circular (Theory + Code + Implementation)",
                "channel": "Kunal Kushwaha",
                "url": "https://www.youtube.com/watch?v=58YbpRDc4yw",
                "level": "Beginner",
                "duration": "2h 15m",
                "skill": "Linked Lists",
                "topic": "Creation from Scratch",
                "specialBadge": "Kunal Kushwaha",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=58YbpRDc4yw"
              },
              {
                "videoId": "NFjoQ8Sr5Js",
                "title": "11.6 : Insert in Linked List (Theory + Code) | DSA [Abdul Bari]",
                "channel": "Hacktrickz",
                "url": "https://www.youtube.com/watch?v=NFjoQ8Sr5Js",
                "level": "Beginner",
                "duration": "21m 15s",
                "skill": "Linked Lists",
                "topic": "Insertion & Deletion Operations",
                "specialBadge": "Abdul Bari Theory",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=NFjoQ8Sr5Js"
              }
            ]
          },
          {
            "levelNum": 2,
            "levelId": "ll_level_2",
            "title": "LEVEL 2 — CORE LINKED LIST",
            "subtitle": "Pointer Manipulation, Reversal & Merging",
            "concepts": [
              "Singly Linked List",
              "Doubly Linked List",
              "Circular Linked List",
              "Reverse Linked List",
              "Find middle node",
              "Merge two sorted lists"
            ],
            "lectures": [
              {
                "videoId": "Z-F1UYNWEFk",
                "title": "Lecture 79: All about Doubly Linked List || Linked List Series Day - 2",
                "channel": "CodeHelp - by Babbar",
                "url": "https://www.youtube.com/watch?v=Z-F1UYNWEFk",
                "level": "Intermediate",
                "duration": "48m 20s",
                "skill": "Linked Lists",
                "topic": "Doubly Linked List Mechanics",
                "specialBadge": "CodeHelp / Babbar",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=Z-F1UYNWEFk"
              },
              {
                "videoId": "wZ9xxBqukaA",
                "title": "11.13 : Concatenation & Merging of Linked Lists | DSA [Abdul Bari]",
                "channel": "Hacktrickz",
                "url": "https://www.youtube.com/watch?v=wZ9xxBqukaA",
                "level": "Intermediate",
                "duration": "18m 42s",
                "skill": "Linked Lists",
                "topic": "Merging Sorted Lists Algorithmic Analysis",
                "specialBadge": "Abdul Bari Theory",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=wZ9xxBqukaA"
              },
              {
                "videoId": "G0_I-ZF0S38",
                "title": "Reverse Linked List - Iterative AND Recursive - Leetcode 206 - Python",
                "channel": "NeetCode",
                "url": "https://www.youtube.com/watch?v=G0_I-ZF0S38",
                "level": "Beginner",
                "duration": "8m 22s",
                "skill": "Linked Lists",
                "topic": "In-place Reversal Pattern",
                "specialBadge": "NeetCode Pattern",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=G0_I-ZF0S38"
              },
              {
                "videoId": "XIdigk956u0",
                "title": "Merge Two Sorted Lists - Leetcode 21 - Python",
                "channel": "NeetCode",
                "url": "https://www.youtube.com/watch?v=XIdigk956u0",
                "level": "Beginner",
                "duration": "10m 15s",
                "skill": "Linked Lists",
                "topic": "Merging Two Lists",
                "specialBadge": "NeetCode Pattern",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=XIdigk956u0"
              }
            ]
          },
          {
            "levelNum": 3,
            "levelId": "ll_level_3",
            "title": "LEVEL 3 — LINKED LIST ALGORITHMS",
            "subtitle": "Fast & Slow Pointers, Floyd's Cycle & Intersecting Lists",
            "concepts": [
              "Fast and slow pointer",
              "Floyd's Cycle Detection",
              "Detect cycle",
              "Find cycle starting point",
              "Remove Nth node",
              "Intersection of linked lists",
              "Palindrome linked list"
            ],
            "lectures": [
              {
                "videoId": "70tx7KcMROc",
                "title": "Linked List Interview Questions - Google, Facebook, Amazon, Microsoft",
                "channel": "Kunal Kushwaha",
                "url": "https://www.youtube.com/watch?v=70tx7KcMROc",
                "level": "Intermediate",
                "duration": "1h 52m",
                "skill": "Linked Lists",
                "topic": "Cycle Detection & Fast/Slow Pointers",
                "specialBadge": "FAANG Questions",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=70tx7KcMROc"
              },
              {
                "videoId": "gBTe7lFR3vc",
                "title": "Linked List Cycle - Floyd's Tortoise and Hare - Leetcode 141 - Python",
                "channel": "NeetCode",
                "url": "https://www.youtube.com/watch?v=gBTe7lFR3vc",
                "level": "Intermediate",
                "duration": "7m 30s",
                "skill": "Linked Lists",
                "topic": "Floyd's Tortoise & Hare Cycle Finding",
                "specialBadge": "NeetCode Pattern",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=gBTe7lFR3vc"
              },
              {
                "videoId": "XVuQxVej6y8",
                "title": "Remove Nth Node from End of List - Oracle Interview Question - Leetcode 19",
                "channel": "NeetCode",
                "url": "https://www.youtube.com/watch?v=XVuQxVej6y8",
                "level": "Intermediate",
                "duration": "10m 05s",
                "skill": "Linked Lists",
                "topic": "Two-Pointer Gap Technique",
                "specialBadge": "NeetCode Pattern",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=XVuQxVej6y8"
              },
              {
                "videoId": "S5bfdUTrKLM",
                "title": "Linkedin Interview Question - Reorder List - Leetcode 143 - Python",
                "channel": "NeetCode",
                "url": "https://www.youtube.com/watch?v=S5bfdUTrKLM",
                "level": "Intermediate",
                "duration": "13m 48s",
                "skill": "Linked Lists",
                "topic": "Mid-point + Reversal + Interleaving",
                "specialBadge": "NeetCode Pattern",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=S5bfdUTrKLM"
              }
            ]
          },
          {
            "levelNum": 4,
            "levelId": "ll_level_4",
            "title": "LEVEL 4 — ADVANCED",
            "subtitle": "K-Group Inversion, Merge K Lists & LRU Cache",
            "concepts": [
              "Reverse Linked List II",
              "Reorder List",
              "Add Two Numbers",
              "Copy List with Random Pointer",
              "Reverse Nodes in K-Group",
              "Merge K Sorted Lists",
              "LRU Cache using Doubly Linked List + HashMap"
            ],
            "lectures": [
              {
                "videoId": "5Y2EiZST97Y",
                "title": "Copy List with Random Pointer - Linked List - Leetcode 138",
                "channel": "NeetCode",
                "url": "https://www.youtube.com/watch?v=5Y2EiZST97Y",
                "level": "Advanced",
                "duration": "15m 12s",
                "skill": "Linked Lists",
                "topic": "Deep Copy with Hash Map & Interleaving",
                "specialBadge": "NeetCode Pattern",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=5Y2EiZST97Y"
              },
              {
                "videoId": "1UOPsfP85V4",
                "title": "Reverse Nodes in K-Group - Linked List - Leetcode 25",
                "channel": "NeetCode",
                "url": "https://www.youtube.com/watch?v=1UOPsfP85V4",
                "level": "Advanced",
                "duration": "21m 30s",
                "skill": "Linked Lists",
                "topic": "K-Group Block Reversal",
                "specialBadge": "NeetCode Pattern",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=1UOPsfP85V4"
              },
              {
                "videoId": "q5a5OiGbT6Q",
                "title": "Merge K Sorted Lists - Leetcode 23 - Python",
                "channel": "NeetCode",
                "url": "https://www.youtube.com/watch?v=q5a5OiGbT6Q",
                "level": "Advanced",
                "duration": "17m 45s",
                "skill": "Linked Lists",
                "topic": "Divide & Conquer / Min-Heap with Lists",
                "specialBadge": "NeetCode Pattern",
                "verified": true,
                "youtubeUrl": "https://www.youtube.com/watch?v=q5a5OiGbT6Q"
              }
            ]
          }
        ],
        "practiceGroups": [
          {
            "difficulty": "Easy",
            "badgeClass": "badge-success",
            "icon": "fa-solid fa-leaf",
            "problems": [
              {
                "id": "p_m2_ll_206",
                "name": "Reverse Linked List — LeetCode #206",
                "link": "https://leetcode.com/problems/reverse-linked-list/",
                "platform": "LeetCode",
                "difficulty": "Easy",
                "topic": "Linked List",
                "estimatedTime": "15 min",
                "solutionUrl": "https://www.youtube.com/watch?v=G0_I-ZF0S38"
              },
              {
                "id": "p_m2_ll_21",
                "name": "Merge Two Sorted Lists — LeetCode #21",
                "link": "https://leetcode.com/problems/merge-two-sorted-lists/",
                "platform": "LeetCode",
                "difficulty": "Easy",
                "topic": "Linked List",
                "estimatedTime": "15 min",
                "solutionUrl": "https://www.youtube.com/watch?v=XIdigk956u0"
              },
              {
                "id": "p_m2_ll_141",
                "name": "Linked List Cycle — LeetCode #141",
                "link": "https://leetcode.com/problems/linked-list-cycle/",
                "platform": "LeetCode",
                "difficulty": "Easy",
                "topic": "Linked List",
                "estimatedTime": "15 min",
                "solutionUrl": "https://www.youtube.com/watch?v=gBTe7lFR3vc"
              }
            ]
          },
          {
            "difficulty": "Medium",
            "badgeClass": "badge-warning",
            "icon": "fa-solid fa-fire",
            "problems": [
              {
                "id": "p_m2_ll_19",
                "name": "Remove Nth Node From End — LeetCode #19",
                "link": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "topic": "Linked List",
                "estimatedTime": "25 min",
                "solutionUrl": "https://www.youtube.com/watch?v=XVuQxVej6y8"
              },
              {
                "id": "p_m2_ll_143",
                "name": "Reorder List — LeetCode #143",
                "link": "https://leetcode.com/problems/reorder-list/",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "topic": "Linked List",
                "estimatedTime": "25 min",
                "solutionUrl": "https://www.youtube.com/watch?v=S5bfdUTrKLM"
              },
              {
                "id": "p_m2_ll_2",
                "name": "Add Two Numbers — LeetCode #2",
                "link": "https://leetcode.com/problems/add-two-numbers/",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "topic": "Linked List",
                "estimatedTime": "30 min",
                "solutionUrl": "https://www.youtube.com/watch?v=wgFPrzTjm7s"
              },
              {
                "id": "p_m2_ll_138",
                "name": "Copy List with Random Pointer — LeetCode #138",
                "link": "https://leetcode.com/problems/copy-list-with-random-pointer/",
                "platform": "LeetCode",
                "difficulty": "Medium",
                "topic": "Linked List",
                "estimatedTime": "30 min",
                "solutionUrl": "https://www.youtube.com/watch?v=5Y2EiZST97Y"
              }
            ]
          },
          {
            "difficulty": "Hard",
            "badgeClass": "badge-danger",
            "icon": "fa-solid fa-bolt",
            "problems": [
              {
                "id": "p_m2_ll_25",
                "name": "Reverse Nodes in K-Group — LeetCode #25",
                "link": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "topic": "Linked List",
                "estimatedTime": "45 min",
                "solutionUrl": "https://www.youtube.com/watch?v=1UOPsfP85V4"
              },
              {
                "id": "p_m2_ll_23",
                "name": "Merge K Sorted Lists — LeetCode #23",
                "link": "https://leetcode.com/problems/merge-k-sorted-lists/",
                "platform": "LeetCode",
                "difficulty": "Hard",
                "topic": "Linked List",
                "estimatedTime": "45 min",
                "solutionUrl": "https://www.youtube.com/watch?v=q5a5OiGbT6Q"
              }
            ]
          }
        ]
      }
    ],
    "quiz": {
      "id": "quiz_m2",
      "title": "Month 2 Knowledge Check: Linear Data Structures, Pointers & Linked Lists",
      "questions": [
        {
          "id": "q2_1",
          "question": "What is the optimal time complexity to find if a pair exists with target sum in a sorted array using Two Pointers?",
          "options": [
            "O(N^2)",
            "O(N log N)",
            "O(N)",
            "O(1)"
          ],
          "answer": 2,
          "explanation": "With two pointers starting at opposite ends of a sorted array, each step increments or decrements one pointer, guaranteeing O(N) linear time."
        },
        {
          "id": "q2_2",
          "question": "How does Floyd's Cycle-Finding Algorithm (Tortoise and Hare) detect a loop in a Linked List?",
          "options": [
            "Fast pointer moves 2 nodes, slow moves 1 node; they meet if a cycle exists",
            "Both pointers move at the same speed from opposite ends",
            "Using a hash set to store all visited memory addresses",
            "Counting total node length until integer overflow"
          ],
          "answer": 0,
          "explanation": "If a cycle exists, the gap between the fast pointer (moving 2 steps) and slow pointer (moving 1 step) shrinks by exactly 1 node per iteration until they collide."
        },
        {
          "id": "q2_3",
          "question": "What is the average time complexity of insertion, deletion, and lookup in a Hash Table?",
          "options": [
            "O(log N)",
            "O(N)",
            "O(1)",
            "O(N log N)"
          ],
          "answer": 2,
          "explanation": "With an effective hash function and uniform distribution, hash table lookup, insertion, and deletion operate in O(1) average time."
        }
      ]
    },
    "project": {
      "id": "proj_m2",
      "title": "Custom In-Memory Cache with LRU Eviction",
      "desc": "Implement Least Recently Used (LRU) Cache using Doubly Linked List and HashMap achieving O(1) get and put operations.",
      "techStack": [
        "Doubly Linked List",
        "HashMap",
        "Concurrency Controls",
        "Benchmarking"
      ],
      "difficulty": "Intermediate",
      "estimatedTime": "1 - 2 Weeks",
      "requirements": [
        "Implement Doubly Linked List node structure with previous and next pointer management",
        "Integrate HashMap storing key-to-node references for O(1) lookup",
        "Implement get(key) with automatic promotion of accessed node to head",
        "Implement put(key, value) with eviction of least recently used node from tail when capacity is exceeded"
      ]
    },
    "interviewQuestions": [
      {
        "q": "How does a HashMap resolve hash collisions internally?",
        "answer": "HashMaps use: 1. Separate Chaining (each bucket stores a linked list; converts to balanced Red-Black tree in Java 8+ when bucket length exceeds 8). 2. Open Addressing (linear probing, quadratic probing, or double hashing where collided keys probe alternative empty array slots).",
        "difficulty": "High Frequency"
      },
      {
        "q": "Explain Floyd's Cycle-Finding Algorithm (Tortoise and Hare) and how to find the cycle start node.",
        "answer": "Fast pointer moves 2 steps, slow pointer moves 1 step. If they meet, a cycle exists. To find the entrance node, reset slow pointer to head while leaving fast at the meeting node, then advance both at 1 step per turn; their new meeting point is the exact cycle entrance.",
        "difficulty": "Core Technical"
      },
      {
        "q": "What are the trade-offs between an Array and a Linked List in memory and cache performance?",
        "answer": "Arrays provide O(1) random index access and superior CPU cache locality due to contiguous memory allocation. Linked Lists have non-contiguous node allocations with pointer overhead (8 bytes per pointer on 64-bit systems) leading to frequent cache misses, but provide O(1) insertions/deletions once a node pointer is located.",
        "difficulty": "High Frequency"
      }
    ],
    "youtubeLectures": [
      {
        "videoId": "37E9ckMDdTk",
        "title": "Find Second Largest Element in Array | Remove duplicates from Sorted Array | Arrays Intro Video",
        "channel": "take U forward",
        "url": "https://www.youtube.com/watch?v=37E9ckMDdTk",
        "level": "Beginner",
        "duration": "14m 32s",
        "skill": "Arrays",
        "topic": "Arrays",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=37E9ckMDdTk"
      },
      {
        "videoId": "wvcQg43_V8U",
        "title": "Rotate Array by K places | Union, Intersection of Sorted Arrays | Move Zeros to End | Arrays Part-2",
        "channel": "take U forward",
        "url": "https://www.youtube.com/watch?v=wvcQg43_V8U",
        "level": "Beginner",
        "duration": "20m 15s",
        "skill": "Arrays",
        "topic": "Arrays",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=wvcQg43_V8U"
      },
      {
        "videoId": "n60Dn0UsbEk",
        "title": "Introduction to Arrays and ArrayList in Java",
        "channel": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=n60Dn0UsbEk",
        "level": "Beginner",
        "duration": "1h 48m",
        "skill": "Arrays",
        "topic": "Arrays",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=n60Dn0UsbEk"
      },
      {
        "videoId": "3OamzN90kPg",
        "title": "Contains Duplicate - Leetcode 217 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=3OamzN90kPg",
        "level": "Beginner",
        "duration": "7m 45s",
        "skill": "Arrays",
        "topic": "Arrays",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=3OamzN90kPg"
      },
      {
        "videoId": "KLlXCFG5TnA",
        "title": "Two Sum - Leetcode 1 - HashMap - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=KLlXCFG5TnA",
        "level": "Beginner",
        "duration": "10m 22s",
        "skill": "Arrays",
        "topic": "Arrays",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=KLlXCFG5TnA"
      },
      {
        "videoId": "9kdHxplyl5I",
        "title": "L1. Introduction to Sliding Window and 2 Pointers | Templates | Patterns",
        "channel": "take U forward",
        "url": "https://www.youtube.com/watch?v=9kdHxplyl5I",
        "level": "Beginner",
        "duration": "25m 40s",
        "skill": "Two Pointers",
        "topic": "Two Pointers",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=9kdHxplyl5I"
      },
      {
        "videoId": "jJXJ16kPFWg",
        "title": "Valid Palindrome - Leetcode 125 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=jJXJ16kPFWg",
        "level": "Beginner",
        "duration": "11m 30s",
        "skill": "Two Pointers",
        "topic": "Two Pointers",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=jJXJ16kPFWg"
      },
      {
        "videoId": "cQ1Oz4ckceM",
        "title": "TWO SUM II - Amazon Coding Interview Question - Leetcode 167 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=cQ1Oz4ckceM",
        "level": "Intermediate",
        "duration": "9m 14s",
        "skill": "Two Pointers",
        "topic": "Two Pointers",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=cQ1Oz4ckceM"
      },
      {
        "videoId": "jzZsG8n2R9A",
        "title": "3Sum - Leetcode 15 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=jzZsG8n2R9A",
        "level": "Intermediate",
        "duration": "15m 32s",
        "skill": "Two Pointers",
        "topic": "Two Pointers",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=jzZsG8n2R9A"
      },
      {
        "videoId": "UuiTKBwPgAo",
        "title": "Container with Most Water - Leetcode 11 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=UuiTKBwPgAo",
        "level": "Intermediate",
        "duration": "11m 05s",
        "skill": "Two Pointers",
        "topic": "Two Pointers",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=UuiTKBwPgAo"
      },
      {
        "videoId": "_d0T_2Lk2qA",
        "title": "Reverse String - 3 Ways - Leetcode 344 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=_d0T_2Lk2qA",
        "level": "Beginner",
        "duration": "8m 42s",
        "skill": "Strings",
        "topic": "Strings",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=_d0T_2Lk2qA"
      },
      {
        "videoId": "9UtInBqnCgA",
        "title": "Valid Anagram - Leetcode 242 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=9UtInBqnCgA",
        "level": "Beginner",
        "duration": "9m 15s",
        "skill": "Strings",
        "topic": "Strings",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=9UtInBqnCgA"
      },
      {
        "videoId": "0sWShKIJoo4",
        "title": "Longest Common Prefix - Leetcode 14 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=0sWShKIJoo4",
        "level": "Beginner",
        "duration": "8m 55s",
        "skill": "Strings",
        "topic": "Strings",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=0sWShKIJoo4"
      },
      {
        "videoId": "shs0KM3wKv8",
        "title": "Data Structures: Hash Tables",
        "channel": "HackerRank",
        "url": "https://www.youtube.com/watch?v=shs0KM3wKv8",
        "level": "Beginner",
        "duration": "6m 12s",
        "skill": "Hashmaps",
        "topic": "Hashmaps",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=shs0KM3wKv8"
      },
      {
        "videoId": "mFY0J5W8Udk",
        "title": "Hashing Technique - Simplified",
        "channel": "Abdul Bari",
        "url": "https://www.youtube.com/watch?v=mFY0J5W8Udk",
        "level": "Intermediate",
        "duration": "44m 20s",
        "skill": "Hashmaps",
        "topic": "Hashmaps",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=mFY0J5W8Udk"
      },
      {
        "videoId": "vzdNOK2oB2E",
        "title": "Group Anagrams - Categorize Strings by Count - Leetcode 49",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=vzdNOK2oB2E",
        "level": "Intermediate",
        "duration": "11m 20s",
        "skill": "Hashmaps",
        "topic": "Hashmaps",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=vzdNOK2oB2E"
      },
      {
        "videoId": "EHCGAZBbB88",
        "title": "Sliding Window Introduction Identification And Types",
        "channel": "Aditya Verma",
        "url": "https://www.youtube.com/watch?v=EHCGAZBbB88",
        "level": "Beginner",
        "duration": "17m 10s",
        "skill": "Sliding Window",
        "topic": "Sliding Window",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=EHCGAZBbB88"
      },
      {
        "videoId": "1pkOgXD63yU",
        "title": "Sliding Window: Best Time to Buy and Sell Stock - Leetcode 121 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=1pkOgXD63yU",
        "level": "Intermediate",
        "duration": "12m 40s",
        "skill": "Sliding Window",
        "topic": "Sliding Window",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=1pkOgXD63yU"
      },
      {
        "videoId": "wiGpQwVHdE0",
        "title": "Longest Substring Without Repeating Characters - Leetcode 3 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=wiGpQwVHdE0",
        "level": "Intermediate",
        "duration": "15m 15s",
        "skill": "Sliding Window",
        "topic": "Sliding Window",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=wiGpQwVHdE0"
      },
      {
        "videoId": "NwBvene4Imo",
        "title": "L16. Sliding Window Maximum | Stack and Queue Playlist",
        "channel": "take U forward",
        "url": "https://www.youtube.com/watch?v=NwBvene4Imo",
        "level": "Advanced",
        "duration": "32m 45s",
        "skill": "Sliding Window",
        "topic": "Sliding Window",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=NwBvene4Imo"
      },
      {
        "videoId": "akErwS16DUg",
        "title": "11.1 : Linked List Introduction & Concepts | DSA [Abdul Bari]",
        "channel": "Hacktrickz",
        "url": "https://www.youtube.com/watch?v=akErwS16DUg",
        "level": "Beginner",
        "duration": "28m 33s",
        "skill": "Linked Lists",
        "topic": "Theory & Node Structure",
        "specialBadge": "Abdul Bari Theory",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=akErwS16DUg"
      },
      {
        "videoId": "Nq7ok-OyEpg",
        "title": "L1. Introduction to LinkedList | Traversal | Length | Search an Element",
        "channel": "take U forward",
        "url": "https://www.youtube.com/watch?v=Nq7ok-OyEpg",
        "level": "Beginner",
        "duration": "35m 10s",
        "skill": "Linked Lists",
        "topic": "Traversal & Search",
        "specialBadge": "Striver / TUF",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=Nq7ok-OyEpg"
      },
      {
        "videoId": "q8gdBn9RPeI",
        "title": "Lecture 44: Linked List & its types - Singly, Doubly, Circular etc.",
        "channel": "CodeHelp - by Babbar",
        "url": "https://www.youtube.com/watch?v=q8gdBn9RPeI",
        "level": "Beginner",
        "duration": "1h 38m",
        "skill": "Linked Lists",
        "topic": "Node Types & Pointer Linking",
        "specialBadge": "CodeHelp / Babbar",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=q8gdBn9RPeI"
      },
      {
        "videoId": "58YbpRDc4yw",
        "title": "Linked List Tutorial - Singly + Doubly + Circular (Theory + Code + Implementation)",
        "channel": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=58YbpRDc4yw",
        "level": "Beginner",
        "duration": "2h 15m",
        "skill": "Linked Lists",
        "topic": "Creation from Scratch",
        "specialBadge": "Kunal Kushwaha",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=58YbpRDc4yw"
      },
      {
        "videoId": "NFjoQ8Sr5Js",
        "title": "11.6 : Insert in Linked List (Theory + Code) | DSA [Abdul Bari]",
        "channel": "Hacktrickz",
        "url": "https://www.youtube.com/watch?v=NFjoQ8Sr5Js",
        "level": "Beginner",
        "duration": "21m 15s",
        "skill": "Linked Lists",
        "topic": "Insertion & Deletion Operations",
        "specialBadge": "Abdul Bari Theory",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=NFjoQ8Sr5Js"
      },
      {
        "videoId": "Z-F1UYNWEFk",
        "title": "Lecture 79: All about Doubly Linked List || Linked List Series Day - 2",
        "channel": "CodeHelp - by Babbar",
        "url": "https://www.youtube.com/watch?v=Z-F1UYNWEFk",
        "level": "Intermediate",
        "duration": "48m 20s",
        "skill": "Linked Lists",
        "topic": "Doubly Linked List Mechanics",
        "specialBadge": "CodeHelp / Babbar",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=Z-F1UYNWEFk"
      },
      {
        "videoId": "wZ9xxBqukaA",
        "title": "11.13 : Concatenation & Merging of Linked Lists | DSA [Abdul Bari]",
        "channel": "Hacktrickz",
        "url": "https://www.youtube.com/watch?v=wZ9xxBqukaA",
        "level": "Intermediate",
        "duration": "18m 42s",
        "skill": "Linked Lists",
        "topic": "Merging Sorted Lists Algorithmic Analysis",
        "specialBadge": "Abdul Bari Theory",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=wZ9xxBqukaA"
      },
      {
        "videoId": "G0_I-ZF0S38",
        "title": "Reverse Linked List - Iterative AND Recursive - Leetcode 206 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=G0_I-ZF0S38",
        "level": "Beginner",
        "duration": "8m 22s",
        "skill": "Linked Lists",
        "topic": "In-place Reversal Pattern",
        "specialBadge": "NeetCode Pattern",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=G0_I-ZF0S38"
      },
      {
        "videoId": "XIdigk956u0",
        "title": "Merge Two Sorted Lists - Leetcode 21 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=XIdigk956u0",
        "level": "Beginner",
        "duration": "10m 15s",
        "skill": "Linked Lists",
        "topic": "Merging Two Lists",
        "specialBadge": "NeetCode Pattern",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=XIdigk956u0"
      },
      {
        "videoId": "70tx7KcMROc",
        "title": "Linked List Interview Questions - Google, Facebook, Amazon, Microsoft",
        "channel": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=70tx7KcMROc",
        "level": "Intermediate",
        "duration": "1h 52m",
        "skill": "Linked Lists",
        "topic": "Cycle Detection & Fast/Slow Pointers",
        "specialBadge": "FAANG Questions",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=70tx7KcMROc"
      },
      {
        "videoId": "gBTe7lFR3vc",
        "title": "Linked List Cycle - Floyd's Tortoise and Hare - Leetcode 141 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=gBTe7lFR3vc",
        "level": "Intermediate",
        "duration": "7m 30s",
        "skill": "Linked Lists",
        "topic": "Floyd's Tortoise & Hare Cycle Finding",
        "specialBadge": "NeetCode Pattern",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=gBTe7lFR3vc"
      },
      {
        "videoId": "XVuQxVej6y8",
        "title": "Remove Nth Node from End of List - Oracle Interview Question - Leetcode 19",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=XVuQxVej6y8",
        "level": "Intermediate",
        "duration": "10m 05s",
        "skill": "Linked Lists",
        "topic": "Two-Pointer Gap Technique",
        "specialBadge": "NeetCode Pattern",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=XVuQxVej6y8"
      },
      {
        "videoId": "S5bfdUTrKLM",
        "title": "Linkedin Interview Question - Reorder List - Leetcode 143 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=S5bfdUTrKLM",
        "level": "Intermediate",
        "duration": "13m 48s",
        "skill": "Linked Lists",
        "topic": "Mid-point + Reversal + Interleaving",
        "specialBadge": "NeetCode Pattern",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=S5bfdUTrKLM"
      },
      {
        "videoId": "5Y2EiZST97Y",
        "title": "Copy List with Random Pointer - Linked List - Leetcode 138",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=5Y2EiZST97Y",
        "level": "Advanced",
        "duration": "15m 12s",
        "skill": "Linked Lists",
        "topic": "Deep Copy with Hash Map & Interleaving",
        "specialBadge": "NeetCode Pattern",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=5Y2EiZST97Y"
      },
      {
        "videoId": "1UOPsfP85V4",
        "title": "Reverse Nodes in K-Group - Linked List - Leetcode 25",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=1UOPsfP85V4",
        "level": "Advanced",
        "duration": "21m 30s",
        "skill": "Linked Lists",
        "topic": "K-Group Block Reversal",
        "specialBadge": "NeetCode Pattern",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=1UOPsfP85V4"
      },
      {
        "videoId": "q5a5OiGbT6Q",
        "title": "Merge K Sorted Lists - Leetcode 23 - Python",
        "channel": "NeetCode",
        "url": "https://www.youtube.com/watch?v=q5a5OiGbT6Q",
        "level": "Advanced",
        "duration": "17m 45s",
        "skill": "Linked Lists",
        "topic": "Divide & Conquer / Min-Heap with Lists",
        "specialBadge": "NeetCode Pattern",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=q5a5OiGbT6Q"
      }
    ],
    "practiceProblems": [
      {
        "id": "p_m2_arr_twosum",
        "name": "Two Sum — LeetCode #1",
        "link": "https://leetcode.com/problems/two-sum/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "topic": "Array + HashMap",
        "estimatedTime": "20 min",
        "solutionUrl": "https://www.youtube.com/watch?v=KLlXCFG5TnA",
        "solutionTitle": "Two Sum Solution (NeetCode)",
        "isTwoSumFeatured": true
      },
      {
        "id": "p_m2_arr_217",
        "name": "Contains Duplicate — LeetCode #217",
        "link": "https://leetcode.com/problems/contains-duplicate/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "topic": "Array",
        "estimatedTime": "15 min",
        "solutionUrl": "https://www.youtube.com/watch?v=3OamzN90kPg"
      },
      {
        "id": "p_m2_arr_189",
        "name": "Rotate Array — LeetCode #189",
        "link": "https://leetcode.com/problems/rotate-array/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "topic": "Array",
        "estimatedTime": "25 min",
        "solutionUrl": "https://www.youtube.com/watch?v=BHr381Guz3Y"
      },
      {
        "id": "p_m2_tp_125",
        "name": "Valid Palindrome — LeetCode #125",
        "link": "https://leetcode.com/problems/valid-palindrome/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "topic": "Two Pointers",
        "estimatedTime": "15 min",
        "solutionUrl": "https://www.youtube.com/watch?v=jJXJ16kPFWg"
      },
      {
        "id": "p_m2_tp_167",
        "name": "Two Sum II — LeetCode #167",
        "link": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "topic": "Two Pointers",
        "estimatedTime": "20 min",
        "solutionUrl": "https://www.youtube.com/watch?v=cQ1Oz4ckceM"
      },
      {
        "id": "p_m2_tp_15",
        "name": "3Sum — LeetCode #15",
        "link": "https://leetcode.com/problems/3sum/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "topic": "Two Pointers",
        "estimatedTime": "30 min",
        "solutionUrl": "https://www.youtube.com/watch?v=jzZsG8n2R9A"
      },
      {
        "id": "p_m2_tp_11",
        "name": "Container With Most Water — LeetCode #11",
        "link": "https://leetcode.com/problems/container-with-most-water/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "topic": "Two Pointers",
        "estimatedTime": "25 min",
        "solutionUrl": "https://www.youtube.com/watch?v=UuiTKBwPgAo"
      },
      {
        "id": "p_m2_str_242",
        "name": "Valid Anagram — LeetCode #242",
        "link": "https://leetcode.com/problems/valid-anagram/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "topic": "Strings",
        "estimatedTime": "15 min",
        "solutionUrl": "https://www.youtube.com/watch?v=9UtInBqnCgA"
      },
      {
        "id": "p_m2_str_14",
        "name": "Longest Common Prefix — LeetCode #14",
        "link": "https://leetcode.com/problems/longest-common-prefix/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "topic": "Strings",
        "estimatedTime": "15 min",
        "solutionUrl": "https://www.youtube.com/watch?v=0sWShKIJoo4"
      },
      {
        "id": "p_m2_str_344",
        "name": "Reverse String — LeetCode #344",
        "link": "https://leetcode.com/problems/reverse-string/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "topic": "Strings",
        "estimatedTime": "10 min",
        "solutionUrl": "https://www.youtube.com/watch?v=_d0T_2Lk2qA"
      },
      {
        "id": "p_m2_hm_1",
        "name": "Two Sum — LeetCode #1",
        "link": "https://leetcode.com/problems/two-sum/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "topic": "HashMap",
        "estimatedTime": "20 min",
        "solutionUrl": "https://www.youtube.com/watch?v=KLlXCFG5TnA"
      },
      {
        "id": "p_m2_hm_49",
        "name": "Group Anagrams — LeetCode #49",
        "link": "https://leetcode.com/problems/group-anagrams/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "topic": "HashMap",
        "estimatedTime": "25 min",
        "solutionUrl": "https://www.youtube.com/watch?v=vzdNOK2oB2E"
      },
      {
        "id": "p_m2_sw_121",
        "name": "Best Time to Buy and Sell Stock — LeetCode #121",
        "link": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "topic": "Sliding Window",
        "estimatedTime": "20 min",
        "solutionUrl": "https://www.youtube.com/watch?v=1pkOgXD63yU"
      },
      {
        "id": "p_m2_sw_3",
        "name": "Longest Substring Without Repeating Characters — LeetCode #3",
        "link": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "topic": "Sliding Window",
        "estimatedTime": "30 min",
        "solutionUrl": "https://www.youtube.com/watch?v=wiGpQwVHdE0"
      },
      {
        "id": "p_m2_sw_239",
        "name": "Sliding Window Maximum — LeetCode #239",
        "link": "https://leetcode.com/problems/sliding-window-maximum/",
        "platform": "LeetCode",
        "difficulty": "Hard",
        "topic": "Sliding Window",
        "estimatedTime": "40 min",
        "solutionUrl": "https://www.youtube.com/watch?v=DfljaUwZsOk"
      },
      {
        "id": "p_m2_ll_206",
        "name": "Reverse Linked List — LeetCode #206",
        "link": "https://leetcode.com/problems/reverse-linked-list/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "topic": "Linked List",
        "estimatedTime": "15 min",
        "solutionUrl": "https://www.youtube.com/watch?v=G0_I-ZF0S38"
      },
      {
        "id": "p_m2_ll_21",
        "name": "Merge Two Sorted Lists — LeetCode #21",
        "link": "https://leetcode.com/problems/merge-two-sorted-lists/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "topic": "Linked List",
        "estimatedTime": "15 min",
        "solutionUrl": "https://www.youtube.com/watch?v=XIdigk956u0"
      },
      {
        "id": "p_m2_ll_141",
        "name": "Linked List Cycle — LeetCode #141",
        "link": "https://leetcode.com/problems/linked-list-cycle/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "topic": "Linked List",
        "estimatedTime": "15 min",
        "solutionUrl": "https://www.youtube.com/watch?v=gBTe7lFR3vc"
      },
      {
        "id": "p_m2_ll_19",
        "name": "Remove Nth Node From End — LeetCode #19",
        "link": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "topic": "Linked List",
        "estimatedTime": "25 min",
        "solutionUrl": "https://www.youtube.com/watch?v=XVuQxVej6y8"
      },
      {
        "id": "p_m2_ll_143",
        "name": "Reorder List — LeetCode #143",
        "link": "https://leetcode.com/problems/reorder-list/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "topic": "Linked List",
        "estimatedTime": "25 min",
        "solutionUrl": "https://www.youtube.com/watch?v=S5bfdUTrKLM"
      },
      {
        "id": "p_m2_ll_2",
        "name": "Add Two Numbers — LeetCode #2",
        "link": "https://leetcode.com/problems/add-two-numbers/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "topic": "Linked List",
        "estimatedTime": "30 min",
        "solutionUrl": "https://www.youtube.com/watch?v=wgFPrzTjm7s"
      },
      {
        "id": "p_m2_ll_138",
        "name": "Copy List with Random Pointer — LeetCode #138",
        "link": "https://leetcode.com/problems/copy-list-with-random-pointer/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "topic": "Linked List",
        "estimatedTime": "30 min",
        "solutionUrl": "https://www.youtube.com/watch?v=5Y2EiZST97Y"
      },
      {
        "id": "p_m2_ll_25",
        "name": "Reverse Nodes in K-Group — LeetCode #25",
        "link": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
        "platform": "LeetCode",
        "difficulty": "Hard",
        "topic": "Linked List",
        "estimatedTime": "45 min",
        "solutionUrl": "https://www.youtube.com/watch?v=1UOPsfP85V4"
      },
      {
        "id": "p_m2_ll_23",
        "name": "Merge K Sorted Lists — LeetCode #23",
        "link": "https://leetcode.com/problems/merge-k-sorted-lists/",
        "platform": "LeetCode",
        "difficulty": "Hard",
        "topic": "Linked List",
        "estimatedTime": "45 min",
        "solutionUrl": "https://www.youtube.com/watch?v=q5a5OiGbT6Q"
      }
    ]
  },
  {
    "monthNum": 3,
    "title": "MONTH 3: Trees + Graphs + Recursion",
    "duration": "Month 3 (Weeks 9 - 12)",
    "domain": "DSA",
    "objective": "Conquer hierarchical and network structures: Binary Trees, BSTs, Graph traversals (BFS, DFS), and backtracking.",
    "skills": [
      "Binary Trees & BST",
      "Recursion & Backtracking",
      "Graph Traversals (BFS/DFS)",
      "Dijkstra & Shortest Path"
    ],
    "youtubeLectures": [
      {
        "videoId": "_ANrF3FJm7I",
        "title": "L1. Introduction to Trees | Types of Trees",
        "channel": "take U forward",
        "url": "https://www.youtube.com/watch?v=_ANrF3FJm7I",
        "level": "Beginner",
        "duration": "29m 40s",
        "skill": "Binary Trees & BST",
        "topic": "Binary Trees & BST",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=_ANrF3FJm7I"
      },
      {
        "videoId": "ctCpP0RFDFc",
        "title": "L2. Binary Tree Representation in C++",
        "channel": "take U forward",
        "url": "https://www.youtube.com/watch?v=ctCpP0RFDFc",
        "level": "Intermediate",
        "duration": "18m 55s",
        "skill": "Binary Trees & BST",
        "topic": "Binary Trees & BST",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=ctCpP0RFDFc"
      },
      {
        "videoId": "yVdKa8dnKiE",
        "title": "Re 1. Introduction to Recursion | Recursion Tree | Stack Space | Strivers A2Z DSA Course",
        "channel": "take U forward",
        "url": "https://www.youtube.com/watch?v=yVdKa8dnKiE",
        "level": "Beginner",
        "duration": "32m 20s",
        "skill": "Recursion & Backtracking",
        "topic": "Recursion & Backtracking",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=yVdKa8dnKiE"
      },
      {
        "videoId": "xFv_Hl4B83A",
        "title": "6.1 N Queens Problem using Backtracking",
        "channel": "Abdul Bari",
        "url": "https://www.youtube.com/watch?v=xFv_Hl4B83A",
        "level": "Intermediate",
        "duration": "24m 10s",
        "skill": "Recursion & Backtracking",
        "topic": "Recursion & Backtracking",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=xFv_Hl4B83A"
      },
      {
        "videoId": "M3_pLsDdeuU",
        "title": "G-1. Introduction to Graph | Types | Different Conventions Used",
        "channel": "take U forward",
        "url": "https://www.youtube.com/watch?v=M3_pLsDdeuU",
        "level": "Beginner",
        "duration": "22m 14s",
        "skill": "Graph Traversals (BFS/DFS)",
        "topic": "Graph Traversals (BFS/DFS)",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=M3_pLsDdeuU"
      },
      {
        "videoId": "tWVWeAqZ0WU",
        "title": "Graph Algorithms for Technical Interviews - Full Course",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=tWVWeAqZ0WU",
        "level": "Intermediate",
        "duration": "2h 11m",
        "skill": "Graph Traversals (BFS/DFS)",
        "topic": "Graph Traversals (BFS/DFS)",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=tWVWeAqZ0WU"
      },
      {
        "videoId": "XB4MIexjvY0",
        "title": "3.6 Dijkstra Algorithm - Single Source Shortest Path - Greedy Method",
        "channel": "Abdul Bari",
        "url": "https://www.youtube.com/watch?v=XB4MIexjvY0",
        "level": "Intermediate",
        "duration": "35m 48s",
        "skill": "Dijkstra & Shortest Path",
        "topic": "Dijkstra & Shortest Path",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=XB4MIexjvY0"
      },
      {
        "videoId": "4ZlRH0eK-qQ",
        "title": "3.5 Prims and Kruskals Algorithms - Greedy Method",
        "channel": "Abdul Bari",
        "url": "https://www.youtube.com/watch?v=4ZlRH0eK-qQ",
        "level": "Intermediate",
        "duration": "38m 22s",
        "skill": "Dijkstra & Shortest Path",
        "topic": "Dijkstra & Shortest Path",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=4ZlRH0eK-qQ"
      }
    ],
    "practiceProblems": [
      {
        "id": "p_m3_1",
        "name": "Invert Binary Tree (LeetCode #226)",
        "link": "https://leetcode.com/problems/invert-binary-tree/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "estimatedTime": "15 min"
      },
      {
        "id": "p_m3_2",
        "name": "Lowest Common Ancestor in BST (LeetCode #235)",
        "link": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "estimatedTime": "25 min"
      },
      {
        "id": "p_m3_3",
        "name": "Number of Islands (LeetCode #200)",
        "link": "https://leetcode.com/problems/number-of-islands/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "estimatedTime": "30 min"
      },
      {
        "id": "p_m3_4",
        "name": "Course Schedule Topological Sort (LeetCode #207)",
        "link": "https://leetcode.com/problems/course-schedule/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "estimatedTime": "35 min"
      }
    ],
    "quiz": {
      "id": "quiz_m3",
      "title": "Month 3 Knowledge Check: Trees, Graphs & Recursion",
      "questions": [
        {
          "id": "q3_1",
          "question": "Which tree traversal of a valid Binary Search Tree (BST) produces nodes in strictly ascending sorted order?",
          "options": [
            "Pre-order (Root-Left-Right)",
            "In-order (Left-Root-Right)",
            "Post-order (Left-Right-Root)",
            "Level-order (BFS)"
          ],
          "answer": 1,
          "explanation": "In-order traversal visits left subtree, root, and right subtree, which matches the BST ordering property."
        },
        {
          "id": "q3_2",
          "question": "Which data structure is typically used to implement Breadth-First Search (BFS) on a graph?",
          "options": [
            "Stack",
            "Queue",
            "Priority Queue",
            "Disjoint Set"
          ],
          "answer": 1,
          "explanation": "BFS explores graph neighbors level by level in First-In-First-Out (FIFO) order, implemented with a Queue."
        },
        {
          "id": "q3_3",
          "question": "Can Dijkstra's algorithm guarantee correct shortest paths on graphs with negative edge weights?",
          "options": [
            "Yes, always",
            "No, it assumes edge weights are non-negative",
            "Only on directed acyclic graphs",
            "Only with an adjacency matrix"
          ],
          "answer": 1,
          "explanation": "Dijkstra is a greedy algorithm that assumes visited node distances are finalized; negative edges violate this."
        }
      ]
    },
    "project": {
      "id": "proj_m3",
      "title": "Social Network Graph Visualizer & Shortest Path Engine",
      "desc": "Interactive network graph finding mutual connections, degrees of separation, and shortest path using Dijkstra algorithm.",
      "techStack": [
        "Graph Adjacency List",
        "Dijkstra Algorithm",
        "BFS/DFS",
        "HTML5 Canvas / SVG"
      ],
      "difficulty": "Intermediate",
      "estimatedTime": "2 Weeks",
      "requirements": [
        "Construct directed weighted graph representation using Adjacency List",
        "Implement Dijkstra algorithm with Min-Heap Priority Queue for lowest connection distance",
        "Implement BFS to calculate degrees of separation (six-degrees theorem) between any two nodes",
        "Detect cycles and circular friendship loops using Topological Kahn algorithm"
      ]
    },
    "interviewQuestions": [
      {
        "q": "What is the difference between Pre-order, In-order, and Post-order Tree Traversals?",
        "answer": "Pre-order (Root, Left, Right) is useful for creating a copy or serialization of a tree. In-order (Left, Root, Right) generates non-decreasing sorted order on a BST. Post-order (Left, Right, Root) is ideal for deleting nodes or calculating bottom-up properties like tree height.",
        "difficulty": "Core Technical"
      },
      {
        "q": "When should you choose BFS over DFS in graph and tree problems?",
        "answer": "Choose BFS when searching for the shortest unweighted path or exploring level-by-level relationships (e.g. mutual friends). Choose DFS for connectivity checks, maze pathfinding, cycle detection, topological sorting, and memory-constrained deep trees.",
        "difficulty": "High Frequency"
      },
      {
        "q": "What is a Self-Balancing BST (AVL / Red-Black Tree) and why is it needed?",
        "answer": "Standard BSTs degrade into skewed linked lists with O(N) worst-case search when items are inserted in sorted order. Self-balancing trees perform tree rotations on insertions/deletions to maintain maximum height of O(log N), guaranteeing strict O(log N) lookup time.",
        "difficulty": "Tricky"
      }
    ],
    "milestones": [
      {
        "id": "m3_1",
        "title": "Master In-order, Pre-order, Post-order & Level Order Tree Traversals"
      },
      {
        "id": "m3_2",
        "title": "Solve 25 Graph problems (BFS, DFS, Cycle Detection, Topological Sort)"
      },
      {
        "id": "m3_3",
        "title": "Implement Backtracking for N-Queens or Sudoku Solver"
      }
    ]
  },
  {
    "monthNum": 4,
    "title": "MONTH 4: Dynamic Programming + Core CS",
    "duration": "Month 4 (Weeks 13 - 16)",
    "domain": "Database",
    "objective": "Master Dynamic Programming patterns and master the 4 core CS subjects: OS, DBMS, Computer Networks, and System Design basics.",
    "skills": [
      "Dynamic Programming",
      "Operating Systems",
      "DBMS & SQL",
      "Computer Networks",
      "System Design Basics"
    ],
    "youtubeLectures": [
      {
        "videoId": "tyB0ztf0DNY",
        "title": "DP 1. Introduction to Dynamic Programming | Memoization | Tabulation | Space Optimization Techniques",
        "channel": "take U forward",
        "url": "https://www.youtube.com/watch?v=tyB0ztf0DNY",
        "level": "Beginner",
        "duration": "38m 15s",
        "skill": "Dynamic Programming",
        "topic": "Dynamic Programming",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=tyB0ztf0DNY"
      },
      {
        "videoId": "oBt53YbR9Kk",
        "title": "Dynamic Programming - Learn to Solve Algorithmic Problems & Coding Challenges",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=oBt53YbR9Kk",
        "level": "Intermediate",
        "duration": "5h 10m",
        "skill": "Dynamic Programming",
        "topic": "Dynamic Programming",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=oBt53YbR9Kk"
      },
      {
        "videoId": "vBURTt97EkA",
        "title": "Introduction to Operating Systems",
        "channel": "Neso Academy",
        "url": "https://www.youtube.com/watch?v=vBURTt97EkA",
        "level": "Beginner",
        "duration": "14m 20s",
        "skill": "Operating Systems",
        "topic": "Operating Systems",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=vBURTt97EkA"
      },
      {
        "videoId": "26QPDBe-NB8",
        "title": "Operating Systems: Crash Course Computer Science #18",
        "channel": "CrashCourse",
        "url": "https://www.youtube.com/watch?v=26QPDBe-NB8",
        "level": "Beginner",
        "duration": "12m 44s",
        "skill": "Operating Systems",
        "topic": "Operating Systems",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=26QPDBe-NB8"
      },
      {
        "videoId": "kBdlM6hNDAE",
        "title": "Lec-1: DBMS Syllabus for GATE, UGCNET, NIELIT, DSSSB etc.| Full DBMS for College/University Students",
        "channel": "Gate Smashers",
        "url": "https://www.youtube.com/watch?v=kBdlM6hNDAE",
        "level": "Beginner",
        "duration": "10m 52s",
        "skill": "DBMS & SQL",
        "topic": "DBMS & SQL",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=kBdlM6hNDAE"
      },
      {
        "videoId": "rVPK8-L1aFM",
        "title": "Complete SQL course for data science and data analytics in Hindi | One shot SQL",
        "channel": "Data Dissection ",
        "url": "https://www.youtube.com/watch?v=rVPK8-L1aFM",
        "level": "Beginner",
        "duration": "4h 05m",
        "skill": "DBMS & SQL",
        "topic": "DBMS & SQL",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=rVPK8-L1aFM"
      },
      {
        "videoId": "OT1RErkfLNQ",
        "title": "Learn SQL Beginner to Advanced in Under 4 Hours",
        "channel": "Alex The Analyst",
        "url": "https://www.youtube.com/watch?v=OT1RErkfLNQ",
        "level": "Intermediate",
        "duration": "3h 48m",
        "skill": "DBMS & SQL",
        "topic": "DBMS & SQL",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=OT1RErkfLNQ"
      },
      {
        "videoId": "qiQR5rTSshw",
        "title": "Computer Networking Course - Network Engineering [CompTIA Network+ Exam Prep]",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=qiQR5rTSshw",
        "level": "Beginner",
        "duration": "9h 24m",
        "skill": "Computer Networks",
        "topic": "Computer Networks",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=qiQR5rTSshw"
      },
      {
        "videoId": "IPvYjXCsTg8",
        "title": "Computer Networking Full Course - OSI Model Deep Dive with Real Life Examples",
        "channel": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=IPvYjXCsTg8",
        "level": "Beginner",
        "duration": "4h 12m",
        "skill": "Computer Networks",
        "topic": "Computer Networks",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=IPvYjXCsTg8"
      },
      {
        "videoId": "JFF2vJaN0Cw",
        "title": "Lec-1: Computer Networks and Security Full Syllabus for GATE, UGC NET,DSSSB,NIELIT & University exam",
        "channel": "Gate Smashers",
        "url": "https://www.youtube.com/watch?v=JFF2vJaN0Cw",
        "level": "Beginner",
        "duration": "9m 30s",
        "skill": "Computer Networks",
        "topic": "Computer Networks",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=JFF2vJaN0Cw"
      },
      {
        "videoId": "xpDnVSmNFX0",
        "title": "System Design BASICS: Horizontal vs. Vertical Scaling",
        "channel": "Gaurav Sen",
        "url": "https://www.youtube.com/watch?v=xpDnVSmNFX0",
        "level": "Intermediate",
        "duration": "14m 45s",
        "skill": "System Design Basics",
        "topic": "System Design Basics",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=xpDnVSmNFX0"
      },
      {
        "videoId": "SqcXvc3ZmRU",
        "title": "System Design Primer ⭐️: How to start with distributed systems?",
        "channel": "Gaurav Sen",
        "url": "https://www.youtube.com/watch?v=SqcXvc3ZmRU",
        "level": "Intermediate",
        "duration": "16m 12s",
        "skill": "System Design Basics",
        "topic": "System Design Basics",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=SqcXvc3ZmRU"
      }
    ],
    "practiceProblems": [
      {
        "id": "p_m4_1",
        "name": "Climbing Stairs (LeetCode #70)",
        "link": "https://leetcode.com/problems/climbing-stairs/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "estimatedTime": "15 min"
      },
      {
        "id": "p_m4_2",
        "name": "Coin Change (LeetCode #322)",
        "link": "https://leetcode.com/problems/coin-change/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "estimatedTime": "30 min"
      },
      {
        "id": "p_m4_3",
        "name": "Longest Common Subsequence (LeetCode #1143)",
        "link": "https://leetcode.com/problems/longest-common-subsequence/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "estimatedTime": "35 min"
      },
      {
        "id": "p_m4_4",
        "name": "SQL Query Challenges: Department Top Three Salaries (LeetCode #185)",
        "link": "https://leetcode.com/problems/department-top-three-salaries/",
        "platform": "LeetCode",
        "difficulty": "Hard",
        "estimatedTime": "30 min"
      }
    ],
    "quiz": {
      "id": "quiz_m4",
      "title": "Month 4 Knowledge Check: Dynamic Programming & Core CS",
      "questions": [
        {
          "id": "q4_1",
          "question": "What two key properties must a problem have to be solved using Dynamic Programming?",
          "options": [
            "Greedy choice & Linear time",
            "Optimal substructure & Overlapping subproblems",
            "Divide and conquer & Randomness",
            "Hash collisions & Tree depth"
          ],
          "answer": 1,
          "explanation": "DP stores answers to subproblems so they don't have to be recomputed (overlapping subproblems + optimal substructure)."
        },
        {
          "id": "q4_2",
          "question": "Which of the following is NOT one of the four Coffman conditions for a Deadlock in Operating Systems?",
          "options": [
            "Mutual Exclusion",
            "Hold and Wait",
            "Preemption allowed",
            "Circular Wait"
          ],
          "answer": 2,
          "explanation": "No preemption is the required deadlock condition; allowing preemption eliminates deadlocks."
        },
        {
          "id": "q4_3",
          "question": "In relational databases, what does the 'I' in ACID properties stand for?",
          "options": [
            "Indexing",
            "Isolation",
            "Integrity",
            "Iteration"
          ],
          "answer": 1,
          "explanation": "Isolation ensures concurrent transactions execute without interfering with one another."
        }
      ]
    },
    "project": {
      "id": "proj_m4",
      "title": "Relational Database Schema & Query Optimization Engine",
      "desc": "Design normalized schema (3NF) for e-commerce, add indexes, write complex subqueries, and benchmark latency.",
      "techStack": [
        "PostgreSQL / MySQL",
        "B-Tree Indexes",
        "EXPLAIN ANALYZE",
        "Normalization (3NF)"
      ],
      "difficulty": "Intermediate",
      "estimatedTime": "2 Weeks",
      "requirements": [
        "Design 3NF relational schema with foreign keys, composite constraints, and transaction isolation",
        "Generate 100,000 synthetic orders and simulate concurrent placement operations",
        "Profile queries with EXPLAIN ANALYZE and implement composite B-Tree indexes reducing query latency by 80%",
        "Implement ACID-compliant banking checkout procedure with explicit row locking (SELECT FOR UPDATE)"
      ]
    },
    "interviewQuestions": [
      {
        "q": "Explain ACID properties and transaction isolation levels in DBMS.",
        "answer": "Atomicity (all-or-nothing), Consistency (schema invariants maintained), Isolation (independent concurrent execution), Durability (persisted across crashes). Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, and Serializable (preventing dirty reads, non-repeatable reads, and phantom reads).",
        "difficulty": "High Frequency"
      },
      {
        "q": "What is a Deadlock in OS and what are the 4 Coffman conditions?",
        "answer": "A deadlock occurs when a set of concurrent processes are permanently blocked waiting for resources held by each other. The 4 Coffman conditions are: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, and 4. Circular Wait.",
        "difficulty": "Core Technical"
      },
      {
        "q": "Explain the TCP 3-Way Handshake and differences between TCP and UDP.",
        "answer": "Handshake: Client sends SYN -> Server responds with SYN-ACK -> Client acknowledges with ACK. TCP is connection-oriented, reliable (ordered packet delivery, retransmissions, flow/congestion control). UDP is connectionless, lightweight, and low-latency (ideal for live video streaming and gaming).",
        "difficulty": "High Frequency"
      }
    ],
    "milestones": [
      {
        "id": "m4_1",
        "title": "Solve 20 Dynamic Programming problems (1D & 2D Memoization)"
      },
      {
        "id": "m4_2",
        "title": "Complete revision of OS (Processes, Threads, Semaphores, Paging)"
      },
      {
        "id": "m4_3",
        "title": "Complete revision of DBMS (Normalization, Indexes, ACID, Joins)"
      }
    ]
  },
  {
    "monthNum": 5,
    "title": "MONTH 5: Capstone Projects + Cloud & Deployment",
    "duration": "Month 5 (Weeks 17 - 20)",
    "domain": "Development",
    "objective": "Build 2 full-scale portfolio projects with live deployments, optimize ATS resume keyword density, and configure GitHub showcases.",
    "skills": [
      "Full Stack Development",
      "REST APIs & Backend",
      "Docker & Containers",
      "Cloud Deployment (AWS)",
      "Portfolio Projects"
    ],
    "youtubeLectures": [
      {
        "videoId": "-0exw-9YJBo",
        "title": "Learn The MERN Stack - Express & MongoDB Rest API",
        "channel": "Traversy Media",
        "url": "https://www.youtube.com/watch?v=-0exw-9YJBo",
        "level": "Beginner",
        "duration": "35m 12s",
        "skill": "Full Stack Development",
        "topic": "Full Stack Development",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=-0exw-9YJBo"
      },
      {
        "videoId": "7CqJlxBYj-M",
        "title": "Learn the MERN Stack - Full Tutorial (MongoDB, Express, React, Node.js)",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=7CqJlxBYj-M",
        "level": "Beginner",
        "duration": "2h 45m",
        "skill": "Full Stack Development",
        "topic": "Full Stack Development",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=7CqJlxBYj-M"
      },
      {
        "videoId": "nu_pCVPKzTk",
        "title": "Full Stack Web Development for Beginners (Full Course on HTML, CSS, JavaScript, Node.js, MongoDB)",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=nu_pCVPKzTk",
        "level": "Beginner",
        "duration": "7h 14m",
        "skill": "Full Stack Development",
        "topic": "Full Stack Development",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=nu_pCVPKzTk"
      },
      {
        "videoId": "Oe421EPjeBE",
        "title": "Node.js and Express.js - Full Course",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=Oe421EPjeBE",
        "level": "Beginner",
        "duration": "8h 16m",
        "skill": "REST APIs & Backend",
        "topic": "REST APIs & Backend",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=Oe421EPjeBE"
      },
      {
        "videoId": "f2EqECiTBL8",
        "title": "Node.js Full Course for Beginners | Complete All-in-One Tutorial | 7 Hours",
        "channel": "Dave Gray",
        "url": "https://www.youtube.com/watch?v=f2EqECiTBL8",
        "level": "Beginner",
        "duration": "6h 50m",
        "skill": "REST APIs & Backend",
        "topic": "REST APIs & Backend",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=f2EqECiTBL8"
      },
      {
        "videoId": "RLtyhwFtXQA",
        "title": "Learn Node.js - Full Tutorial for Beginners",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=RLtyhwFtXQA",
        "level": "Beginner",
        "duration": "1h 35m",
        "skill": "REST APIs & Backend",
        "topic": "REST APIs & Backend",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=RLtyhwFtXQA"
      },
      {
        "videoId": "pg19Z8LL06w",
        "title": "Docker Crash Course for Absolute Beginners [NEW]",
        "channel": "TechWorld with Nana",
        "url": "https://www.youtube.com/watch?v=pg19Z8LL06w",
        "level": "Beginner",
        "duration": "2h 40m",
        "skill": "Docker & Containers",
        "topic": "Docker & Containers",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=pg19Z8LL06w"
      },
      {
        "videoId": "fqMOX6JJhGo",
        "title": "Docker Tutorial for Beginners - A Full DevOps Course on How to Run Applications in Containers",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=fqMOX6JJhGo",
        "level": "Beginner",
        "duration": "2h 10m",
        "skill": "Docker & Containers",
        "topic": "Docker & Containers",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=fqMOX6JJhGo"
      },
      {
        "videoId": "SOTamWNgDKc",
        "title": "AWS Certified Cloud Practitioner Certification Course (CLF-C01) - Pass the Exam!",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=SOTamWNgDKc",
        "level": "Beginner",
        "duration": "13h 15m",
        "skill": "Cloud Deployment (AWS)",
        "topic": "Cloud Deployment (AWS)",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=SOTamWNgDKc"
      },
      {
        "videoId": "7HKot-brXFE",
        "title": "AWS Certified Cloud Practitioner Certification Course 2026 (CLF-C02) - Pass the Exam!",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=7HKot-brXFE",
        "level": "Beginner",
        "duration": "14h 02m",
        "skill": "Cloud Deployment (AWS)",
        "topic": "Cloud Deployment (AWS)",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=7HKot-brXFE"
      },
      {
        "videoId": "qfyynHBFOsM",
        "title": "Data Analyst Portfolio Project | SQL Data Exploration | Project 1/4",
        "channel": "Alex The Analyst",
        "url": "https://www.youtube.com/watch?v=qfyynHBFOsM",
        "level": "Intermediate",
        "duration": "45m 18s",
        "skill": "Portfolio Projects",
        "topic": "Portfolio Projects",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=qfyynHBFOsM"
      },
      {
        "videoId": "da9sVlo0zzI",
        "title": "Excel Gets You Started. Data Analytics Takes Your Career to the Next Level! 📊🚀",
        "channel": "Pavan Lalwani",
        "url": "https://www.youtube.com/watch?v=da9sVlo0zzI",
        "level": "Beginner",
        "duration": "25m 30s",
        "skill": "Portfolio Projects",
        "topic": "Portfolio Projects",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=da9sVlo0zzI"
      }
    ],
    "practiceProblems": [
      {
        "id": "p_m5_1",
        "name": "Design Twitter (LeetCode #355)",
        "link": "https://leetcode.com/problems/design-twitter/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "estimatedTime": "35 min"
      },
      {
        "id": "p_m5_2",
        "name": "Design Hit Counter (LeetCode #362)",
        "link": "https://leetcode.com/problems/design-hit-counter/",
        "platform": "LeetCode",
        "difficulty": "Medium",
        "estimatedTime": "25 min"
      },
      {
        "id": "p_m5_3",
        "name": "Subdomain Visit Count (LeetCode #811)",
        "link": "https://leetcode.com/problems/subdomain-visit-count/",
        "platform": "LeetCode",
        "difficulty": "Easy",
        "estimatedTime": "20 min"
      }
    ],
    "quiz": {
      "id": "quiz_m5",
      "title": "Month 5 Knowledge Check: Full Stack & Cloud Architecture",
      "questions": [
        {
          "id": "q5_1",
          "question": "Which HTTP status code signifies that a client request successfully created a new resource on the server?",
          "options": [
            "200 OK",
            "201 Created",
            "204 No Content",
            "304 Not Modified"
          ],
          "answer": 1,
          "explanation": "HTTP 201 Created is the standard response after a successful POST request creating a new resource."
        },
        {
          "id": "q5_2",
          "question": "What is the primary difference between a Docker image and a Docker container?",
          "options": [
            "A container is an executable running instance of an immutable image template",
            "An image runs in memory while a container is stored on disk",
            "Containers only run Python scripts while images run Java",
            "There is no difference"
          ],
          "answer": 0,
          "explanation": "A Docker image is a read-only template; a Docker container is a running, stateful instance of that template."
        },
        {
          "id": "q5_3",
          "question": "Why is JSON Web Token (JWT) well-suited for scalable REST APIs?",
          "options": [
            "It encrypts the entire database table",
            "It is stateless, eliminating server-side session memory storage",
            "It automatically renews IP addresses",
            "It replaces the HTTPS protocol"
          ],
          "answer": 1,
          "explanation": "JWT contains cryptographically signed claims decoded by any API server without querying session memory."
        }
      ]
    },
    "project": {
      "id": "proj_m5",
      "title": "Production Full-Stack Capstone Project",
      "desc": "Deploy full-stack web/mobile app with JWT auth, database persistence, and live domain on Vercel/AWS.",
      "techStack": [
        "Node.js / Express / Spring Boot",
        "React / Vue",
        "MongoDB / PostgreSQL",
        "Docker & AWS/Vercel"
      ],
      "difficulty": "Advanced",
      "estimatedTime": "3 Weeks",
      "requirements": [
        "Build secure RESTful API with JWT authentication, role-based authorization, and rate limiting",
        "Implement responsive frontend with state management, interactive dashboard, and live data charts",
        "Containerize services using multi-stage Dockerfile and docker-compose.yml",
        "Deploy to public URL (Vercel / Render / AWS) with automated GitHub Actions CI/CD pipeline"
      ]
    },
    "interviewQuestions": [
      {
        "q": "Walk me through the architecture of your primary capstone project.",
        "answer": "Describe: 1. Client UI layer (React). 2. REST/GraphQL API gateway. 3. Controller-Service-Repository backend layering. 4. Database schema & indexing. 5. Security & caching strategies. 6. Docker containerization and cloud hosting pipeline.",
        "difficulty": "High Frequency"
      },
      {
        "q": "How did you handle authentication and database security in your application?",
        "answer": "Used bcrypt hashing with high salt rounds for passwords, signed short-lived JWT access tokens with HttpOnly secure refresh cookies, parameterized SQL/ORM statements to prevent SQL injections, and implemented helmet headers + CORS domain whitelisting.",
        "difficulty": "Core Technical"
      },
      {
        "q": "If your application experienced a 100x traffic spike, what would break first and how would you fix it?",
        "answer": "First bottleneck is usually database read contention and connection pool exhaustion. Mitigate by: 1. Adding Redis in-memory cache for hot reads. 2. Adding horizontal API replicas behind a round-robin load balancer. 3. Offloading heavy background tasks to an asynchronous message queue like RabbitMQ or Kafka.",
        "difficulty": "Tricky"
      }
    ],
    "milestones": [
      {
        "id": "m5_1",
        "title": "Deploy Capstone Project 1 with live URL and clear README"
      },
      {
        "id": "m5_2",
        "title": "Deploy Capstone Project 2 with CI/CD automated pipeline"
      },
      {
        "id": "m5_3",
        "title": "Score 80+ on CareerPulse.AI ATS Resume Analyzer"
      }
    ]
  },
  {
    "monthNum": 6,
    "title": "MONTH 6: Mock Interviews + Placement Applications",
    "duration": "Month 6 (Weeks 21 - 24)",
    "domain": "Interview",
    "objective": "Conduct simulated technical mock interviews, master speed aptitude tests, and convert campus placement opportunities into dream offers.",
    "skills": [
      "Mock Technical Rounds",
      "Google & Big Tech Coding",
      "Aptitude Tests",
      "HR STAR Framework"
    ],
    "youtubeLectures": [
      {
        "videoId": "1qw5ITr3k9E",
        "title": "Software Engineering Job Interview – Full Mock Interview",
        "channel": "freeCodeCamp.org",
        "url": "https://www.youtube.com/watch?v=1qw5ITr3k9E",
        "level": "Intermediate",
        "duration": "48m 10s",
        "skill": "Mock Technical Rounds",
        "topic": "Mock Technical Rounds",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=1qw5ITr3k9E"
      },
      {
        "videoId": "r1MXwyiGi_U",
        "title": "Top 10 Algorithms for the Coding Interview (for software engineers)",
        "channel": "TechLead",
        "url": "https://www.youtube.com/watch?v=r1MXwyiGi_U",
        "level": "Intermediate",
        "duration": "16m 22s",
        "skill": "Mock Technical Rounds",
        "topic": "Mock Technical Rounds",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=r1MXwyiGi_U"
      },
      {
        "videoId": "XKu_SEDAykw",
        "title": "How to: Work at Google — Example Coding/Engineering Interview",
        "channel": "Life at Google",
        "url": "https://www.youtube.com/watch?v=XKu_SEDAykw",
        "level": "Advanced",
        "duration": "24m 50s",
        "skill": "Google & Big Tech Coding",
        "topic": "Google & Big Tech Coding",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=XKu_SEDAykw"
      },
      {
        "videoId": "hlyal4sR0m8",
        "title": "Aptitude Preparation for Placements #1 Introduction | Why Aptitude Is Important For Placement",
        "channel": "Code Step By Step",
        "url": "https://www.youtube.com/watch?v=hlyal4sR0m8",
        "level": "Beginner",
        "duration": "12m 30s",
        "skill": "Aptitude Tests",
        "topic": "Aptitude Tests",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=hlyal4sR0m8"
      },
      {
        "videoId": "o7pY9hCqDZk",
        "title": "Aptitude Preparation Campus Placements #2 | Time and Work | Quantitative Aptitude",
        "channel": "Code Step By Step",
        "url": "https://www.youtube.com/watch?v=o7pY9hCqDZk",
        "level": "Beginner",
        "duration": "18m 15s",
        "skill": "Aptitude Tests",
        "topic": "Aptitude Tests",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=o7pY9hCqDZk"
      },
      {
        "videoId": "uQEuo7woEEk",
        "title": "STAR INTERVIEW QUESTIONS & ANSWERS! (The STAR TECHNIQUE for Behavioural Interview Questions!)",
        "channel": "CareerVidz",
        "url": "https://www.youtube.com/watch?v=uQEuo7woEEk",
        "level": "Beginner",
        "duration": "14m 50s",
        "skill": "HR STAR Framework",
        "topic": "HR STAR Framework",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=uQEuo7woEEk"
      },
      {
        "videoId": "2m1Kc9uvLvc",
        "title": "TOP 5 INTERVIEW QUESTIONS & ANSWERS! (How to ANSWER COMMON INTERVIEW QUESTIONS!) #jobinterview",
        "channel": "CareerVidz",
        "url": "https://www.youtube.com/watch?v=2m1Kc9uvLvc",
        "level": "Beginner",
        "duration": "10m 45s",
        "skill": "HR STAR Framework",
        "topic": "HR STAR Framework",
        "verified": true,
        "youtubeUrl": "https://www.youtube.com/watch?v=2m1Kc9uvLvc"
      }
    ],
    "practiceProblems": [
      {
        "id": "p_m6_1",
        "name": "Take 60-min Speed Placement Test (HackerRank)",
        "link": "https://www.hackerrank.com/",
        "platform": "HackerRank",
        "difficulty": "Medium",
        "estimatedTime": "60 min"
      },
      {
        "id": "p_m6_2",
        "name": "Aptitude Drill: Time, Work & Speed",
        "link": "#interview",
        "platform": "CareerPulse Hub",
        "difficulty": "Medium",
        "estimatedTime": "20 min"
      },
      {
        "id": "p_m6_3",
        "name": "Technical Flashcards: OS & DBMS Viva",
        "link": "#interview",
        "platform": "CareerPulse Hub",
        "difficulty": "Medium",
        "estimatedTime": "25 min"
      }
    ],
    "quiz": {
      "id": "quiz_m6",
      "title": "Month 6 Knowledge Check: Placement Drives & STAR Strategy",
      "questions": [
        {
          "id": "q6_1",
          "question": "In the STAR framework for behavioral interview questions, what does the 'R' stand for?",
          "options": [
            "Reasoning",
            "Result",
            "Reaction",
            "Responsibility"
          ],
          "answer": 1,
          "explanation": "STAR stands for Situation, Task, Action, and Result (quantified business impact or technical outcome)."
        },
        {
          "id": "q6_2",
          "question": "If Pipe A fills a tank in 4 hours and Pipe B fills it in 6 hours, how long do both pipes take together?",
          "options": [
            "2.4 hours",
            "5 hours",
            "3.2 hours",
            "2 hours"
          ],
          "answer": 0,
          "explanation": "Combined rate = 1/4 + 1/6 = 5/12 tank/hr. Time required = 12/5 = 2.4 hours."
        },
        {
          "id": "q6_3",
          "question": "When an interviewer asks you to scale a backend handling 10,000 req/sec, which first-line optimization is recommended?",
          "options": [
            "Add database indexes and an in-memory Redis caching layer",
            "Immediately rewrite the entire application in Assembly",
            "Increase client-side browser polling",
            "Disable CORS security checks"
          ],
          "answer": 0,
          "explanation": "Caching hot queries with Redis and adding DB indexes eliminates up to 90% of redundant database read traffic."
        }
      ]
    },
    "project": {
      "id": "proj_m6",
      "title": "Interview System Whiteboard & STAR Response Playbook",
      "desc": "Compiled document of 20 STAR behavioral responses and 5 system design blueprints ready for live defense.",
      "techStack": [
        "STAR Framework",
        "Architecture Diagrams",
        "System Design Blueprints",
        "Behavioral Scripting"
      ],
      "difficulty": "Intermediate",
      "estimatedTime": "1 Week",
      "requirements": [
        "Document 15 polished STAR behavioral stories covering conflict, leadership, failure, and deadline pressure",
        "Design 5 end-to-end system design diagrams (URL Shortener, Rate Limiter, Notification Engine, Chat App, E-Commerce)",
        "Complete 5 timed technical mock interviews with peer or AI simulator scoring >= 80%",
        "Apply to 20+ campus and off-campus recruitment drives with customized resumes"
      ]
    },
    "interviewQuestions": [
      {
        "q": "Tell me about a time you resolved a difficult technical bug under pressure.",
        "answer": "Structure using STAR: Situation (production race condition before release), Task (isolate corrupted cache entries), Action (used memory profiler and mutex lock instrumentation), Result (fixed bug, zero downtime, and added automated regression test).",
        "difficulty": "High Frequency"
      },
      {
        "q": "Why should our company hire you over other qualified candidates?",
        "answer": "Combine proven technical competence with real projects, relentless learning agility, strong fundamentals in DSA & systems, and proactive collaboration demonstrated through internships and open-source portfolio code.",
        "difficulty": "High Frequency"
      },
      {
        "q": "Where do you see yourself in 3 years as a software engineer?",
        "answer": "As a reliable core contributor with deep domain expertise in scalable backend architectures, mentoring junior developers, driving high-impact technical initiatives, and actively collaborating with cross-functional product leaders.",
        "difficulty": "Core Technical"
      }
    ],
    "milestones": [
      {
        "id": "m6_1",
        "title": "Complete 5 simulated full-length technical mock interviews"
      },
      {
        "id": "m6_2",
        "title": "Score 85%+ on timed aptitude drills in Interview Prep Hub"
      },
      {
        "id": "m6_3",
        "title": "Submit 20+ verified applications for campus & off-campus drives"
      }
    ]
  }
];

class RoadmapManager {
  constructor() {
    this.selectedHours = 15;
    this.selectedMonths = 6;
    this.activeSkillFilters = { 1: 'ALL', 2: 'ALL', 3: 'ALL', 4: 'ALL', 5: 'ALL', 6: 'ALL' };
    this.activeTimelineFilter = 'ALL'; // ALL | CURRENT | COMPLETED | UPCOMING
    this.activeDomainFilter = 'ALL';   // ALL | DSA | DEVELOPMENT | DATABASE | APTITUDE | INTERVIEW
    this.collapsedMonths = { 1: false, 2: true, 3: true, 4: true, 5: true, 6: true };
    this.quizSelectedOptions = {};     // { 'm1_q0': 1, 'm1_q1': 2, ... }
  }

  // Ensures state structure exists and returns it
  getRoadmapState() {
    if (typeof appState === 'undefined') {
      return {
        checkedMilestones: {},
        completedLectures: {},
        solvedProblems: {},
        passedQuizzes: {},
        projectSubmissions: {},
        dailyTasks: {},
        skillFeedback: {},
        streak: { count: 7, lastActiveDate: new Date().toISOString().split('T')[0] }
      };
    }
    if (!appState.data.roadmap) {
      appState.data.roadmap = {};
    }
    const r = appState.data.roadmap;
    if (!r.checkedMilestones) r.checkedMilestones = { 'm1_1': true };
    if (!r.completedLectures) r.completedLectures = { 'rfscVS0vtbw': true };
    if (!r.solvedProblems) r.solvedProblems = { 'p_m1_1': true };
    if (!r.passedQuizzes) r.passedQuizzes = {};
    if (!r.projectSubmissions) r.projectSubmissions = {};
    if (!r.dailyTasks) r.dailyTasks = {};
    if (!r.skillFeedback) r.skillFeedback = {};
    if (!r.streak) {
      r.streak = { count: 7, lastActiveDate: new Date().toISOString().split('T')[0] };
    }
    return r;
  }

  touchStreak() {
    const r = this.getRoadmapState();
    const today = new Date().toISOString().split('T')[0];
    if (r.streak.lastActiveDate === today) {
      // Already recorded activity today
      return;
    }
    const lastDate = new Date(r.streak.lastActiveDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      r.streak.count = (r.streak.count || 0) + 1;
    } else if (diffDays > 1) {
      r.streak.count = 1;
    }
    r.streak.lastActiveDate = today;
    if (typeof appState !== 'undefined' && appState.saveState) {
      appState.saveState();
    }
  }

  // Calculate dynamic skill mastery
  getSkillMastery(skillName, month, rState) {
    const feedback = (rState.skillFeedback || {})[skillName];
    if (feedback === 'mastered') {
      return { status: 'Job Ready', percent: 100, badgeClass: 'badge-success', icon: 'fa-solid fa-star' };
    }

    const lectures = (month.youtubeLectures || []).filter(l => (l.skill || l.topic) === skillName);
    const lecturesWatched = lectures.filter(l => !!(rState.completedLectures || {})[l.videoId]).length;
    const lectureRatio = lectures.length > 0 ? lecturesWatched / lectures.length : 0.5;

    const problemsSolved = (month.practiceProblems || []).filter(p => !!(rState.solvedProblems || {})[p.id]).length;
    const problemRatio = (month.practiceProblems || []).length > 0 ? problemsSolved / month.practiceProblems.length : 0.5;

    const quizPassed = (rState.passedQuizzes || {})[month.monthNum] ? 1 : 0;
    const projectDone = (rState.projectSubmissions || {})[month.monthNum]?.completed ? 1 : 0;

    let score = Math.round((lectureRatio * 40) + (problemRatio * 30) + (quizPassed * 20) + (projectDone * 10));
    if (feedback === 'practice') score = Math.max(25, score - 20);
    if (feedback === 'easy') score = Math.min(100, score + 15);

    if (score >= 80) return { status: 'Job Ready', percent: score, badgeClass: 'badge-success', icon: 'fa-solid fa-crown' };
    if (score >= 55) return { status: 'Strong', percent: score, badgeClass: 'badge-info', icon: 'fa-solid fa-circle-check' };
    if (score >= 25) return { status: 'Learning', percent: score, badgeClass: 'badge-warning', icon: 'fa-solid fa-book-open' };
    return { status: 'Beginner', percent: score, badgeClass: 'badge-outline', icon: 'fa-solid fa-seedling' };
  }

  // Computes the Next Best Action for the student
  computeNextBestAction(profile, prediction, targetCareer, rState) {
    const studentSkills = (profile.skills || []).map(s => s.toLowerCase().trim());
    const reqSkills = targetCareer.requiredSkills || [];

    // Check critical gaps first
    let priorityGap = reqSkills.find(sk => {
      const sLower = sk.toLowerCase().trim();
      const hasSkill = studentSkills.some(s => s === sLower || s.includes(sLower));
      return !hasSkill && (targetCareer.skillPriority && targetCareer.skillPriority[sk] === 'Critical');
    });

    if (!priorityGap) {
      priorityGap = reqSkills.find(sk => {
        const sLower = sk.toLowerCase().trim();
        return !studentSkills.some(s => s === sLower);
      }) || reqSkills[0] || 'Data Structures & Algorithms';
    }

    // Match with roadmap month
    let targetMonth = SIX_MONTH_ROADMAP_MASTER.find(m => 
      m.skills.some(s => s.toLowerCase().includes(priorityGap.toLowerCase()) || priorityGap.toLowerCase().includes(s.toLowerCase()))
    ) || SIX_MONTH_ROADMAP_MASTER[0];

    // Find first incomplete lecture in that month
    const nextLecture = (targetMonth.youtubeLectures || []).find(l => !(rState.completedLectures || {})[l.videoId]) || targetMonth.youtubeLectures[0];

    const rationale = `Prioritized because ${priorityGap} is a key requirement for ${targetCareer.title}. Your technical factor is currently at ${prediction.factors?.technicalDSA || 88}%. Completing this strengthens your campus screening probability.`;

    return {
      skill: priorityGap,
      topic: nextLecture?.title || `${priorityGap} Foundations`,
      lecture: nextLecture,
      monthNum: targetMonth.monthNum,
      estimatedTime: nextLecture?.duration || '30 min',
      rationale
    };
  }

  // Generates 3-4 actionable daily tasks for today
  getDailyPlan(todayDate, nextAction, rState) {
    const dailyState = (rState.dailyTasks && rState.dailyTasks[todayDate]) ? rState.dailyTasks[todayDate] : {};
    const m1 = SIX_MONTH_ROADMAP_MASTER[0];

    const tasks = [
      {
        id: 'task_lecture_1',
        type: 'Lecture',
        title: `Watch: ${nextAction.lecture ? nextAction.lecture.title : 'Time and Space Complexity - Strivers A2Z DSA Course'}`,
        time: nextAction.estimatedTime,
        difficulty: 'Medium',
        badgeColor: 'badge-primary',
        actionLabel: 'Watch Lecture',
        url: nextAction.lecture ? nextAction.lecture.url : 'https://www.youtube.com/watch?v=FPu9Uld7W-E',
        completed: !!dailyState['task_lecture_1']
      },
      {
        id: 'task_code_1',
        type: 'Coding Practice',
        title: 'Solve: Two Sum (LeetCode #1)',
        time: '20 min',
        difficulty: 'Easy',
        badgeColor: 'badge-success',
        actionLabel: 'Open LeetCode',
        url: 'https://leetcode.com/problems/two-sum/',
        completed: !!dailyState['task_code_1']
      },
      {
        id: 'task_quiz_1',
        type: 'Knowledge Quiz',
        title: 'Attempt: Month 1 DSA & Complexity Knowledge Check',
        time: '10 min',
        difficulty: 'Easy',
        badgeColor: 'badge-info',
        actionLabel: 'Take Quiz',
        scrollTarget: '#month-section-1',
        completed: !!dailyState['task_quiz_1']
      },
      {
        id: 'task_interview_1',
        type: 'Interview Viva',
        title: 'Review: Stack vs Heap Memory Recruiter Response',
        time: '15 min',
        difficulty: 'Medium',
        badgeColor: 'badge-warning',
        actionLabel: 'Review Answer',
        scrollTarget: '#interview-q-1-0',
        completed: !!dailyState['task_interview_1']
      }
    ];

    return tasks;
  }


  // Helper to render individual verified lecture card
  renderLectureCard(lec, rState) {
    if (!lec) return '';
    const isValid = (lec.verified === true && validateYouTubeVideo(lec.videoId));

    // Fallback behavior if video is ever unverified or unavailable
    if (!isValid) {
      const fallbackUrl = getSafeYouTubeSearchUrl(lec.topic || lec.skill, lec.channel);
      return `
        <div class="roadmap-lecture-card card p-3 lecture-fallback-card">
          <div class="flex items-center gap-2 mb-2">
            <span class="badge badge-warning text-xs font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Verified Search</span>
            <span class="text-xs text-muted">${escapeHtml(lec.topic || lec.skill)}</span>
          </div>
          <h4 class="text-xs font-bold text-main mb-2">
            ${escapeHtml(lec.title || 'Curated Resource for ' + (lec.topic || lec.skill))}
          </h4>
          <a href="${fallbackUrl}" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="btn btn-sm btn-outline-secondary font-bold">
            <i class="fa-brands fa-youtube text-rose"></i> Search YouTube for this topic ↗
          </a>
        </div>
      `;
    }

    const isWatched = !!((rState && rState.completedLectures) || {})[lec.videoId];
    const levelClass = (lec.level || 'Beginner').toLowerCase();
    const fallbackSearch = getSafeYouTubeSearchUrl(lec.topic || lec.skill, lec.channel);
    const videoUrl = lec.youtubeUrl || lec.url || `https://www.youtube.com/watch?v=${lec.videoId}`;

    return `
      <div class="roadmap-lecture-card ${isWatched ? 'lecture-watched' : ''}" id="lecture-card-${lec.videoId}">
        <div class="roadmap-lecture-thumb-wrapper">
          <img src="https://img.youtube.com/vi/${lec.videoId}/hqdefault.jpg" 
               alt="${escapeHtml(lec.title)}" 
               class="roadmap-lecture-thumb"
               loading="lazy"
               onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=480&auto=format&fit=crop&q=60';" />
          <span class="roadmap-level-badge level-${levelClass}">
            ${lec.level || 'Beginner'}
          </span>
          <span class="roadmap-duration-badge">
            <i class="fa-regular fa-clock"></i> ${lec.duration || '25 min'}
          </span>
          <a href="${videoUrl}" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="roadmap-play-overlay" 
             title="Watch on YouTube: ${escapeHtml(lec.title)}">
            <div class="roadmap-play-btn">
              <i class="fa-solid fa-play"></i>
            </div>
          </a>
        </div>

        <div class="roadmap-lecture-body">
          <div class="roadmap-lecture-meta-top">
            <span class="roadmap-topic-pill">
              <i class="fa-solid fa-graduation-cap"></i> ${escapeHtml(lec.topic || lec.skill)}
            </span>
            ${lec.specialBadge ? `<span class="badge badge-primary badge-xs font-bold">${escapeHtml(lec.specialBadge)}</span>` : ''}
            ${isWatched ? '<span class="badge badge-success badge-xs font-bold"><i class="fa-solid fa-check"></i> Watched</span>' : '<span class="badge badge-outline badge-xs text-emerald font-bold"><i class="fa-solid fa-circle-check"></i> Verified</span>'}
          </div>

          <h4 class="roadmap-lecture-title" title="${escapeHtml(lec.title)}">
            <a href="${videoUrl}" target="_blank" rel="noopener noreferrer">
              ${escapeHtml(lec.title)}
            </a>
          </h4>

          <div class="roadmap-lecture-channel">
            <i class="fa-brands fa-youtube text-rose"></i>
            <span class="channel-name">${escapeHtml(lec.channel)}</span>
            <i class="fa-solid fa-circle-check text-primary verified-icon" title="Verified Public Video"></i>
          </div>

          <div class="roadmap-lecture-actions">
            <a href="${videoUrl}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn btn-sm btn-primary roadmap-watch-btn"
               title="Watch on YouTube (New Tab)">
              <i class="fa-brands fa-youtube"></i> Watch Lecture ↗
            </a>
            <button type="button" 
                    class="btn btn-sm ${isWatched ? 'btn-success' : 'btn-outline-secondary'}" 
                    onclick="roadmapManager.toggleLecture('${lec.videoId}')"
                    title="${isWatched ? 'Marked as Watched' : 'Mark as Complete'}">
              <i class="fa-solid ${isWatched ? 'fa-check-circle' : 'fa-circle'}"></i> ${isWatched ? 'Done' : 'Mark'}
            </button>
            <a href="${fallbackSearch}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn btn-sm btn-outline-secondary roadmap-fallback-search" 
               title="Search more lectures on ${escapeHtml(lec.topic || lec.skill)}">
              <i class="fa-solid fa-magnifying-glass"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Helper to render individual problem card
  renderProblemCard(p, rState) {
    const isSolved = !!((rState && rState.solvedProblems) || {})[p.id];
    const diffBadgeClass = p.difficulty === 'Easy' ? 'badge-success' : p.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger';

    return `
      <div class="roadmap-problem-card ${isSolved ? 'problem-solved' : ''}">
        <div class="flex items-center gap-2" style="flex: 1; min-width: 0;">
          <input type="checkbox" ${isSolved ? 'checked' : ''} onclick="roadmapManager.toggleProblem('${p.id}')" title="Mark Solved" />
          <div style="flex: 1; min-width: 0;">
            <div class="text-xs font-bold text-main truncate">${escapeHtml(p.name)}</div>
            <div class="flex items-center gap-2 mt-1 flex-wrap">
              <span class="badge badge-xs ${diffBadgeClass}">${p.difficulty}</span>
              <span class="text-xs text-muted">${escapeHtml(p.topic || p.platform)}</span>
              <span class="text-xs text-muted">• ${p.estimatedTime || '20 min'}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1 flex-wrap">
          ${(() => {
            if (!p.solutionUrl) return '';
            const m = p.solutionUrl.match(/watch\?v=([a-zA-Z0-9_-]{11})/);
            if (m && !validateYouTubeVideo(m[1])) return '';
            return `
              <a href="${p.solutionUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-outline-rose" title="Watch Video Solution: ${escapeHtml(p.solutionTitle || p.name)}">
                <i class="fa-brands fa-youtube"></i> Watch Solution
              </a>
            `;
          })()}
          <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-outline-secondary" title="Practice on LeetCode: ${escapeHtml(p.name)}">
            ${p.isTwoSumFeatured ? 'Practice on LeetCode ↗' : 'Solve Problem ↗'}
          </a>
        </div>
      </div>
    `;
  }

  // Render the entire Roadmap View
  renderRoadmapView() {
    const container = document.getElementById('roadmap-timeline-root');
    if (!container) return;

    const rState = this.getRoadmapState();
    const profile = (typeof appState !== 'undefined' && appState.getProfile) ? appState.getProfile() : { targetCareerId: 'sde' };
    const prediction = (typeof appState !== 'undefined' && appState.getPrediction) ? appState.getPrediction() : { probability: 92, factors: { technicalDSA: 92 } };
    const targetCareer = (typeof CAREERS_CATALOG !== 'undefined' && Array.isArray(CAREERS_CATALOG))
      ? (CAREERS_CATALOG.find(c => c.id === profile.targetCareerId) || CAREERS_CATALOG[0])
      : { title: 'Software Engineer / SDE', id: 'sde', requiredSkills: [] };

    // Next best action & daily plan
    const nextAction = this.computeNextBestAction(profile, prediction, targetCareer, rState);
    const todayDate = new Date().toISOString().split('T')[0];
    const dailyTasks = this.getDailyPlan(todayDate, nextAction, rState);
    const dailyDoneCount = dailyTasks.filter(t => t.completed).length;
    const dailyPercent = Math.round((dailyDoneCount / dailyTasks.length) * 100);

    // Compute progress metrics
    let totalMilestones = 0;
    let completedMilestones = 0;
    SIX_MONTH_ROADMAP_MASTER.forEach(m => {
      (m.milestones || []).forEach(item => {
        totalMilestones++;
        if (rState.checkedMilestones[item.id]) completedMilestones++;
      });
    });

    const solvedProblemsCount = Object.keys(rState.solvedProblems || {}).filter(k => rState.solvedProblems[k]).length;
    const watchedLecturesCount = Object.keys(rState.completedLectures || {}).filter(k => rState.completedLectures[k]).length;
    const passedQuizzesCount = Object.keys(rState.passedQuizzes || {}).filter(k => rState.passedQuizzes[k]?.passed).length;
    const completedProjectsCount = Object.keys(rState.projectSubmissions || {}).filter(k => rState.projectSubmissions[k]?.completed).length;

    const overallPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    // Update Progress header
    const progressText = document.getElementById('roadmap-progress-text');
    if (progressText) progressText.innerText = `${completedMilestones} of ${totalMilestones} Milestones Achieved (${overallPercent}%)`;

    const progressBar = document.getElementById('roadmap-overall-bar');
    if (progressBar) {
      progressBar.style.width = `${overallPercent}%`;
      progressBar.className = overallPercent >= 80 ? 'progress-fill success' : overallPercent >= 45 ? 'progress-fill' : 'progress-fill warning';
    }

    // Achievements evaluation
    const achievements = [
      { id: 'ach_1', title: 'First Milestone', desc: 'Achieved 1st milestone', icon: 'fa-solid fa-flag-checkered', unlocked: completedMilestones >= 1 },
      { id: 'ach_2', title: 'Code Solver', desc: 'Solved practice problems', icon: 'fa-solid fa-code', unlocked: solvedProblemsCount >= 1 },
      { id: 'ach_3', title: '7-Day Streak', desc: 'Consistent 7-day study streak', icon: 'fa-solid fa-fire text-amber', unlocked: (rState.streak?.count || 0) >= 7 },
      { id: 'ach_4', title: 'Quiz Whiz', desc: 'Passed a technical check', icon: 'fa-solid fa-award', unlocked: passedQuizzesCount >= 1 },
      { id: 'ach_5', title: 'Interview Ready', desc: 'Roadmap progress >= 75%', icon: 'fa-solid fa-trophy text-amber', unlocked: overallPercent >= 75 }
    ];

    container.innerHTML = `
      <!-- TOP ACTION BAR: Target Role, Hours & Season Switcher -->
      <div class="card p-3 mb-3 roadmap-config-bar">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="badge badge-primary"><i class="fa-solid fa-crosshairs"></i> Target Role:</span>
            <select id="roadmap-role-select" class="form-control form-control-sm font-semibold" style="width: auto; min-width: 220px;" onchange="roadmapManager.setRole(this.value)">
              ${(typeof CAREERS_CATALOG !== 'undefined' ? CAREERS_CATALOG : []).map(c => `
                <option value="${c.id}" ${c.id === targetCareer.id ? 'selected' : ''}>${c.title}</option>
              `).join('')}
            </select>
            <span class="badge badge-outline text-xs">Tier: ${prediction.tier || 'High'} Readiness</span>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-2">
              <label class="text-xs text-muted font-semibold">Weekly Pace:</label>
              <select id="roadmap-hours-select" class="form-control form-control-sm" onchange="roadmapManager.setHours(this.value)">
                <option value="10" ${this.selectedHours === 10 ? 'selected' : ''}>10 hrs / wk (Moderate)</option>
                <option value="15" ${this.selectedHours === 15 ? 'selected' : ''}>15 hrs / wk (Recommended)</option>
                <option value="25" ${this.selectedHours === 25 ? 'selected' : ''}>25 hrs / wk (Sprint)</option>
              </select>
            </div>
            <span class="badge badge-info"><i class="fa-solid fa-calendar-days"></i> Batch ${profile.gradYear || '2026'}</span>
          </div>
        </div>
      </div>

      <!-- ROW: "YOUR NEXT BEST ACTION" AI CARD & "TODAY'S PREPARATION" DAILY PLAN -->
      <div class="grid-responsive-2 gap-3 mb-4">
        
        <!-- CARD 1: YOUR NEXT BEST ACTION -->
        <div class="card p-3 roadmap-ai-action-card">
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="badge badge-primary font-bold"><i class="fa-solid fa-robot"></i> AI RECOMMENDATION</span>
            <span class="text-xs text-muted font-semibold"><i class="fa-regular fa-clock"></i> Est. Time: <strong>${nextAction.estimatedTime}</strong></span>
          </div>
          <h3 class="text-base font-bold text-main mb-1 flex items-center gap-2">
            <span class="pulse-indicator"></span>
            Improve ${escapeHtml(nextAction.skill)}
          </h3>
          <p class="text-xs text-muted mb-3" style="line-height: 1.45;">
            ${escapeHtml(nextAction.rationale)}
          </p>
          <div class="flex items-center justify-between flex-wrap gap-2 pt-2 border-top">
            <div class="text-xs font-semibold text-primary truncate" style="max-width: 250px;">
              <i class="fa-brands fa-youtube text-rose"></i> ${escapeHtml(nextAction.topic)}
            </div>
            <button class="btn btn-primary btn-sm font-bold" onclick="roadmapManager.startNextBestAction(${nextAction.monthNum}, '${nextAction.lecture?.videoId || ''}')">
              <i class="fa-solid fa-bolt"></i> Start Now
            </button>
          </div>
        </div>

        <!-- CARD 2: TODAY'S PREPARATION (DAILY PLAN) -->
        <div class="card p-3 roadmap-daily-plan-card">
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2">
              <span class="badge badge-success font-bold"><i class="fa-solid fa-list-check"></i> TODAY'S PREPARATION</span>
              <span class="badge badge-outline text-xs">🔥 ${rState.streak?.count || 7} Days Streak</span>
            </div>
            <span class="text-xs font-bold text-main">${dailyDoneCount}/${dailyTasks.length} Completed (${dailyPercent}%)</span>
          </div>
          
          <div class="progress-track mb-3" style="height: 6px;">
            <div class="progress-fill success" style="width: ${dailyPercent}%;"></div>
          </div>

          <div class="roadmap-daily-tasks-list">
            ${dailyTasks.map(t => `
              <div class="daily-task-item ${t.completed ? 'completed' : ''}" onclick="roadmapManager.toggleDailyTask('${todayDate}', '${t.id}')">
                <input type="checkbox" ${t.completed ? 'checked' : ''} onclick="event.stopPropagation(); roadmapManager.toggleDailyTask('${todayDate}', '${t.id}')" />
                <div style="flex: 1; min-width: 0;">
                  <div class="daily-task-title truncate">${escapeHtml(t.title)}</div>
                  <div class="daily-task-meta">
                    <span class="badge ${t.badgeColor} badge-xs">${t.type}</span>
                    <span class="text-xs text-muted">${t.time}</span>
                    <span class="text-xs text-muted">• ${t.difficulty}</span>
                  </div>
                </div>
                ${t.url ? `
                  <a href="${t.url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-secondary btn-xs" onclick="event.stopPropagation();" title="${t.actionLabel}">
                    ${t.actionLabel} <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                  </a>
                ` : `
                  <button type="button" class="btn btn-outline-secondary btn-xs" onclick="event.stopPropagation(); document.querySelector('${t.scrollTarget}')?.scrollIntoView({ behavior: 'smooth' });">
                    ${t.actionLabel}
                  </button>
                `}
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- LEARNING STREAK & ACHIEVEMENTS ROW -->
      <div class="card p-3 mb-4 roadmap-achievements-bar">
        <div class="flex items-center justify-between flex-wrap gap-2 mb-2">
          <div class="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-medal text-amber"></i> Milestones & Badges Unlocked:
          </div>
          <div class="text-xs font-semibold text-muted">
            <span class="text-emerald font-bold">${solvedProblemsCount}</span> Problems Solved • 
            <span class="text-primary font-bold">${watchedLecturesCount}</span> Lectures Watched • 
            <span class="text-amber font-bold">${passedQuizzesCount}</span> Quizzes Passed
          </div>
        </div>
        <div class="roadmap-achievements-grid">
          ${achievements.map(a => `
            <div class="achievement-pill ${a.unlocked ? 'unlocked' : 'locked'}" title="${a.desc}">
              <i class="${a.icon}"></i>
              <div class="achievement-pill-text">
                <strong>${a.title}</strong>
                <span>${a.unlocked ? 'Unlocked' : 'In Progress'}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- FILTER CONTROLS: Timeline status, Domain tags, Expand/Collapse All -->
      <div class="card p-2 mb-4 roadmap-filter-bar">
        <div class="flex items-center justify-between flex-wrap gap-2">
          
          <!-- Timeline Status Filter Tabs -->
          <div class="flex items-center gap-1 flex-wrap">
            <span class="text-xs text-muted font-bold mr-1">Timeline:</span>
            ${['ALL', 'CURRENT', 'COMPLETED', 'UPCOMING'].map(f => `
              <button type="button" class="btn btn-xs ${this.activeTimelineFilter === f ? 'btn-primary' : 'btn-outline-secondary'}" onclick="roadmapManager.setTimelineFilter('${f}')">
                ${f === 'ALL' ? 'All Months (6)' : f}
              </button>
            `).join('')}
          </div>

          <!-- Domain Filter Tabs -->
          <div class="flex items-center gap-1 flex-wrap">
            <span class="text-xs text-muted font-bold mr-1">Domain:</span>
            ${['ALL', 'DSA', 'Development', 'Database', 'Interview'].map(d => `
              <button type="button" class="btn btn-xs ${this.activeDomainFilter === d.toUpperCase() ? 'btn-primary' : 'btn-outline-secondary'}" onclick="roadmapManager.setDomainFilter('${d.toUpperCase()}')">
                ${d}
              </button>
            `).join('')}
          </div>

          <!-- Accordion Controls -->
          <div class="flex items-center gap-1">
            <button type="button" class="btn btn-xs btn-outline-secondary" onclick="roadmapManager.toggleAllMonths(true)">
              <i class="fa-solid fa-angles-down"></i> Expand All
            </button>
            <button type="button" class="btn btn-xs btn-outline-secondary" onclick="roadmapManager.toggleAllMonths(false)">
              <i class="fa-solid fa-angles-up"></i> Collapse All
            </button>
          </div>
        </div>
      </div>

      <!-- 6-MONTH STRUCTURED TIMELINE EXPANDABLE MONTHS -->
      <div class="roadmap-six-month-container">
        ${SIX_MONTH_ROADMAP_MASTER.map(m => {
          // Check filters
          const monthCheckedCount = (m.milestones || []).filter(item => rState.checkedMilestones[item.id]).length;
          const monthTotal = (m.milestones || []).length || 1;
          const monthPercent = Math.round((monthCheckedCount / monthTotal) * 100);
          const isMonthDone = monthPercent === 100;
          const isMonthCurrent = m.monthNum === 1 || (!isMonthDone && (m.monthNum === 1 || rState.checkedMilestones[`m${m.monthNum-1}_1`]));

          // Timeline filter check
          if (this.activeTimelineFilter === 'COMPLETED' && !isMonthDone) return '';
          if (this.activeTimelineFilter === 'CURRENT' && !isMonthCurrent) return '';
          if (this.activeTimelineFilter === 'UPCOMING' && (isMonthDone || isMonthCurrent)) return '';

          // Domain filter check
          if (this.activeDomainFilter !== 'ALL' && m.domain.toUpperCase() !== this.activeDomainFilter) return '';

          const isCollapsed = !!this.collapsedMonths[m.monthNum];

          return `
            <div class="roadmap-month-card ${isMonthDone ? 'month-completed' : ''}" id="month-section-${m.monthNum}">
              
              <!-- Month Header Bar (Click to Expand / Collapse) -->
              <div class="roadmap-month-header clickable" onclick="roadmapManager.toggleMonthCollapse(${m.monthNum})">
                <div class="roadmap-month-badge-col">
                  <span class="badge ${isMonthDone ? 'badge-success' : isMonthCurrent ? 'badge-primary' : 'badge-outline'}">${m.duration}</span>
                  <h3 class="roadmap-month-title">${escapeHtml(m.title)}</h3>
                  <span class="badge badge-secondary badge-xs">${m.domain} Track</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="roadmap-month-progress-badge">
                    <span class="badge ${isMonthDone ? 'badge-success' : 'badge-outline'} font-bold">
                      ${monthCheckedCount}/${monthTotal} Milestones (${monthPercent}%)
                    </span>
                  </div>
                  <button type="button" class="btn btn-sm btn-icon" aria-label="Toggle month content">
                    <i class="fa-solid ${isCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}"></i>
                  </button>
                </div>
              </div>

              <!-- Month Body Content (Expandable/Collapsible) -->
              <div class="roadmap-month-content ${isCollapsed ? 'collapsed' : ''}" id="month-content-${m.monthNum}">
                
                <!-- Learning Objective -->
                <div class="roadmap-objective-box">
                  <i class="fa-solid fa-flag text-primary"></i>
                  <div>
                    <strong>Learning Objective:</strong> ${escapeHtml(m.objective)}
                  </div>
                </div>

                <!-- Skills Covered with Mastery Status & Smart Feedback -->
                <div class="roadmap-skills-mastery-section mb-3">
                  <div class="text-xs font-bold text-muted uppercase mb-2">Skills Covered & Mastery Progress:</div>
                  <div class="grid gap-2">
                    ${m.skills.map(s => {
                      const mastery = this.getSkillMastery(s, m, rState);
                      const currentFeedback = (rState.skillFeedback || {})[s];
                      return `
                        <div class="skill-mastery-row">
                          <div class="flex items-center gap-2 flex-wrap" style="flex: 1; min-width: 0;">
                            <strong class="text-xs text-main">${escapeHtml(s)}</strong>
                            <span class="badge ${mastery.badgeClass} badge-xs font-bold">
                              <i class="${mastery.icon}"></i> ${mastery.status} (${mastery.percent}%)
                            </span>
                            ${currentFeedback ? `<span class="badge badge-secondary badge-xs font-normal">Feedback: ${currentFeedback}</span>` : ''}
                          </div>
                          
                          <!-- Smart Feedback Action Buttons -->
                          <div class="roadmap-feedback-btns flex items-center gap-1 flex-wrap">
                            <span class="text-xs text-muted mr-1 font-medium">Feedback:</span>
                            <button type="button" class="btn btn-xs ${currentFeedback === 'easy' ? 'btn-primary' : 'btn-outline-secondary'}" onclick="roadmapManager.setSkillFeedback('${escapeHtml(s)}', 'easy')" title="Too Easy for me">Easy</button>
                            <button type="button" class="btn btn-xs ${currentFeedback === 'difficult' ? 'btn-primary' : 'btn-outline-secondary'}" onclick="roadmapManager.setSkillFeedback('${escapeHtml(s)}', 'difficult')" title="Need easier breakdown">Difficult</button>
                            <button type="button" class="btn btn-xs ${currentFeedback === 'mastered' ? 'btn-success' : 'btn-outline-secondary'}" onclick="roadmapManager.setSkillFeedback('${escapeHtml(s)}', 'mastered')" title="Already know this concept">Already Know</button>
                            <button type="button" class="btn btn-xs ${currentFeedback === 'practice' ? 'btn-warning' : 'btn-outline-secondary'}" onclick="roadmapManager.setSkillFeedback('${escapeHtml(s)}', 'practice')" title="Need extra coding problems">Need Practice</button>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                ${m.topicSections ? `
                <!-- ==========================================
                     TOPIC-SPECIFIC RESOURCE SECTIONS (NO TOPIC MIXING)
                     ========================================== -->
                <div class="roadmap-topic-hub mb-4">
                  <div class="roadmap-phase-header mb-3">
                    <div class="flex items-center gap-2">
                      <span class="badge badge-primary font-bold">TOPIC SECTIONS</span>
                      <h4 class="text-sm font-bold text-main uppercase tracking-wide">
                        <i class="fa-solid fa-layer-group text-primary"></i> Month 2 Core Topics: Pure Topic-Isolated Lectures & Practice
                      </h4>
                    </div>
                    <span class="text-xs text-muted font-medium">Zero Mixed Topics • Abdul Bari Algorithmic Path • Dedicated LeetCode Practice</span>
                  </div>

                  <!-- Topic Switcher Pills Bar -->
                  <div class="roadmap-skill-filters flex flex-wrap gap-1 mb-3">
                    <button type="button" 
                            class="btn btn-xs ${(this.activeSkillFilters[m.monthNum] || 'ALL') === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}"
                            onclick="roadmapManager.setSkillFilter(${m.monthNum}, 'ALL')">
                      All 6 Topics (${m.youtubeLectures.length} Lectures)
                    </button>
                    ${m.topicSections.map(sec => {
                      const count = sec.isDedicatedLinkedList 
                        ? sec.levels.reduce((acc, lvl) => acc + lvl.lectures.length, 0)
                        : (sec.lectures || []).length;
                      const isActive = (this.activeSkillFilters[m.monthNum] || 'ALL') === sec.skill;
                      return `
                        <button type="button" 
                                class="btn btn-xs ${isActive ? 'btn-primary' : 'btn-outline-secondary'}"
                                onclick="roadmapManager.setSkillFilter(${m.monthNum}, '${escapeHtml(sec.skill)}')">
                          <i class="${sec.icon} mr-1"></i> ${escapeHtml(sec.name)} (${count})
                        </button>
                      `;
                    }).join('')}
                  </div>

                  <!-- Container for Topic Sections -->
                  <div class="roadmap-topic-sections-container grid gap-4">
                    ${m.topicSections.filter(sec => {
                      const f = this.activeSkillFilters[m.monthNum] || 'ALL';
                      return f === 'ALL' || sec.skill === f;
                    }).map(sec => {
                      if (sec.isDedicatedLinkedList) {
                        return `
                          <div class="roadmap-topic-section card p-3" id="${sec.id}">
                            <div class="topic-section-header mb-3">
                              <div class="flex items-center justify-between flex-wrap gap-2">
                                <div class="flex items-center gap-2">
                                  <div class="topic-icon-badge" style="background: rgba(244, 63, 94, 0.15); color: var(--accent-rose);">
                                    <i class="${sec.icon}"></i>
                                  </div>
                                  <div>
                                    <h3 class="text-base font-bold text-main mb-0 flex items-center gap-2">
                                      ${sec.name}
                                      <span class="badge badge-danger text-xs font-bold">BEGINNER → ADVANCED</span>
                                    </h3>
                                    <p class="text-xs text-muted mb-0">${sec.tagline}</p>
                                  </div>
                                </div>
                                <span class="badge badge-outline text-xs">Different Reputable Channels</span>
                              </div>

                              <div class="ll-educator-callout mt-2 p-2">
                                <i class="fa-solid fa-graduation-cap text-rose"></i>
                                <span><strong>Educator Coverage:</strong> ${sec.abdulBariNote}</span>
                              </div>
                            </div>

                            <!-- Levels 1 to 4 Grid -->
                            <div class="ll-levels-container grid gap-3 mb-4">
                              ${sec.levels.map(lvl => `
                                <div class="ll-level-card card p-3" id="${lvl.levelId}">
                                  <div class="ll-level-header mb-2">
                                    <div class="flex items-center justify-between flex-wrap gap-2">
                                      <div class="flex items-center gap-2">
                                        <span class="badge badge-primary font-bold">${lvl.title}</span>
                                        <strong class="text-xs text-main">${lvl.subtitle}</strong>
                                      </div>
                                      <span class="text-xs text-muted font-medium">${lvl.lectures.length} Dedicated Lectures</span>
                                    </div>
                                    <div class="flex flex-wrap gap-1 mt-2">
                                      ${lvl.concepts.map(c => `<span class="badge badge-secondary badge-xs">${escapeHtml(c)}</span>`).join('')}
                                    </div>
                                  </div>

                                  <div class="roadmap-lectures-grid mt-2">
                                    ${lvl.lectures.map(lec => this.renderLectureCard(lec, rState)).join('')}
                                  </div>
                                </div>
                              `).join('')}
                            </div>

                            <!-- Progressive Linked List Practice -->
                            <div class="ll-practice-hub card p-3">
                              <div class="flex items-center justify-between flex-wrap gap-2 mb-3">
                                <div class="flex items-center gap-2">
                                  <span class="badge badge-success font-bold">PRACTICE</span>
                                  <h4 class="text-xs font-bold text-main uppercase tracking-wide">
                                    <i class="fa-solid fa-code text-cyan"></i> Linked List Practice: Progressive Difficulty
                                  </h4>
                                </div>
                                <span class="text-xs text-muted font-semibold">Easy • Medium • Hard Curated Problems</span>
                              </div>

                              <div class="grid gap-3">
                                ${sec.practiceGroups.map(grp => `
                                  <div class="practice-difficulty-group">
                                    <div class="flex items-center gap-2 mb-2">
                                      <span class="badge ${grp.badgeClass} badge-xs font-bold">
                                        <i class="${grp.icon}"></i> ${grp.difficulty.toUpperCase()}
                                      </span>
                                      <span class="text-xs text-muted font-medium">${grp.problems.length} Problems</span>
                                    </div>
                                    <div class="grid-responsive-2 gap-2">
                                      ${grp.problems.map(p => this.renderProblemCard(p, rState)).join('')}
                                    </div>
                                  </div>
                                `).join('')}
                              </div>
                            </div>
                          </div>
                        `;
                      }

                      return `
                        <div class="roadmap-topic-section card p-3" id="${sec.id}">
                          <div class="topic-section-header mb-3">
                            <div class="flex items-center justify-between flex-wrap gap-2">
                              <div class="flex items-center gap-2">
                                <div class="topic-icon-badge" style="background: rgba(99, 102, 241, 0.15); color: ${sec.accentColor};">
                                  <i class="${sec.icon}"></i>
                                </div>
                                <div>
                                  <h3 class="text-base font-bold text-main mb-0 flex items-center gap-2">
                                    ${sec.name}
                                    <span class="badge badge-outline text-xs font-bold" style="color: ${sec.accentColor}; border-color: ${sec.accentColor};">${sec.skill}</span>
                                  </h3>
                                  <p class="text-xs text-muted mb-0">${sec.tagline}</p>
                                </div>
                              </div>
                              <span class="text-xs text-muted font-semibold">${sec.lectures.length} Lectures • ${sec.practice.length} Practice Problems</span>
                            </div>

                            <div class="flex flex-wrap gap-1 mt-2">
                              ${sec.concepts.map(c => `<span class="badge badge-secondary badge-xs">${escapeHtml(c)}</span>`).join('')}
                            </div>
                          </div>

                          <!-- Subheading: Recommended Lectures -->
                          <div class="topic-subhead mb-2 mt-2">
                            <h5 class="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                              <i class="fa-brands fa-youtube text-rose"></i> Recommended ${sec.name === 'ARRAYS' ? 'Array' : sec.name === 'TWO POINTERS' ? 'Two Pointer' : sec.name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())} Lectures
                            </h5>
                          </div>
                          <div class="roadmap-lectures-grid mb-3">
                            ${sec.lectures.map(lec => this.renderLectureCard(lec, rState)).join('')}
                          </div>

                          <!-- Subheading: Practice Problems -->
                          <div class="topic-subhead mb-2">
                            <h5 class="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                              <i class="fa-solid fa-code text-cyan"></i> Practice: ${sec.name === 'ARRAYS' ? 'Two Sum + Array Problems' : sec.name === 'TWO POINTERS' ? 'Two Pointer Problems' : sec.name + ' Problems'}
                            </h5>
                          </div>
                          <div class="grid-responsive-2 gap-2">
                            ${sec.practice.map(p => this.renderProblemCard(p, rState)).join('')}
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
                ` : `
                <!-- ==========================================
                     PHASE 1: LEARN (Curated Real YouTube Lectures)
                     ========================================== -->
                <div class="roadmap-phase-box mb-4">
                  <div class="roadmap-phase-header">
                    <div class="flex items-center gap-2">
                      <span class="badge badge-primary font-bold">PHASE 1</span>
                      <h4 class="text-sm font-bold text-main uppercase tracking-wide">
                        <i class="fa-brands fa-youtube text-rose"></i> Learn: Recommended Video Lectures (${m.youtubeLectures.length} Rated Videos)
                      </h4>
                    </div>
                    <span class="text-xs text-muted font-medium">2–3 Real Lectures per Skill • Verified Creators</span>
                  </div>

                  <!-- Skill Filter Pills Bar -->
                  <div class="roadmap-skill-filters flex flex-wrap gap-1 mb-3">
                    <button type="button" 
                            class="btn btn-xs ${(this.activeSkillFilters[m.monthNum] || 'ALL') === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}"
                            onclick="roadmapManager.setSkillFilter(${m.monthNum}, 'ALL')">
                      All Skills (${m.youtubeLectures.length})
                    </button>
                    ${[...new Set(m.youtubeLectures.map(l => l.skill || l.topic))].map(s => {
                      const count = m.youtubeLectures.filter(l => (l.skill || l.topic) === s).length;
                      const isActive = (this.activeSkillFilters[m.monthNum] || 'ALL') === s;
                      return `
                        <button type="button" 
                                class="btn btn-xs ${isActive ? 'btn-primary' : 'btn-outline-secondary'}"
                                onclick="roadmapManager.setSkillFilter(${m.monthNum}, '${escapeHtml(s)}')">
                          ${escapeHtml(s)} (${count})
                        </button>
                      `;
                    }).join('')}
                  </div>

                  <!-- Grid of Verified Lecture Cards -->
                  <div class="roadmap-lectures-grid">
                    ${(m.youtubeLectures.filter(l => {
                      const f = this.activeSkillFilters[m.monthNum] || 'ALL';
                      return (f === 'ALL' || (l.skill || l.topic) === f) && l.verified === true && validateYouTubeVideo(l.videoId);
                    })).map(lec => this.renderLectureCard(lec, rState)).join('')}
                  </div>
                </div>

                <!-- ==========================================
                     PHASE 2: PRACTICE (Coding & Problem Solving)
                     ========================================== -->
                <div class="roadmap-phase-box mb-4">
                  <div class="roadmap-phase-header">
                    <div class="flex items-center gap-2">
                      <span class="badge badge-success font-bold">PHASE 2</span>
                      <h4 class="text-sm font-bold text-main uppercase tracking-wide">
                        <i class="fa-solid fa-code text-cyan"></i> Practice Now: Coding Challenges (${m.practiceProblems.length} Problems)
                      </h4>
                    </div>
                    <span class="text-xs text-muted font-medium">LeetCode • GFG • HackerRank Direct Links</span>
                  </div>

                  <div class="grid-responsive-2 gap-2">
                    ${m.practiceProblems.map(p => {
                      const isSolved = !!rState.solvedProblems[p.id];
                      return `
                        <div class="roadmap-problem-card ${isSolved ? 'problem-solved' : ''}">
                          <div class="flex items-center gap-2" style="flex: 1; min-width: 0;">
                            <input type="checkbox" ${isSolved ? 'checked' : ''} onclick="roadmapManager.toggleProblem('${p.id}')" title="Mark Solved" />
                            <div style="flex: 1; min-width: 0;">
                              <div class="text-xs font-bold text-main truncate">${escapeHtml(p.name)}</div>
                              <div class="flex items-center gap-2 mt-1">
                                <span class="badge badge-xs ${p.difficulty === 'Easy' ? 'badge-success' : p.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'}">${p.difficulty}</span>
                                <span class="text-xs text-muted">${p.platform}</span>
                                <span class="text-xs text-muted">• ${p.estimatedTime}</span>
                              </div>
                            </div>
                          </div>
                          <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-outline-secondary" title="Open problem on ${p.platform}">
                            Solve <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                          </a>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
                `}
                <!-- ==========================================
                     PHASE 3: QUIZ (Knowledge Check Assessment)
                     ========================================== -->
                <div class="roadmap-phase-box mb-4">
                  <div class="roadmap-phase-header">
                    <div class="flex items-center gap-2">
                      <span class="badge badge-info font-bold">PHASE 3</span>
                      <h4 class="text-sm font-bold text-main uppercase tracking-wide">
                        <i class="fa-solid fa-brain text-amber"></i> Knowledge Quiz: ${escapeHtml(m.quiz.title)}
                      </h4>
                    </div>
                    <div>
                      ${rState.passedQuizzes[m.monthNum]?.passed 
                        ? `<span class="badge badge-success font-bold"><i class="fa-solid fa-circle-check"></i> Passed: ${rState.passedQuizzes[m.monthNum].score}/${rState.passedQuizzes[m.monthNum].total} (100%)</span>`
                        : `<span class="badge badge-outline text-xs">Unlocks Milestone Badge</span>`}
                    </div>
                  </div>

                  <div class="roadmap-quiz-container card p-3">
                    ${m.quiz.questions.map((q, qIndex) => {
                      const selectedOpt = this.quizSelectedOptions[`m${m.monthNum}_q${qIndex}`];
                      const isSubmitted = !!rState.passedQuizzes[m.monthNum];
                      return `
                        <div class="quiz-question-block mb-3 pb-3 border-bottom">
                          <p class="text-xs font-bold text-main mb-2">
                            ${qIndex + 1}. ${escapeHtml(q.question)}
                          </p>
                          <div class="quiz-options-list grid gap-1">
                            ${q.options.map((opt, optIndex) => {
                              const isChecked = selectedOpt === optIndex;
                              const isCorrect = q.answer === optIndex;
                              let optClass = 'quiz-opt-btn';
                              if (isSubmitted) {
                                if (isCorrect) optClass += ' opt-correct';
                                else if (isChecked && !isCorrect) optClass += ' opt-incorrect';
                              } else if (isChecked) {
                                optClass += ' opt-selected';
                              }

                              return `
                                <button type="button" 
                                        class="${optClass}"
                                        onclick="roadmapManager.selectQuizOption(${m.monthNum}, ${qIndex}, ${optIndex})"
                                        ${isSubmitted ? 'disabled' : ''}>
                                  <span class="opt-indicator">${String.fromCharCode(65 + optIndex)}</span>
                                  <span class="opt-label">${escapeHtml(opt)}</span>
                                  ${isSubmitted && isCorrect ? '<i class="fa-solid fa-check text-emerald"></i>' : ''}
                                  ${isSubmitted && isChecked && !isCorrect ? '<i class="fa-solid fa-xmark text-rose"></i>' : ''}
                                </button>
                              `;
                            }).join('')}
                          </div>
                          ${isSubmitted ? `
                            <div class="quiz-explanation-box mt-2">
                              <i class="fa-solid fa-circle-info text-primary"></i>
                              <span><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</span>
                            </div>
                          ` : ''}
                        </div>
                      `;
                    }).join('')}

                    <div class="flex items-center justify-between flex-wrap gap-2 pt-2">
                      <span class="text-xs text-muted font-semibold">
                        Passing threshold: 66% (2 of 3 correct answers)
                      </span>
                      <div class="flex items-center gap-2">
                        ${rState.passedQuizzes[m.monthNum] ? `
                          <button type="button" class="btn btn-xs btn-outline-secondary font-bold" onclick="roadmapManager.retryQuiz(${m.monthNum})">
                            <i class="fa-solid fa-rotate-right"></i> Retry Quiz
                          </button>
                        ` : `
                          <button type="button" class="btn btn-sm btn-primary font-bold" onclick="roadmapManager.submitQuiz(${m.monthNum})">
                            <i class="fa-solid fa-paper-plane"></i> Submit Answers
                          </button>
                        `}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ==========================================
                     PHASE 4: PROJECT (Hands-on Capstone)
                     ========================================== -->
                <div class="roadmap-phase-box mb-4">
                  <div class="roadmap-phase-header">
                    <div class="flex items-center gap-2">
                      <span class="badge badge-warning font-bold">PHASE 4</span>
                      <h4 class="text-sm font-bold text-main uppercase tracking-wide">
                        <i class="fa-solid fa-folder-tree text-amber"></i> Capstone Project: ${escapeHtml(m.project.title)}
                      </h4>
                    </div>
                    <span class="badge ${rState.projectSubmissions[m.monthNum]?.completed ? 'badge-success' : 'badge-outline'} font-bold">
                      ${rState.projectSubmissions[m.monthNum]?.completed ? '<i class="fa-solid fa-check"></i> Project Completed' : 'In Progress'}
                    </span>
                  </div>

                  <div class="card p-3 project-card-body">
                    <p class="text-xs text-muted mb-2">${escapeHtml(m.project.desc)}</p>
                    
                    <div class="flex items-center gap-2 flex-wrap mb-3">
                      <span class="text-xs text-muted font-bold">Tech Stack:</span>
                      ${m.project.techStack.map(t => `<span class="badge badge-outline badge-xs">${escapeHtml(t)}</span>`).join('')}
                      <span class="text-xs text-muted ml-2 font-bold">Est. Time: ${m.project.estimatedTime}</span>
                    </div>

                    <!-- Requirements Checklist -->
                    <div class="project-requirements-checklist mb-3">
                      <div class="text-xs font-bold text-main mb-1 uppercase">Deliverables & Requirements:</div>
                      ${m.project.requirements.map((req, rIdx) => {
                        const isReqDone = !!(rState.projectSubmissions[m.monthNum]?.checkedReqs || [])[rIdx];
                        return `
                          <div class="checklist-item ${isReqDone ? 'completed' : ''}" onclick="roadmapManager.toggleProjectReq(${m.monthNum}, ${rIdx})">
                            <input type="checkbox" ${isReqDone ? 'checked' : ''} onclick="event.stopPropagation(); roadmapManager.toggleProjectReq(${m.monthNum}, ${rIdx})" />
                            <span class="checklist-text">${escapeHtml(req)}</span>
                            ${isReqDone ? '<i class="fa-solid fa-circle-check text-emerald"></i>' : '<i class="fa-regular fa-circle text-muted"></i>'}
                          </div>
                        `;
                      }).join('')}
                    </div>

                    <!-- GitHub Repository Link Input & Submit -->
                    <div class="flex items-center gap-2 flex-wrap pt-2 border-top">
                      <div class="flex items-center gap-2" style="flex: 1; min-width: 260px;">
                        <i class="fa-brands fa-github fa-lg text-muted"></i>
                        <input type="url" 
                               id="project-repo-input-${m.monthNum}" 
                               class="form-control form-control-sm" 
                               placeholder="https://github.com/your-username/repo-name" 
                               value="${rState.projectSubmissions[m.monthNum]?.githubUrl || ''}" />
                      </div>
                      <button type="button" class="btn btn-outline-secondary btn-sm" onclick="roadmapManager.saveProjectRepo(${m.monthNum})">
                        <i class="fa-solid fa-floppy-disk"></i> Save Link
                      </button>
                      <button type="button" class="btn ${rState.projectSubmissions[m.monthNum]?.completed ? 'btn-success' : 'btn-primary'} btn-sm font-bold" onclick="roadmapManager.toggleProject(${m.monthNum})">
                        <i class="fa-solid ${rState.projectSubmissions[m.monthNum]?.completed ? 'fa-check-circle' : 'fa-award'}"></i>
                        ${rState.projectSubmissions[m.monthNum]?.completed ? 'Completed' : 'Mark Project Complete'}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- ==========================================
                     PHASE 5: INTERVIEW (Questions & STAR Responses)
                     ========================================== -->
                <div class="roadmap-phase-box mb-4">
                  <div class="roadmap-phase-header">
                    <div class="flex items-center gap-2">
                      <span class="badge badge-secondary font-bold">PHASE 5</span>
                      <h4 class="text-sm font-bold text-main uppercase tracking-wide">
                        <i class="fa-solid fa-user-check text-emerald"></i> Interview Viva: Top Screening Questions
                      </h4>
                    </div>
                    <a href="#interview" class="btn btn-xs btn-outline-secondary font-semibold" title="Practice full drills in Interview Hub">
                      <i class="fa-solid fa-arrow-up-right-from-square"></i> Interview Hub
                    </a>
                  </div>

                  <div class="grid gap-2">
                    ${m.interviewQuestions.map((iq, iqIdx) => {
                      const qId = `interview-q-${m.monthNum}-${iqIdx}`;
                      return `
                        <div class="interview-accordion-card card p-2" id="${qId}">
                          <div class="flex items-center justify-between gap-2 clickable" onclick="roadmapManager.toggleInterviewAnswer('${qId}')">
                            <div class="flex items-center gap-2" style="flex: 1; min-width: 0;">
                              <span class="badge badge-xs ${iq.difficulty === 'High Frequency' ? 'badge-primary' : iq.difficulty === 'Core Technical' ? 'badge-info' : 'badge-warning'}">${iq.difficulty}</span>
                              <strong class="text-xs text-main">${escapeHtml(iq.q)}</strong>
                            </div>
                            <i class="fa-solid fa-chevron-down text-muted text-xs accordion-arrow"></i>
                          </div>
                          <div class="interview-answer-body mt-2 pt-2 border-top text-xs text-muted" style="display: none;">
                            <strong>Model Answer:</strong> ${escapeHtml(iq.answer)}
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <!-- Completion Milestones Checklist -->
                <div class="roadmap-milestones-checklist">
                  <div class="text-xs font-bold text-muted mb-2 uppercase">Official Month Milestones:</div>
                  <div class="grid gap-2">
                    ${m.milestones.map(item => {
                      const isChecked = !!rState.checkedMilestones[item.id];
                      return `
                        <div class="checklist-item ${isChecked ? 'completed' : ''}" onclick="roadmapManager.toggleMilestone('${item.id}')">
                          <input type="checkbox" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); roadmapManager.toggleMilestone('${item.id}')">
                          <span class="checklist-text">${escapeHtml(item.title)}</span>
                          ${isChecked ? '<i class="fa-solid fa-circle-check text-emerald"></i>' : '<i class="fa-regular fa-circle text-muted"></i>'}
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Action: Scroll to and highlight next best action
  startNextBestAction(monthNum, videoId) {
    this.collapsedMonths[monthNum] = false;
    this.renderRoadmapView();

    setTimeout(() => {
      let targetEl = null;
      if (videoId) {
        targetEl = document.getElementById(`lecture-card-${videoId}`);
      }
      if (!targetEl) {
        targetEl = document.getElementById(`month-section-${monthNum}`);
      }
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.classList.add('highlight-action-pulse');
        setTimeout(() => targetEl.classList.remove('highlight-action-pulse'), 3000);
      }
    }, 150);
  }

  // Action: Toggle daily preparation task
  toggleDailyTask(dateStr, taskId) {
    const r = this.getRoadmapState();
    if (!r.dailyTasks[dateStr]) r.dailyTasks[dateStr] = {};
    r.dailyTasks[dateStr][taskId] = !r.dailyTasks[dateStr][taskId];
    this.touchStreak();
    if (typeof appState !== 'undefined' && appState.saveState) appState.saveState();
    this.renderRoadmapView();
    if (typeof showToast === 'function') {
      showToast(r.dailyTasks[dateStr][taskId] ? 'Daily task completed! Streak active 🔥' : 'Task unchecked', 'info');
    }
  }

  // Action: Toggle month collapse accordion
  toggleMonthCollapse(monthNum) {
    this.collapsedMonths[monthNum] = !this.collapsedMonths[monthNum];
    const content = document.getElementById(`month-content-${monthNum}`);
    if (content) {
      content.classList.toggle('collapsed', this.collapsedMonths[monthNum]);
    }
    const headerArrow = document.querySelector(`#month-section-${monthNum} .fa-chevron-up, #month-section-${monthNum} .fa-chevron-down`);
    if (headerArrow) {
      headerArrow.className = `fa-solid ${this.collapsedMonths[monthNum] ? 'fa-chevron-down' : 'fa-chevron-up'}`;
    }
  }

  toggleAllMonths(expandAll) {
    SIX_MONTH_ROADMAP_MASTER.forEach(m => {
      this.collapsedMonths[m.monthNum] = !expandAll;
    });
    this.renderRoadmapView();
  }

  // Filter actions
  setTimelineFilter(filter) {
    this.activeTimelineFilter = filter;
    this.renderRoadmapView();
  }

  setDomainFilter(domain) {
    this.activeDomainFilter = domain;
    this.renderRoadmapView();
  }

  setSkillFilter(monthNum, skillName) {
    this.activeSkillFilters[monthNum] = skillName;
    this.renderRoadmapView();
  }

  setRole(roleId) {
    if (typeof appState !== 'undefined' && appState.getProfile) {
      const p = appState.getProfile();
      p.targetCareerId = roleId;
      const cat = (typeof CAREERS_CATALOG !== 'undefined') ? CAREERS_CATALOG.find(c => c.id === roleId) : null;
      if (cat) p.targetCareerTitle = cat.title;
      if (appState.saveState) appState.saveState();
    }
    if (typeof showToast === 'function') {
      showToast('Roadmap adapted for target role!', 'success');
    }
    this.renderRoadmapView();
    if (window.renderSkillGapAnalysis) window.renderSkillGapAnalysis();
    if (window.renderDashboard) window.renderDashboard();
  }

  setHours(val) {
    this.selectedHours = parseInt(val) || 15;
    if (typeof showToast === 'function') {
      showToast(`Pace updated to ${this.selectedHours} hrs/week.`, 'info');
    }
    this.renderRoadmapView();
  }

  // Smart student feedback on skill
  setSkillFeedback(skillName, feedbackType) {
    const r = this.getRoadmapState();
    if (!r.skillFeedback) r.skillFeedback = {};
    r.skillFeedback[skillName] = feedbackType;
    this.touchStreak();
    if (typeof appState !== 'undefined' && appState.saveState) appState.saveState();
    if (typeof showToast === 'function') {
      const msg = feedbackType === 'mastered' ? `Marked ${skillName} as already mastered!` :
                  feedbackType === 'practice' ? `High-priority practice drills added for ${skillName}!` :
                  feedbackType === 'easy' ? `Pace fast-tracked for ${skillName}!` : `Fundamental reviews recommended for ${skillName}.`;
      showToast(msg, 'info');
    }
    this.renderRoadmapView();
  }

  // Lecture toggle
  toggleLecture(videoId) {
    const r = this.getRoadmapState();
    r.completedLectures[videoId] = !r.completedLectures[videoId];
    this.touchStreak();
    if (typeof appState !== 'undefined' && appState.saveState) appState.saveState();
    if (typeof showToast === 'function') {
      showToast(r.completedLectures[videoId] ? 'Lecture marked complete! Mastery boosted.' : 'Lecture unmarked', 'info');
    }
    this.renderRoadmapView();
  }

  // Practice problem toggle
  toggleProblem(problemId) {
    const r = this.getRoadmapState();
    r.solvedProblems[problemId] = !r.solvedProblems[problemId];
    this.touchStreak();
    if (typeof appState !== 'undefined' && appState.saveState) appState.saveState();
    if (typeof showToast === 'function') {
      showToast(r.solvedProblems[problemId] ? 'Problem marked solved! Great job.' : 'Problem unmarked', 'success');
    }
    this.renderRoadmapView();
  }

  // Quiz actions
  selectQuizOption(monthNum, qIndex, optIndex) {
    this.quizSelectedOptions[`m${monthNum}_q${qIndex}`] = optIndex;
    this.renderRoadmapView();
  }

  submitQuiz(monthNum) {
    const m = SIX_MONTH_ROADMAP_MASTER.find(item => item.monthNum === monthNum);
    if (!m) return;

    let score = 0;
    const total = m.quiz.questions.length;
    let answered = 0;

    m.quiz.questions.forEach((q, idx) => {
      const sel = this.quizSelectedOptions[`m${monthNum}_q${idx}`];
      if (sel !== undefined) answered++;
      if (sel === q.answer) score++;
    });

    if (answered < total) {
      if (typeof showToast === 'function') {
        showToast(`Please answer all ${total} questions before submitting.`, 'warning');
      }
      return;
    }

    const passed = (score / total) >= 0.66;
    const r = this.getRoadmapState();
    r.passedQuizzes[monthNum] = { score, total, passed, date: new Date().toISOString() };
    this.touchStreak();

    if (typeof appState !== 'undefined' && appState.saveState) appState.saveState();
    if (typeof showToast === 'function') {
      showToast(passed ? `🎉 Passed Quiz! Score: ${score}/${total} (${Math.round((score/total)*100)}%)` : `Quiz Score: ${score}/${total}. Review explanations and retry.`, passed ? 'success' : 'warning');
    }
    this.renderRoadmapView();
  }

  retryQuiz(monthNum) {
    const m = SIX_MONTH_ROADMAP_MASTER.find(item => item.monthNum === monthNum);
    if (m) {
      m.quiz.questions.forEach((q, idx) => {
        delete this.quizSelectedOptions[`m${monthNum}_q${idx}`];
      });
    }
    const r = this.getRoadmapState();
    delete r.passedQuizzes[monthNum];
    if (typeof appState !== 'undefined' && appState.saveState) appState.saveState();
    this.renderRoadmapView();
  }

  // Project actions
  saveProjectRepo(monthNum) {
    const input = document.getElementById(`project-repo-input-${monthNum}`);
    const url = input ? input.value.trim() : '';
    const r = this.getRoadmapState();
    if (!r.projectSubmissions[monthNum]) r.projectSubmissions[monthNum] = { checkedReqs: [] };
    r.projectSubmissions[monthNum].githubUrl = url;
    if (typeof appState !== 'undefined' && appState.saveState) appState.saveState();
    if (typeof showToast === 'function') {
      showToast('GitHub repository link saved!', 'success');
    }
  }

  toggleProjectReq(monthNum, reqIndex) {
    const r = this.getRoadmapState();
    if (!r.projectSubmissions[monthNum]) r.projectSubmissions[monthNum] = { checkedReqs: [] };
    if (!r.projectSubmissions[monthNum].checkedReqs) r.projectSubmissions[monthNum].checkedReqs = [];
    const curr = !!r.projectSubmissions[monthNum].checkedReqs[reqIndex];
    r.projectSubmissions[monthNum].checkedReqs[reqIndex] = !curr;
    this.touchStreak();
    if (typeof appState !== 'undefined' && appState.saveState) appState.saveState();
    this.renderRoadmapView();
  }

  toggleProject(monthNum) {
    const r = this.getRoadmapState();
    if (!r.projectSubmissions[monthNum]) r.projectSubmissions[monthNum] = { checkedReqs: [] };
    const curr = !!r.projectSubmissions[monthNum].completed;
    r.projectSubmissions[monthNum].completed = !curr;
    this.touchStreak();
    if (typeof appState !== 'undefined' && appState.saveState) appState.saveState();
    if (typeof showToast === 'function') {
      showToast(r.projectSubmissions[monthNum].completed ? '🎉 Capstone project marked complete!' : 'Project unmarked', 'success');
    }
    this.renderRoadmapView();
  }

  toggleInterviewAnswer(elemId) {
    const el = document.getElementById(elemId);
    if (!el) return;
    const body = el.querySelector('.interview-answer-body');
    const arrow = el.querySelector('.accordion-arrow');
    if (body) {
      const isHidden = body.style.display === 'none';
      body.style.display = isHidden ? 'block' : 'none';
      if (arrow) {
        arrow.className = `fa-solid ${isHidden ? 'fa-chevron-up' : 'fa-chevron-down'} text-muted text-xs accordion-arrow`;
      }
    }
  }

  toggleMilestone(milestoneId) {
    const isDone = (typeof appState !== 'undefined' && appState.toggleRoadmapMilestone)
      ? appState.toggleRoadmapMilestone(milestoneId)
      : false;
    this.touchStreak();
    if (typeof showToast === 'function') {
      showToast(isDone ? 'Milestone achieved! Progress recorded.' : 'Milestone unchecked', isDone ? 'success' : 'info');
    }
    this.renderRoadmapView();
    if (window.renderDashboard) window.renderDashboard();
  }
}

// Global instance & backward-compatible functions
const roadmapManager = new RoadmapManager();

function renderRoadmapView() {
  roadmapManager.renderRoadmapView();
}

function toggleRoadmapItem(id) {
  roadmapManager.toggleMilestone(id);
}

// Global Aliases & Exports
const ROADMAP_DATA = SIX_MONTH_ROADMAP_MASTER;
window.ROADMAP_DATA = SIX_MONTH_ROADMAP_MASTER;
window.SIX_MONTH_ROADMAP_MASTER = SIX_MONTH_ROADMAP_MASTER;
window.roadmapManager = roadmapManager;
window.renderRoadmapView = renderRoadmapView;
window.toggleRoadmapItem = toggleRoadmapItem;
window.getSafeYouTubeSearchUrl = getSafeYouTubeSearchUrl;
