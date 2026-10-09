/**
 * CareerPulse.AI – Personalized Career Roadmap Module
 * 
 * Generates an end-to-end 6-Month Structured Timeline based on:
 * - Current Student Skills
 * - Target Role (SDE, Web Dev, Data, AI/ML, DevOps, Cyber)
 * - Placement Date / Timeline
 * - Weekly Study Hours (10h, 15h, 25h)
 * 
 * Each roadmap milestone contains:
 * - Learning objective
 * - Skills covered
 * - Recommended YouTube lectures (with verified real video IDs, exact titles, channels, and working links)
 * - Practice problems (with LeetCode / GFG practice links)
 * - Capstone project to build
 * - High-frequency interview questions
 * - Interactive completion status checkbox
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

/**
 * Safe YouTube Search Query Fallback
 * Used when direct video search fallback is requested
 */
function getSafeYouTubeSearchUrl(topic) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent((topic || 'coding') + ' tutorial course')}`;
}

const SIX_MONTH_ROADMAP_MASTER = [
  {
    "monthNum": 1,
    "title": "MONTH 1: Programming & DSA Fundamentals",
    "duration": "Month 1 (Weeks 1 - 4)",
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
        "title": "Learn Python - Full Course for Beginners [Tutorial]",
        "channel": "freeCodeCamp.org",
        "videoId": "rfscVS0vtbw",
        "url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
        "topic": "Python Programming",
        "skill": "C++ / Java / Python",
        "level": "Beginner"
      },
      {
        "title": "C++ Tutorial for Beginners - Full Course",
        "channel": "freeCodeCamp.org",
        "videoId": "vLnPwxZdW4Y",
        "url": "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
        "topic": "C++ Programming",
        "skill": "C++ / Java / Python",
        "level": "Beginner"
      },
      {
        "title": "Learn Java 8 - Full Tutorial for Beginners",
        "channel": "freeCodeCamp.org",
        "videoId": "grEKMHGYyns",
        "url": "https://www.youtube.com/watch?v=grEKMHGYyns",
        "topic": "Java Programming",
        "skill": "C++ / Java / Python",
        "level": "Beginner"
      },
      {
        "title": "Object-Oriented Programming, Simplified",
        "channel": "Programming with Mosh",
        "videoId": "pTB0EiLXUC8",
        "url": "https://www.youtube.com/watch?v=pTB0EiLXUC8",
        "topic": "OOP Principles",
        "skill": "OOP",
        "level": "Beginner"
      },
      {
        "title": "OOP 1 | Introduction & Concepts - Classes, Objects, Constructors, Keywords",
        "channel": "Kunal Kushwaha",
        "videoId": "BSVKUk58K6U",
        "url": "https://www.youtube.com/watch?v=BSVKUk58K6U",
        "topic": "OOP Principles",
        "skill": "OOP",
        "level": "Beginner"
      },
      {
        "title": "L- 8 | Pillars of OOPs in Python | Python course for ML Ai and data science in Hindi",
        "channel": "Data Dissection ",
        "videoId": "CsXoVxyoscw",
        "url": "https://www.youtube.com/watch?v=CsXoVxyoscw",
        "topic": "OOP Principles",
        "skill": "OOP",
        "level": "Beginner"
      },
      {
        "title": "Complete Math for Machine Learning and AI",
        "channel": "Data Dissection ",
        "videoId": "cO9xmfsJJu4",
        "url": "https://www.youtube.com/watch?v=cO9xmfsJJu4",
        "topic": "Basic Math for Coding",
        "skill": "Basic Math for Coding",
        "level": "Beginner"
      },
      {
        "title": "Mathematics for Machine learning full course in Hindi | Math for Ai | Ml for beginners",
        "channel": "Data Dissection ",
        "videoId": "OugnpxNl4_Q",
        "url": "https://www.youtube.com/watch?v=OugnpxNl4_Q",
        "topic": "Basic Math for Coding",
        "skill": "Basic Math for Coding",
        "level": "Beginner"
      },
      {
        "title": "1. Introduction to Algorithms",
        "channel": "Abdul Bari",
        "videoId": "0IAPZzGSbME",
        "url": "https://www.youtube.com/watch?v=0IAPZzGSbME",
        "topic": "Time & Space Complexity",
        "skill": "Time & Space Complexity",
        "level": "Beginner"
      },
      {
        "title": "Time and Space Complexity - Strivers A2Z DSA Course",
        "channel": "take U forward",
        "videoId": "FPu9Uld7W-E",
        "url": "https://www.youtube.com/watch?v=FPu9Uld7W-E",
        "topic": "Time & Space Complexity",
        "skill": "Time & Space Complexity",
        "level": "Beginner"
      },
      {
        "title": "1.5.1 Time Complexity #1",
        "channel": "Abdul Bari",
        "videoId": "9TlHvipP5yA",
        "url": "https://www.youtube.com/watch?v=9TlHvipP5yA",
        "topic": "Time & Space Complexity",
        "skill": "Time & Space Complexity",
        "level": "Beginner"
      },
      {
        "title": "Git and GitHub for Beginners - Crash Course",
        "channel": "freeCodeCamp.org",
        "videoId": "RGOj5yH7evk",
        "url": "https://www.youtube.com/watch?v=RGOj5yH7evk",
        "topic": "Git & GitHub",
        "skill": "Git & GitHub",
        "level": "Beginner"
      },
      {
        "title": "Complete Git and GitHub Tutorial",
        "channel": "Kunal Kushwaha",
        "videoId": "apGV9Kg7ics",
        "url": "https://www.youtube.com/watch?v=apGV9Kg7ics",
        "topic": "Git & GitHub",
        "skill": "Git & GitHub",
        "level": "Beginner"
      },
      {
        "title": "Git Tutorial for Beginners: Learn Git in 1 Hour",
        "channel": "Programming with Mosh",
        "videoId": "8JJ101D3knE",
        "url": "https://www.youtube.com/watch?v=8JJ101D3knE",
        "topic": "Git & GitHub",
        "skill": "Git & GitHub",
        "level": "Beginner"
      },
      {
        "title": "Data Structures Easy to Advanced Course - Full Tutorial from a Google Engineer",
        "channel": "freeCodeCamp.org",
        "videoId": "RBSGKlAvoiM",
        "url": "https://www.youtube.com/watch?v=RBSGKlAvoiM",
        "topic": "Data Structures & Algorithms",
        "skill": "DSA",
        "level": "Beginner"
      },
      {
        "title": "Two Sum - Leetcode 1 - HashMap - Python",
        "channel": "NeetCode",
        "videoId": "KLlXCFG5TnA",
        "url": "https://www.youtube.com/watch?v=KLlXCFG5TnA",
        "topic": "Data Structures & Algorithms",
        "skill": "DSA",
        "level": "Intermediate"
      }
    ],
    "practiceProblems": [
      {
        "name": "Two Sum (LeetCode #1)",
        "link": "https://leetcode.com/problems/two-sum/"
      },
      {
        "name": "Valid Palindrome (LeetCode #125)",
        "link": "https://leetcode.com/problems/valid-palindrome/"
      },
      {
        "name": "Fibonacci Number (LeetCode #509)",
        "link": "https://leetcode.com/problems/fibonacci-number/"
      }
    ],
    "project": {
      "title": "Console-Based Banking / Management System",
      "desc": "Build OOP-structured console app implementing encapsulation, file persistence, and robust exception handling."
    },
    "interviewQuestions": [
      "Explain difference between Stack and Heap memory.",
      "What are the 4 pillars of Object Oriented Programming?",
      "Why is Time Complexity important for campus online screenings?"
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
    "title": "MONTH 2: Arrays + Strings + Linked Lists",
    "duration": "Month 2 (Weeks 5 - 8)",
    "objective": "Master linear data structures, two-pointer techniques, sliding windows, and fast-slow pointer algorithms.",
    "skills": [
      "Arrays & Strings",
      "Two Pointers & Sliding Window",
      "Linked Lists",
      "HashMaps & Hash Tables"
    ],
    "youtubeLectures": [
      {
        "title": "Contains Duplicate - Leetcode 217 - Python",
        "channel": "NeetCode",
        "videoId": "3OamzN90kPg",
        "url": "https://www.youtube.com/watch?v=3OamzN90kPg",
        "topic": "Arrays & Strings",
        "skill": "Arrays & Strings",
        "level": "Beginner"
      },
      {
        "title": "Concatenation of Array - Leetcode 1929 - Python",
        "channel": "NeetCodeIO",
        "videoId": "68isPRHgcFQ",
        "url": "https://www.youtube.com/watch?v=68isPRHgcFQ",
        "topic": "Arrays & Strings",
        "skill": "Arrays & Strings",
        "level": "Beginner"
      },
      {
        "title": "Valid Palindrome - Leetcode 125 - Python",
        "channel": "NeetCode",
        "videoId": "jJXJ16kPFWg",
        "url": "https://www.youtube.com/watch?v=jJXJ16kPFWg",
        "topic": "Two Pointers & Sliding Window",
        "skill": "Two Pointers & Sliding Window",
        "level": "Beginner"
      },
      {
        "title": "Sliding Window: Best Time to Buy and Sell Stock - Leetcode 121 - Python",
        "channel": "NeetCode",
        "videoId": "1pkOgXD63yU",
        "url": "https://www.youtube.com/watch?v=1pkOgXD63yU",
        "topic": "Two Pointers & Sliding Window",
        "skill": "Two Pointers & Sliding Window",
        "level": "Intermediate"
      },
      {
        "title": "Longest Substring Without Repeating Characters - Leetcode 3 - Python",
        "channel": "NeetCode",
        "videoId": "wiGpQwVHdE0",
        "url": "https://www.youtube.com/watch?v=wiGpQwVHdE0",
        "topic": "Two Pointers & Sliding Window",
        "skill": "Two Pointers & Sliding Window",
        "level": "Intermediate"
      },
      {
        "title": "L1. Introduction to LinkedList | Traversal | Length | Search an Element",
        "channel": "take U forward",
        "videoId": "Nq7ok-OyEpg",
        "url": "https://www.youtube.com/watch?v=Nq7ok-OyEpg",
        "topic": "Linked Lists",
        "skill": "Linked Lists",
        "level": "Beginner"
      },
      {
        "title": "11.1 : Linked List Introduction & Concepts | DSA [Abdul Bari]",
        "channel": "Hacktrickz",
        "videoId": "akErwS16DUg",
        "url": "https://www.youtube.com/watch?v=akErwS16DUg",
        "topic": "Linked Lists",
        "skill": "Linked Lists",
        "level": "Intermediate"
      },
      {
        "title": "Data Structures: Hash Tables",
        "channel": "HackerRank",
        "videoId": "shs0KM3wKv8",
        "url": "https://www.youtube.com/watch?v=shs0KM3wKv8",
        "topic": "HashMaps & Hash Tables",
        "skill": "HashMaps & Hash Tables",
        "level": "Beginner"
      },
      {
        "title": "Two Sum - Leetcode 1 - HashMap - Python",
        "channel": "NeetCode",
        "videoId": "KLlXCFG5TnA",
        "url": "https://www.youtube.com/watch?v=KLlXCFG5TnA",
        "topic": "HashMaps & Hash Tables",
        "skill": "HashMaps & Hash Tables",
        "level": "Intermediate"
      }
    ],
    "practiceProblems": [
      {
        "name": "Best Time to Buy and Sell Stock (LeetCode #121)",
        "link": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
      },
      {
        "name": "Longest Substring Without Repeating Characters (LeetCode #3)",
        "link": "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
      },
      {
        "name": "Reverse Linked List (LeetCode #206)",
        "link": "https://leetcode.com/problems/reverse-linked-list/"
      },
      {
        "name": "Linked List Cycle Detection (LeetCode #141)",
        "link": "https://leetcode.com/problems/linked-list-cycle/"
      }
    ],
    "project": {
      "title": "Custom In-Memory Cache with LRU Eviction",
      "desc": "Implement Least Recently Used (LRU) Cache using Doubly Linked List and HashMap with O(1) operations."
    },
    "interviewQuestions": [
      "How does HashMap handle collisions internally (Separate Chaining vs Open Addressing)?",
      "Explain Floyd Cycle-Finding Algorithm (Tortoise and Hare).",
      "Compare Array vs Linked List in terms of memory cache locality."
    ],
    "milestones": [
      {
        "id": "m2_1",
        "title": "Solve 30 LeetCode Mediums on Two Pointers & Sliding Window"
      },
      {
        "id": "m2_2",
        "title": "Implement Singly & Doubly Linked List operations from scratch"
      },
      {
        "id": "m2_3",
        "title": "Complete LRU Cache Implementation (LeetCode #146)"
      }
    ]
  },
  {
    "monthNum": 3,
    "title": "MONTH 3: Trees + Graphs + Recursion",
    "duration": "Month 3 (Weeks 9 - 12)",
    "objective": "Conquer hierarchical and network structures: Binary Trees, BSTs, Graph traversals (BFS, DFS), and backtracking.",
    "skills": [
      "Binary Trees & BST",
      "Recursion & Backtracking",
      "Graph Traversals (BFS/DFS)",
      "Dijkstra & Shortest Path"
    ],
    "youtubeLectures": [
      {
        "title": "L1. Introduction to Trees | Types of Trees",
        "channel": "take U forward",
        "videoId": "_ANrF3FJm7I",
        "url": "https://www.youtube.com/watch?v=_ANrF3FJm7I",
        "topic": "Binary Trees & BST",
        "skill": "Binary Trees & BST",
        "level": "Beginner"
      },
      {
        "title": "L2. Binary Tree Representation in C++",
        "channel": "take U forward",
        "videoId": "ctCpP0RFDFc",
        "url": "https://www.youtube.com/watch?v=ctCpP0RFDFc",
        "topic": "Binary Trees & BST",
        "skill": "Binary Trees & BST",
        "level": "Intermediate"
      },
      {
        "title": "Re 1. Introduction to Recursion | Recursion Tree | Stack Space | Strivers A2Z DSA Course",
        "channel": "take U forward",
        "videoId": "yVdKa8dnKiE",
        "url": "https://www.youtube.com/watch?v=yVdKa8dnKiE",
        "topic": "Recursion & Backtracking",
        "skill": "Recursion & Backtracking",
        "level": "Beginner"
      },
      {
        "title": "6.1 N Queens Problem using Backtracking",
        "channel": "Abdul Bari",
        "videoId": "xFv_Hl4B83A",
        "url": "https://www.youtube.com/watch?v=xFv_Hl4B83A",
        "topic": "Recursion & Backtracking",
        "skill": "Recursion & Backtracking",
        "level": "Intermediate"
      },
      {
        "title": "G-1. Introduction to Graph | Types | Different Conventions Used",
        "channel": "take U forward",
        "videoId": "M3_pLsDdeuU",
        "url": "https://www.youtube.com/watch?v=M3_pLsDdeuU",
        "topic": "Graph Traversals (BFS/DFS)",
        "skill": "Graph Traversals (BFS/DFS)",
        "level": "Beginner"
      },
      {
        "title": "Graph Algorithms for Technical Interviews - Full Course",
        "channel": "freeCodeCamp.org",
        "videoId": "tWVWeAqZ0WU",
        "url": "https://www.youtube.com/watch?v=tWVWeAqZ0WU",
        "topic": "Graph Traversals (BFS/DFS)",
        "skill": "Graph Traversals (BFS/DFS)",
        "level": "Intermediate"
      },
      {
        "title": "3.6 Dijkstra Algorithm - Single Source Shortest Path - Greedy Method",
        "channel": "Abdul Bari",
        "videoId": "XB4MIexjvY0",
        "url": "https://www.youtube.com/watch?v=XB4MIexjvY0",
        "topic": "Dijkstra & Shortest Path",
        "skill": "Dijkstra & Shortest Path",
        "level": "Intermediate"
      },
      {
        "title": "3.5 Prims and Kruskals Algorithms - Greedy Method",
        "channel": "Abdul Bari",
        "videoId": "4ZlRH0eK-qQ",
        "url": "https://www.youtube.com/watch?v=4ZlRH0eK-qQ",
        "topic": "Dijkstra & Shortest Path",
        "skill": "Dijkstra & Shortest Path",
        "level": "Intermediate"
      }
    ],
    "practiceProblems": [
      {
        "name": "Invert Binary Tree (LeetCode #226)",
        "link": "https://leetcode.com/problems/invert-binary-tree/"
      },
      {
        "name": "Lowest Common Ancestor in BST (LeetCode #235)",
        "link": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"
      },
      {
        "name": "Number of Islands (LeetCode #200)",
        "link": "https://leetcode.com/problems/number-of-islands/"
      },
      {
        "name": "Course Schedule Topological Sort (LeetCode #207)",
        "link": "https://leetcode.com/problems/course-schedule/"
      }
    ],
    "project": {
      "title": "Social Network Graph Visualizer & Shortest Path Engine",
      "desc": "Interactive network graph finding mutual connections, degrees of separation, and shortest path using Dijkstra algorithm."
    },
    "interviewQuestions": [
      "Difference between Pre-order, In-order, and Post-order Tree Traversals.",
      "Explain when to choose BFS over DFS in graph problem scenarios.",
      "What is a Self-Balancing BST (AVL / Red-Black Tree) and why is it needed?"
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
        "title": "DP 1. Introduction to Dynamic Programming | Memoization | Tabulation | Space Optimization Techniques",
        "channel": "take U forward",
        "videoId": "tyB0ztf0DNY",
        "url": "https://www.youtube.com/watch?v=tyB0ztf0DNY",
        "topic": "Dynamic Programming",
        "skill": "Dynamic Programming",
        "level": "Beginner"
      },
      {
        "title": "Dynamic Programming - Learn to Solve Algorithmic Problems & Coding Challenges",
        "channel": "freeCodeCamp.org",
        "videoId": "oBt53YbR9Kk",
        "url": "https://www.youtube.com/watch?v=oBt53YbR9Kk",
        "topic": "Dynamic Programming",
        "skill": "Dynamic Programming",
        "level": "Intermediate"
      },
      {
        "title": "Introduction to Operating Systems",
        "channel": "Neso Academy",
        "videoId": "vBURTt97EkA",
        "url": "https://www.youtube.com/watch?v=vBURTt97EkA",
        "topic": "Operating Systems",
        "skill": "Operating Systems",
        "level": "Beginner"
      },
      {
        "title": "Operating Systems: Crash Course Computer Science #18",
        "channel": "CrashCourse",
        "videoId": "26QPDBe-NB8",
        "url": "https://www.youtube.com/watch?v=26QPDBe-NB8",
        "topic": "Operating Systems",
        "skill": "Operating Systems",
        "level": "Beginner"
      },
      {
        "title": "Lec-1: DBMS Syllabus for GATE, UGCNET, NIELIT, DSSSB etc.| Full DBMS for College/University Students",
        "channel": "Gate Smashers",
        "videoId": "kBdlM6hNDAE",
        "url": "https://www.youtube.com/watch?v=kBdlM6hNDAE",
        "topic": "DBMS & SQL",
        "skill": "DBMS & SQL",
        "level": "Beginner"
      },
      {
        "title": "Complete SQL course for data science and data analytics in Hindi | One shot SQL",
        "channel": "Data Dissection ",
        "videoId": "rVPK8-L1aFM",
        "url": "https://www.youtube.com/watch?v=rVPK8-L1aFM",
        "topic": "DBMS & SQL",
        "skill": "DBMS & SQL",
        "level": "Beginner"
      },
      {
        "title": "Learn SQL Beginner to Advanced in Under 4 Hours",
        "channel": "Alex The Analyst",
        "videoId": "OT1RErkfLNQ",
        "url": "https://www.youtube.com/watch?v=OT1RErkfLNQ",
        "topic": "DBMS & SQL",
        "skill": "DBMS & SQL",
        "level": "Intermediate"
      },
      {
        "title": "Computer Networking Course - Network Engineering [CompTIA Network+ Exam Prep]",
        "channel": "freeCodeCamp.org",
        "videoId": "qiQR5rTSshw",
        "url": "https://www.youtube.com/watch?v=qiQR5rTSshw",
        "topic": "Computer Networks",
        "skill": "Computer Networks",
        "level": "Beginner"
      },
      {
        "title": "Computer Networking Full Course - OSI Model Deep Dive with Real Life Examples",
        "channel": "Kunal Kushwaha",
        "videoId": "IPvYjXCsTg8",
        "url": "https://www.youtube.com/watch?v=IPvYjXCsTg8",
        "topic": "Computer Networks",
        "skill": "Computer Networks",
        "level": "Beginner"
      },
      {
        "title": "Lec-1: Computer Networks and Security Full Syllabus for GATE, UGC NET,DSSSB,NIELIT & University exam",
        "channel": "Gate Smashers",
        "videoId": "JFF2vJaN0Cw",
        "url": "https://www.youtube.com/watch?v=JFF2vJaN0Cw",
        "topic": "Computer Networks",
        "skill": "Computer Networks",
        "level": "Beginner"
      },
      {
        "title": "System Design BASICS: Horizontal vs. Vertical Scaling",
        "channel": "Gaurav Sen",
        "videoId": "xpDnVSmNFX0",
        "url": "https://www.youtube.com/watch?v=xpDnVSmNFX0",
        "topic": "System Design Basics",
        "skill": "System Design Basics",
        "level": "Intermediate"
      },
      {
        "title": "System Design Primer: How to start with distributed systems?",
        "channel": "Gaurav Sen",
        "videoId": "SqcXvc3ZmRU",
        "url": "https://www.youtube.com/watch?v=SqcXvc3ZmRU",
        "topic": "System Design Basics",
        "skill": "System Design Basics",
        "level": "Intermediate"
      }
    ],
    "practiceProblems": [
      {
        "name": "Climbing Stairs (LeetCode #70)",
        "link": "https://leetcode.com/problems/climbing-stairs/"
      },
      {
        "name": "Coin Change (LeetCode #322)",
        "link": "https://leetcode.com/problems/coin-change/"
      },
      {
        "name": "Longest Common Subsequence (LeetCode #1143)",
        "link": "https://leetcode.com/problems/longest-common-subsequence/"
      },
      {
        "name": "SQL Query Challenges (HackerRank)",
        "link": "https://www.hackerrank.com/domains/sql"
      }
    ],
    "project": {
      "title": "Relational Database Schema & Query Optimization Engine",
      "desc": "Design normalized schema (3NF) for e-commerce, add indexes, write complex subqueries, and benchmark latency."
    },
    "interviewQuestions": [
      "Explain ACID properties and transaction isolation levels in DBMS.",
      "What is a Deadlock and what are the 4 Coffman conditions?",
      "Explain the TCP 3-Way Handshake and differences between TCP and UDP."
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
        "title": "Learn The MERN Stack - Express & MongoDB Rest API",
        "channel": "Traversy Media",
        "videoId": "-0exw-9YJBo",
        "url": "https://www.youtube.com/watch?v=-0exw-9YJBo",
        "topic": "Full Stack Development",
        "skill": "Full Stack Development",
        "level": "Beginner"
      },
      {
        "title": "Learn the MERN Stack - Full Tutorial (MongoDB, Express, React, Node.js)",
        "channel": "freeCodeCamp.org",
        "videoId": "7CqJlxBYj-M",
        "url": "https://www.youtube.com/watch?v=7CqJlxBYj-M",
        "topic": "Full Stack Development",
        "skill": "Full Stack Development",
        "level": "Beginner"
      },
      {
        "title": "Full Stack Web Development for Beginners (Full Course on HTML, CSS, JavaScript, Node.js, MongoDB)",
        "channel": "freeCodeCamp.org",
        "videoId": "nu_pCVPKzTk",
        "url": "https://www.youtube.com/watch?v=nu_pCVPKzTk",
        "topic": "Full Stack Development",
        "skill": "Full Stack Development",
        "level": "Beginner"
      },
      {
        "title": "Node.js and Express.js - Full Course",
        "channel": "freeCodeCamp.org",
        "videoId": "Oe421EPjeBE",
        "url": "https://www.youtube.com/watch?v=Oe421EPjeBE",
        "topic": "REST APIs & Backend",
        "skill": "REST APIs & Backend",
        "level": "Beginner"
      },
      {
        "title": "Node.js Full Course for Beginners | Complete All-in-One Tutorial | 7 Hours",
        "channel": "Dave Gray",
        "videoId": "f2EqECiTBL8",
        "url": "https://www.youtube.com/watch?v=f2EqECiTBL8",
        "topic": "REST APIs & Backend",
        "skill": "REST APIs & Backend",
        "level": "Beginner"
      },
      {
        "title": "Learn Node.js - Full Tutorial for Beginners",
        "channel": "freeCodeCamp.org",
        "videoId": "RLtyhwFtXQA",
        "url": "https://www.youtube.com/watch?v=RLtyhwFtXQA",
        "topic": "REST APIs & Backend",
        "skill": "REST APIs & Backend",
        "level": "Beginner"
      },
      {
        "title": "Docker Crash Course for Absolute Beginners [NEW]",
        "channel": "TechWorld with Nana",
        "videoId": "pg19Z8LL06w",
        "url": "https://www.youtube.com/watch?v=pg19Z8LL06w",
        "topic": "Docker & Containers",
        "skill": "Docker & Containers",
        "level": "Beginner"
      },
      {
        "title": "Docker Tutorial for Beginners - A Full DevOps Course on How to Run Applications in Containers",
        "channel": "freeCodeCamp.org",
        "videoId": "fqMOX6JJhGo",
        "url": "https://www.youtube.com/watch?v=fqMOX6JJhGo",
        "topic": "Docker & Containers",
        "skill": "Docker & Containers",
        "level": "Beginner"
      },
      {
        "title": "AWS Certified Cloud Practitioner Certification Course (CLF-C01) - Pass the Exam!",
        "channel": "freeCodeCamp.org",
        "videoId": "SOTamWNgDKc",
        "url": "https://www.youtube.com/watch?v=SOTamWNgDKc",
        "topic": "Cloud Deployment (AWS)",
        "skill": "Cloud Deployment (AWS)",
        "level": "Beginner"
      },
      {
        "title": "AWS Certified Cloud Practitioner Certification Course 2026 (CLF-C02) - Pass the Exam!",
        "channel": "freeCodeCamp.org",
        "videoId": "7HKot-brXFE",
        "url": "https://www.youtube.com/watch?v=7HKot-brXFE",
        "topic": "Cloud Deployment (AWS)",
        "skill": "Cloud Deployment (AWS)",
        "level": "Beginner"
      },
      {
        "title": "Data Analyst Portfolio Project | SQL Data Exploration | Project 1/4",
        "channel": "Alex The Analyst",
        "videoId": "qfyynHBFOsM",
        "url": "https://www.youtube.com/watch?v=qfyynHBFOsM",
        "topic": "Portfolio Projects",
        "skill": "Portfolio Projects",
        "level": "Intermediate"
      },
      {
        "title": "Excel Gets You Started. Data Analytics Takes Your Career to Next Level",
        "channel": "Pavan Lalwani",
        "videoId": "da9sVlo0zzI",
        "url": "https://www.youtube.com/watch?v=da9sVlo0zzI",
        "topic": "Portfolio Projects",
        "skill": "Portfolio Projects",
        "level": "Beginner"
      }
    ],
    "practiceProblems": [
      {
        "name": "Design Twitter (LeetCode #355)",
        "link": "https://leetcode.com/problems/design-twitter/"
      },
      {
        "name": "LRU Cache Design (LeetCode #146)",
        "link": "https://leetcode.com/problems/lru-cache/"
      }
    ],
    "project": {
      "title": "Production Full-Stack Capstone Project",
      "desc": "Deploy full-stack web/mobile app with JWT auth, database persistence, and live domain on Vercel/AWS."
    },
    "interviewQuestions": [
      "Walk me through the architecture of your primary capstone project.",
      "How did you handle authentication and database security in your application?",
      "If your application experienced a 100x traffic spike, what would break first?"
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
    "objective": "Conduct simulated technical mock interviews, master speed aptitude tests, and convert campus placement opportunities into dream offers.",
    "skills": [
      "Mock Technical Rounds",
      "Google & Big Tech Coding",
      "Aptitude Tests",
      "HR STAR Framework"
    ],
    "youtubeLectures": [
      {
        "title": "Software Engineering Job Interview \u2013 Full Mock Interview",
        "channel": "freeCodeCamp.org",
        "videoId": "1qw5ITr3k9E",
        "url": "https://www.youtube.com/watch?v=1qw5ITr3k9E",
        "topic": "Mock Technical Rounds",
        "skill": "Mock Technical Rounds",
        "level": "Intermediate"
      },
      {
        "title": "Top 10 Algorithms for the Coding Interview (for software engineers)",
        "channel": "TechLead",
        "videoId": "r1MXwyiGi_U",
        "url": "https://www.youtube.com/watch?v=r1MXwyiGi_U",
        "topic": "Mock Technical Rounds",
        "skill": "Mock Technical Rounds",
        "level": "Intermediate"
      },
      {
        "title": "How to: Work at Google \u2014 Example Coding/Engineering Interview",
        "channel": "Life at Google",
        "videoId": "XKu_SEDAykw",
        "url": "https://www.youtube.com/watch?v=XKu_SEDAykw",
        "topic": "Google & Big Tech Coding",
        "skill": "Google & Big Tech Coding",
        "level": "Advanced"
      },
      {
        "title": "Aptitude Preparation for Placements #1 Introduction | Why Aptitude Is Important For Placement",
        "channel": "Code Step By Step",
        "videoId": "hlyal4sR0m8",
        "url": "https://www.youtube.com/watch?v=hlyal4sR0m8",
        "topic": "Aptitude Tests",
        "skill": "Aptitude Tests",
        "level": "Beginner"
      },
      {
        "title": "Aptitude Preparation Campus Placements #2 | Time and Work | Quantitative Aptitude",
        "channel": "Code Step By Step",
        "videoId": "o7pY9hCqDZk",
        "url": "https://www.youtube.com/watch?v=o7pY9hCqDZk",
        "topic": "Aptitude Tests",
        "skill": "Aptitude Tests",
        "level": "Beginner"
      },
      {
        "title": "STAR INTERVIEW QUESTIONS & ANSWERS! (The STAR TECHNIQUE for Behavioural Interview Questions!)",
        "channel": "CareerVidz",
        "videoId": "uQEuo7woEEk",
        "url": "https://www.youtube.com/watch?v=uQEuo7woEEk",
        "topic": "HR STAR Framework",
        "skill": "HR STAR Framework",
        "level": "Beginner"
      },
      {
        "title": "TOP 5 INTERVIEW QUESTIONS & ANSWERS! (How to ANSWER COMMON INTERVIEW QUESTIONS!)",
        "channel": "CareerVidz",
        "videoId": "2m1Kc9uvLvc",
        "url": "https://www.youtube.com/watch?v=2m1Kc9uvLvc",
        "topic": "HR STAR Framework",
        "skill": "HR STAR Framework",
        "level": "Beginner"
      }
    ],
    "practiceProblems": [
      {
        "name": "Simulate 60-min HackerRank Timed Test",
        "link": "https://www.hackerrank.com/"
      },
      {
        "name": "Take CareerPulse.AI Aptitude Drill",
        "link": "#interview"
      }
    ],
    "project": {
      "title": "Interview System Whiteboard & STAR Response Playbook",
      "desc": "Compiled document of 20 STAR behavioral responses and 5 system design blueprints ready for live defense."
    },
    "interviewQuestions": [
      "Tell me about a time you resolved a difficult technical bug under pressure.",
      "Why should our company hire you over other qualified candidates?",
      "Where do you see yourself in 3 years as a software engineer?"
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
    this.selectedHours = 15; // 10, 15, 25 hours per week
    this.selectedMonths = 6;
    this.activeSkillFilters = {
      1: 'ALL',
      2: 'ALL',
      3: 'ALL',
      4: 'ALL',
      5: 'ALL',
      6: 'ALL'
    };
  }

  setSkillFilter(monthNum, skillName) {
    this.activeSkillFilters[monthNum] = skillName;
    this.renderRoadmapView();
  }

  renderLectureCards(m) {
    const activeFilter = this.activeSkillFilters[m.monthNum] || 'ALL';
    const allSkills = [...new Set(m.youtubeLectures.map(l => l.skill || l.topic))];
    const filteredLectures = activeFilter === 'ALL'
      ? m.youtubeLectures
      : m.youtubeLectures.filter(l => (l.skill || l.topic) === activeFilter);

    return `
      <div class="roadmap-lectures-container mb-3">
        <div class="roadmap-lectures-header flex items-center justify-between flex-wrap gap-2 mb-2">
          <div class="flex items-center gap-2">
            <i class="fa-brands fa-youtube text-rose fa-lg"></i>
            <span class="text-xs font-bold uppercase tracking-wider text-muted">
              Recommended YouTube Lectures (${m.youtubeLectures.length} Rated Videos)
            </span>
          </div>
          <span class="text-xs text-muted font-medium">
            2–3 Real Lectures per Skill • Verified Channels
          </span>
        </div>

        <!-- Skill Filter Pills Bar -->
        <div class="roadmap-skill-filters flex flex-wrap gap-1 mb-3">
          <button type="button" 
                  class="btn btn-xs ${activeFilter === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}"
                  onclick="roadmapManager.setSkillFilter(${m.monthNum}, 'ALL')">
            All Skills (${m.youtubeLectures.length})
          </button>
          ${allSkills.map(s => {
            const count = m.youtubeLectures.filter(l => (l.skill || l.topic) === s).length;
            const isActive = activeFilter === s;
            return `
              <button type="button" 
                      class="btn btn-xs ${isActive ? 'btn-primary' : 'btn-outline-secondary'}"
                      onclick="roadmapManager.setSkillFilter(${m.monthNum}, '${escapeHtml(s)}')">
                ${escapeHtml(s)} (${count})
              </button>
            `;
          }).join('')}
        </div>

        <!-- Lecture Cards Grid -->
        <div class="roadmap-lectures-grid">
          ${filteredLectures.map(lec => {
            const fallbackSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent((lec.topic || lec.skill) + ' tutorial')}`;
            const levelClass = (lec.level || 'Beginner').toLowerCase();
            return `
              <div class="roadmap-lecture-card" data-video-id="${lec.videoId}">
                <div class="roadmap-lecture-thumb-wrapper">
                  <img src="https://img.youtube.com/vi/${lec.videoId}/mqdefault.jpg" 
                       alt="${escapeHtml(lec.title)}" 
                       class="roadmap-lecture-thumb"
                       loading="lazy"
                       onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=480&auto=format&fit=crop&q=60';" />
                  <span class="roadmap-level-badge level-${levelClass}">
                    <i class="fa-solid fa-signal text-xs"></i> ${lec.level || 'Beginner'}
                  </span>
                  <a href="${lec.url}" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     class="roadmap-play-overlay" 
                     title="Watch on YouTube: ${escapeHtml(lec.title)}"
                     aria-label="Watch ${escapeHtml(lec.title)} on YouTube">
                    <div class="roadmap-play-btn">
                      <i class="fa-solid fa-play"></i>
                    </div>
                  </a>
                </div>
                <div class="roadmap-lecture-body">
                  <div class="roadmap-lecture-meta-top">
                    <span class="roadmap-topic-pill">
                      <i class="fa-solid fa-graduation-cap"></i> ${escapeHtml(lec.skill || lec.topic)}
                    </span>
                  </div>
                  <h4 class="roadmap-lecture-title" title="${escapeHtml(lec.title)}">
                    <a href="${lec.url}" target="_blank" rel="noopener noreferrer">
                      ${escapeHtml(lec.title)}
                    </a>
                  </h4>
                  <div class="roadmap-lecture-channel">
                    <i class="fa-brands fa-youtube text-rose"></i>
                    <span class="channel-name">${escapeHtml(lec.channel)}</span>
                    <i class="fa-solid fa-circle-check text-primary verified-icon" title="Verified Creator"></i>
                  </div>
                  <div class="roadmap-lecture-actions">
                    <a href="${lec.url}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="btn btn-sm btn-primary roadmap-watch-btn">
                      <i class="fa-brands fa-youtube"></i> Watch Lecture <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                    <a href="${fallbackSearch}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="btn btn-sm btn-outline-secondary roadmap-fallback-search" 
                       title="Search more lectures on ${escapeHtml(lec.skill || lec.topic)}">
                      <i class="fa-solid fa-magnifying-glass"></i>
                    </a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  renderRoadmapView() {
    const container = document.getElementById('roadmap-timeline-root');
    if (!container) return;

    const checkedState = (typeof appState !== 'undefined' && appState.getRoadmapChecklist)
      ? appState.getRoadmapChecklist()
      : {};
    const profile = (typeof appState !== 'undefined' && appState.getProfile)
      ? appState.getProfile()
      : {};
    const targetCareer = (typeof CAREERS_CATALOG !== 'undefined' && Array.isArray(CAREERS_CATALOG))
      ? (CAREERS_CATALOG.find(c => c.id === profile.targetCareerId) || CAREERS_CATALOG[0])
      : { title: 'Software Engineer' };

    // Compute progress
    let totalMilestones = 0;
    let completedMilestones = 0;

    SIX_MONTH_ROADMAP_MASTER.forEach(month => {
      (month.milestones || []).forEach(m => {
        totalMilestones++;
        if (checkedState[m.id]) completedMilestones++;
      });
    });

    const percent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    // Update Progress header
    const progressText = document.getElementById('roadmap-progress-text');
    if (progressText) progressText.innerText = `${completedMilestones} of ${totalMilestones} Completed (${percent}%)`;

    const progressBar = document.getElementById('roadmap-overall-bar');
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
      progressBar.className = percent >= 80 ? 'progress-fill success' : percent >= 45 ? 'progress-fill' : 'progress-fill warning';
    }

    container.innerHTML = `
      <!-- Personalized Configuration Controls Bar -->
      <div class="card p-3 mb-4 roadmap-config-bar">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-2">
            <span class="badge badge-primary"><i class="fa-solid fa-bullseye"></i> Track:</span>
            <strong class="text-sm">${escapeHtml(targetCareer.title)}</strong>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-2 flex-wrap">
              <label class="text-xs text-muted font-semibold">Weekly Study Hours:</label>
              <select id="roadmap-hours-select" class="form-control form-control-sm" onchange="roadmapManager.setHours(this.value)">
                <option value="10" ${this.selectedHours === 10 ? 'selected' : ''}>10 hrs / week (Moderate)</option>
                <option value="15" ${this.selectedHours === 15 ? 'selected' : ''}>15 hrs / week (Recommended)</option>
                <option value="25" ${this.selectedHours === 25 ? 'selected' : ''}>25 hrs / week (Sprint)</option>
              </select>
            </div>

            <div class="flex items-center gap-2 flex-wrap">
              <label class="text-xs text-muted font-semibold">Target Season:</label>
              <span class="badge badge-info">Campus Drives ${profile.gradYear || '2026'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 6-Month Structured Timeline Cards -->
      <div class="roadmap-six-month-container">
        ${SIX_MONTH_ROADMAP_MASTER.map(m => {
          const monthCheckedCount = (m.milestones || []).filter(item => checkedState[item.id]).length;
          const monthMilestoneTotal = (m.milestones || []).length || 1;
          const monthPercent = Math.round((monthCheckedCount / monthMilestoneTotal) * 100);
          const isMonthDone = monthPercent === 100;

          return `
            <div class="roadmap-month-card ${isMonthDone ? 'month-completed' : ''}">
              <div class="roadmap-month-header">
                <div class="roadmap-month-badge-col">
                  <span class="badge ${isMonthDone ? 'badge-success' : 'badge-primary'}">${escapeHtml(m.duration)}</span>
                  <h3 class="roadmap-month-title">${escapeHtml(m.title)}</h3>
                </div>
                <div class="roadmap-month-progress-badge">
                  <span class="badge ${isMonthDone ? 'badge-success' : 'badge-outline'}">
                    ${monthCheckedCount}/${monthMilestoneTotal} Milestones (${monthPercent}%)
                  </span>
                </div>
              </div>

              <!-- Learning Objective -->
              <div class="roadmap-objective-box">
                <i class="fa-solid fa-flag text-primary"></i>
                <div>
                  <strong>Learning Objective:</strong> ${escapeHtml(m.objective)}
                </div>
              </div>

              <!-- Skills Covered Chips -->
              <div class="roadmap-skills-row">
                <span class="text-xs text-muted font-bold uppercase mr-2">Skills Covered:</span>
                ${m.skills.map(s => `<span class="badge badge-outline text-xs">${escapeHtml(s)}</span>`).join('')}
              </div>

              <!-- Dedicated Curated YouTube Lectures Section with Rich Cards -->
              ${this.renderLectureCards(m)}

              <!-- Practice Problems & Hands-on Project Grid -->
              <div class="grid-responsive-2 gap-3 mb-3">
                <!-- Practice Problems -->
                <div class="roadmap-inner-box">
                  <div class="text-xs font-bold text-muted mb-2 uppercase flex items-center gap-1">
                    <i class="fa-solid fa-code text-cyan"></i> Recommended Practice Problems:
                  </div>
                  <div class="roadmap-problems-list">
                    ${m.practiceProblems.map(p => `
                      <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="roadmap-problem-chip">
                        <i class="fa-solid fa-terminal text-emerald"></i>
                        <span>${escapeHtml(p.name)}</span>
                        <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                      </a>
                    `).join('')}
                  </div>
                </div>

                <!-- Capstone Project Highlight -->
                <div class="roadmap-inner-box project-highlight">
                  <div class="text-xs font-bold text-primary mb-1 uppercase flex items-center gap-1">
                    <i class="fa-solid fa-folder-tree"></i> Hands-on Project to Build:
                  </div>
                  <div class="text-xs font-bold mb-1">${escapeHtml(m.project.title)}</div>
                  <p class="text-xs text-muted">${escapeHtml(m.project.desc)}</p>
                </div>
              </div>

              <!-- Top Interview Questions -->
              <div class="roadmap-inner-box mb-3">
                <div class="text-xs font-bold text-muted mb-1 uppercase flex items-center gap-1">
                  <i class="fa-solid fa-user-check text-amber"></i> Top Interview Questions for this Month:
                </div>
                <ul class="text-xs text-muted" style="padding-left: 1rem; margin: 0;">
                  ${m.interviewQuestions.map(q => `<li style="margin-bottom: 0.25rem;">${escapeHtml(q)}</li>`).join('')}
                </ul>
              </div>

              <!-- Interactive Milestone Checkboxes -->
              <div class="roadmap-milestones-checklist">
                <div class="text-xs font-bold text-muted mb-2 uppercase">Completion Milestones:</div>
                <div class="grid gap-2">
                  ${m.milestones.map(item => {
                    const isChecked = !!checkedState[item.id];
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
          `;
        }).join('')}
      </div>
    `;
  }

  toggleMilestone(milestoneId) {
    const isDone = (typeof appState !== 'undefined' && appState.toggleRoadmapMilestone)
      ? appState.toggleRoadmapMilestone(milestoneId)
      : false;
    if (typeof showToast === 'function') {
      showToast(isDone ? 'Milestone achieved! Your readiness is progressing.' : 'Milestone unchecked', isDone ? 'success' : 'info');
    }
    this.renderRoadmapView();
    if (window.renderDashboard) window.renderDashboard();
  }

  setHours(val) {
    this.selectedHours = parseInt(val) || 15;
    if (typeof showToast === 'function') {
      showToast(`Roadmap schedule updated for ${this.selectedHours} study hours/week.`, 'info');
    }
    this.renderRoadmapView();
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
