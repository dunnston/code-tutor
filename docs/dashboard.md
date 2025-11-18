Code Learning Coach - Dashboard Specification
Overview
Create a user dashboard that serves as the main hub after profile selection. This is the central navigation point where users view their progress, access courses, manage their profile, and continue learning.

Dashboard Purpose
The dashboard should:

Display user's current status and progress at a glance
Provide quick access to continue active course
Show course catalog for browsing and switching courses
Display achievements, XP, level, and streak
Provide navigation to other major sections (shop, inventory, achievements)
Feel motivating and celebrate progress


Layout Structure
Top Section: User Profile Card
Display prominently at the top:

User avatar (image or icon)
User name
Current level with progress bar to next level
Total XP
Current streak (fire emoji + number of days)
Quick stats (lessons completed, time spent coding this week)

Main Content Area: Multi-Section Layout
Section 1: Active Course Card (if user has active course)

Course name and icon
Category and skill level badges
Progress: "X of Y lessons completed" with progress bar
Last lesson worked on (title)
Large "Continue Learning" button (primary action)
Estimated time remaining
Option to "Change Course" or "Complete & Choose New"

Section 2: Quick Stats Dashboard
Row of stat cards showing:

Lessons completed this week
Current streak
Total XP earned
Achievements unlocked
Hours coded (optional)

Section 3: Course Catalog
Browsable/filterable course list:

Filter by Category (Backend, Game Dev, Frontend)
Filter by Skill Level (Beginner, Intermediate, Advanced)
Filter by Language (Python, GDScript, C#, JavaScript)
Each course card shows:

Course name and description
Category badge
Skill level badge
Language icon
Lesson count
Estimated hours
Progress indicator (if started)
"Start Course" or "Resume" button
Prerequisites (if any, shown as locked if not met)



Section 4: Achievement Preview

Show 3-5 most recent or featured achievements
"View All Achievements" link/button
Visual achievement badges/icons
Progress on next achievement (optional)

Section 5: Quick Links (Future-ready)

Shop (placeholder for now, link ready)
Inventory (placeholder for now, link ready)
Leaderboard (future)
Puzzles (future)
Game Mode (future)


User Flows
Flow 1: User Lands on Dashboard

Dashboard loads and displays user information from database
If user has active course, prominently show it
Load user stats (XP, streak, lessons completed)
Load recent achievements
Display course catalog with current filters

Flow 2: Continue Active Course

User clicks "Continue Learning" button
Navigate to lesson IDE section
Load the next incomplete lesson in active course
If all lessons complete, show completion celebration and prompt to choose new course

Flow 3: Browse and Select New Course

User filters courses by category/skill level/language
User clicks on course card to see more details
Show course detail modal or expanded view with:

Full description
Complete lesson list preview
Prerequisites check
Reviews/ratings (future)


User clicks "Start Course" or "Activate Course"
Check prerequisites (if any)
If prerequisites met, set as active course in database
Show success message
Update dashboard to show new active course
Prompt to start first lesson

Flow 4: Change Active Course

User clicks "Change Course" from active course card
Show confirmation dialog: "Progress will be saved. Switch courses?"
If confirmed, deactivate current course (keep progress)
Allow user to select new course from catalog
Set new course as active
Update dashboard

Flow 5: Complete Course

When user completes final lesson, trigger completion flow
Show celebration animation/modal
Award completion XP and badge
Update course status to "completed"
Remove from active course slot
Show recommended next courses
Prompt to select new course


Data Requirements
User Data to Load
From users table:
- id, name, avatar

From user_xp table:
- total_xp, current_level

From user_streaks table:
- current_streak, longest_streak

From user_active_course table:
- active course_id

From user_course_progress table:
- All courses with progress > 0
- For active course: lessons_completed, completion_percentage

From user_lesson_progress table:
- Last lesson accessed (for "continue learning")
- Lessons completed this week

From user_badges table:
- Recent achievements (latest 5)

From courses table:
- All available courses with metadata
Computed Stats
Calculate on dashboard load:

XP to next level (based on level progression formula)
Percentage to next level
Lessons completed this week (filter by timestamp)
Total coding time this week (sum of time_spent)


Database Queries Needed
Query 1: Get User Dashboard Data
Single query or series to fetch:

User profile info
Active course with progress
User level and XP
Current streak
Recent achievements

Query 2: Get Course Catalog
Fetch all courses with filters:

By category_id (optional)
By skill_level_id (optional)
By language_id (optional)
Join with user_course_progress to show progress
Order by featured, then order_index

Query 3: Check Prerequisites
When user tries to activate a course:

Get course prerequisites (JSON array of course_ids)
Check if user has completed those courses
Return true/false for activation eligibility

Query 4: Get This Week's Stats

Count lessons completed in past 7 days
Sum time_spent in past 7 days
Get XP earned in past 7 days (from xp_transactions table)


UI Components to Create
1. ProfileHeader Component
Displays:

Avatar (image component)
User name (heading)
Level badge with number
XP bar (progress component)
Streak indicator (icon + number)

2. ActiveCourseCard Component
Large card showing:

Course name and icon
Category/skill level badges
Progress bar
"Continue Learning" button (primary)
"Change Course" button (secondary)
Last lesson info

3. StatsGrid Component
Grid of stat cards:

Each card: icon, value, label
Responsive layout (2 columns mobile, 4 columns desktop)

4. CourseCard Component
Reusable card for course catalog:

Course thumbnail or icon
Course name
Short description
Category badge
Skill level badge
Language badge
Lesson count
Progress indicator (if started)
Action button ("Start", "Resume", or "Locked")

5. CourseCatalog Component
Grid of CourseCard components with:

Filter bar (category, skill level, language dropdowns)
Search input (optional)
Sort options (featured, newest, alphabetical)
Responsive grid layout

6. AchievementPreview Component
Horizontal list or grid showing:

Achievement badge images
Achievement names
Earned date
"View All" button

7. CourseDetailModal Component
Modal/drawer that shows:

Full course information
Module/lesson breakdown
Prerequisites status
Activation button
Close/cancel button


State Management
Track these states:

userProfile - Current user data
activeCourse - Active course details and progress
courses - All available courses
filteredCourses - Courses matching filters
userStats - Computed statistics
recentAchievements - Latest achievements
filters - Current catalog filters (category, skill_level, language)
loading - Loading states for different sections
modals - Open/closed state for course detail modal


Actions/Events
On Dashboard Load

Fetch user profile
Fetch active course and progress
Fetch user stats
Fetch recent achievements
Fetch course catalog
Apply default filters (maybe show current category first)

On Continue Learning Click

Get next incomplete lesson from active course
Navigate to lesson IDE
Pass lesson_id to IDE component

On Course Filter Change

Filter courses array by selected filters
Update filtered courses display
Maintain filter state in URL params (optional)

On Course Card Click

Open course detail modal
Load full course information
Load lesson list for preview
Show prerequisites status

On Start/Activate Course

Check prerequisites
If not met, show error message
If met, update user_active_course table
Deactivate previous course (if any)
Refresh dashboard
Optionally auto-navigate to first lesson

On Change Course Click

Show confirmation dialog
If confirmed, clear active course
Show course catalog
Let user select new course


Responsive Design
Desktop (1024px+)

Two-column layout for main content
Active course card: left column, full width
Stats grid: 4 columns
Course catalog: 3-4 columns
Sidebar for quick links (optional)

Tablet (768px - 1023px)

Single column layout
Active course card: full width
Stats grid: 2 columns
Course catalog: 2 columns

Mobile (< 768px)

Single column layout
Active course card: full width, condensed
Stats grid: 2 columns, scrollable
Course catalog: 1 column
Collapsible filters


Animations & Transitions

Smooth page load fade-in
XP bar should animate/fill on load
Course cards: hover effects (scale, shadow)
Button hover states
Modal slide-in animation
Achievement badges: subtle pulse or glow effect
Loading skeletons for async data


Empty States
No Active Course
Show:

Welcome message
"Choose your first course!" prompt
Featured courses prominently
"Browse all courses" button

No Courses Started
Show:

Motivational message
Course recommendations
Quick start guide

No Achievements Yet
Show:

"Start learning to earn achievements!"
Preview of first few achievements they can earn


Navigation Integration
Dashboard should have links to:

Lesson IDE (via "Continue Learning")
Course selection (integrated in dashboard)
Achievements page (separate page)
Shop page (placeholder for now)
Inventory page (placeholder for now)
Settings (change avatar, preferences)

Add navigation breadcrumb:

"Dashboard" (current page)
Clear visual hierarchy


Data Update Triggers
Dashboard should refresh/update when:

User completes a lesson (increment lessons_completed)
User earns achievement (add to recent achievements)
User gains XP (update XP bar and level)
User activates new course (update active course card)
User changes streak (update streak indicator)

Consider:

Real-time updates (if user has multiple tabs open)
Polling for updates (every 30-60 seconds)
Manual refresh button


Accessibility

Proper heading hierarchy (h1 for main title, h2 for sections)
Alt text for all images and icons
Keyboard navigation for all interactive elements
Focus states clearly visible
Screen reader friendly labels
Color contrast meets WCAG standards
Loading states announced to screen readers


Performance Considerations

Lazy load course catalog images
Paginate course catalog if >50 courses
Cache user stats for short period
Optimize database queries (use indexes)
Show loading skeletons while data loads
Preload active course data for faster "Continue" action


Future Enhancements (Build Placeholders For)
These features will be added later, but create placeholder sections:

Shop Section

Link/button ready
"Coming Soon" badge or message


Inventory Section

Link/button ready
"Coming Soon" badge or message


Daily Quest Display

Small card showing today's quest
Progress indicator
Reward preview


Leaderboard Preview

"Your Rank: #X" display
Link to full leaderboard


Recommended Courses

Based on completed courses
AI-suggested next steps




Technical Implementation Notes
Component Structure
Dashboard/
├── Dashboard.tsx (main container)
├── ProfileHeader.tsx
├── ActiveCourseCard.tsx
├── StatsGrid.tsx
│   └── StatCard.tsx
├── CourseCatalog.tsx
│   ├── FilterBar.tsx
│   └── CourseCard.tsx
├── CourseDetailModal.tsx
├── AchievementPreview.tsx
│   └── AchievementBadge.tsx
└── QuickLinks.tsx
API Endpoints Needed
Create or use existing Tauri commands:

get_user_dashboard_data(user_id) - Returns all dashboard data
get_courses(filters) - Returns filtered course list
activate_course(user_id, course_id) - Sets active course
get_next_lesson(user_id, course_id) - Gets next incomplete lesson
check_prerequisites(user_id, course_id) - Validates prerequisites
get_user_stats_week(user_id) - Gets this week's statistics

Styling

Use existing RPG theme colors and fonts
Maintain consistency with lesson IDE section
Badge components for categories, skill levels
Progress bars with RPG-style styling
Card components with hover effects
Responsive grid system


Testing Checklist
Before considering complete, test:

 Dashboard loads all data correctly
 Active course card displays and functions
 "Continue Learning" navigates to correct lesson
 Course catalog filters work correctly
 Course activation checks prerequisites
 Switching courses preserves progress
 Stats calculate correctly
 Achievements display properly
 Responsive layout on all screen sizes
 Loading states show appropriately
 Empty states display when relevant
 Navigation to other sections works
 Avatar displays correctly
 XP bar animates smoothly
 Streak updates correctly


Success Criteria
Dashboard is complete when:

✅ User can view their complete profile and progress
✅ User can continue active course with one click
✅ User can browse and filter course catalog
✅ User can activate new courses
✅ Prerequisites are enforced
✅ Stats display accurately
✅ Recent achievements show correctly
✅ Layout is responsive on all devices
✅ Navigation to other sections works
✅ Empty states handle gracefully
✅ Loading states provide good UX
✅ Theme consistency maintained with existing app


Priority Implementation Order
Phase 1: Core Dashboard

ProfileHeader component
ActiveCourseCard component
Basic dashboard layout
"Continue Learning" functionality
Database queries for user data

Phase 2: Course Catalog
6. CourseCatalog component
7. CourseCard component
8. Filter functionality
9. Course activation logic
10. Prerequisites checking
Phase 3: Stats & Achievements
11. StatsGrid component
12. Calculate weekly stats
13. AchievementPreview component
14. Link to achievements page
Phase 4: Polish & Optimization
15. Responsive design refinement
16. Animations and transitions
17. Loading states and skeletons
18. Empty states
19. Performance optimization
Phase 5: Future-Ready
20. Placeholder sections (shop, inventory)
21. Quick links component
22. Daily quest preview (placeholder)