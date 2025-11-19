# **Python Mastery (Advanced) - 30 Lesson Framework**

## **Course Overview**

**Course ID:** `python-mastery`
**Category:** Backend
**Skill Level:** Advanced
**Prerequisites:** `python-applications` (must be completed)
**Estimated Hours:** 30-35 hours
**Total Lessons:** 30

This course teaches professional Python development:
- Advanced OOP (decorators, properties, magic methods, design patterns)
- Async programming and concurrency
- Database integration (SQLite)
- Testing and test-driven development
- Web development (Flask/FastAPI)
- API design and consumption
- Performance optimization
- Production-ready code practices

**Theme:** Building a production-ready MMO-style RPG backend server with database, API, and client

---

## **Course Structure**

### **Module 1: Advanced OOP & Design Patterns (Lessons 1-5)**

**Lesson 1: Properties & Descriptors**
- Concept: Advanced OOP
- Learn: @property decorator, getters/setters, computed properties, data validation
- Task: Refactor Character class to use properties for health (can't exceed max), mana (regenerates), level (triggers stat recalculation)
- Starter code: Basic Character class, student adds properties
- Real-world: Encapsulation, data validation, computed attributes
- XP: 150

**Lesson 2: Magic Methods (Dunder Methods)**
- Concept: Advanced OOP
- Learn: `__repr__`, `__eq__`, `__lt__`, `__add__`, `__len__`, `__getitem__`, `__contains__`
- Task: Implement magic methods for Character (comparison by level), Inventory (len, getitem, contains), Equipment (add for stat bonuses)
- Starter code: Classes provided, student adds magic methods
- Real-world: Making custom objects behave like built-in types
- XP: 200

**Lesson 3: Decorators**
- Concept: Advanced functions
- Learn: Function decorators, @wraps, decorators with arguments, class decorators
- Task: Create decorators for RPG system:
  - `@log_action` - logs function calls to file
  - `@requires_level(min_level)` - prevents action if level too low
  - `@cooldown(seconds)` - prevents spam of abilities
  - `@retry(times)` - retries failed operations
- Starter code: Function examples, student creates decorators
- Real-world: Cross-cutting concerns, aspect-oriented programming
- XP: 250

**Lesson 4: Design Patterns - Singleton, Factory, Observer**
- Concept: Design patterns
- Learn: Singleton (GameManager), Factory (EnemyFactory), Observer (EventSystem)
- Task: Implement three patterns:
  - `GameManager` singleton - only one instance exists
  - `EnemyFactory` - creates enemies based on type string
  - `EventSystem` - observers subscribe to game events (player_died, level_up, etc.)
- Starter code: Pattern descriptions and interfaces, student implements
- Real-world: Professional code organization, reusable architectures
- XP: 250

**Lesson 5: ⭐ CHALLENGE - Advanced Combat System with Patterns**
- **Retention Checkpoint**: Properties, magic methods, decorators, design patterns
- Task: Build a sophisticated combat system
  - Create `CombatManager` (singleton)
  - Create `AbilityFactory` for different ability types
  - Implement `Character` with:
    - Properties for stats with validation
    - Magic methods for comparison
    - Decorated methods (`@cooldown`, `@requires_mana`)
  - Create `CombatEventSystem` (observer pattern)
    - Events: damage_dealt, ability_used, character_died, combat_ended
    - Observers: CombatLogger, AchievementTracker, StatisticsCollector
  - Demonstrate full combat with all patterns working together
- Starter code: None (architecture design from scratch)
- Success: All patterns implemented correctly, combat system functional, events firing
- XP: 400

---

### **Module 2: Testing & TDD (Lessons 6-10)**

**Lesson 6: Unit Testing Basics**
- Concept: `testing-basics`
- Learn: pytest, test functions, assertions, running tests
- Task: Write tests for Character class methods (take_damage, heal, gain_xp, level_up)
- Starter code: Character class provided, test file structure shown, student writes tests
- Real-world: Ensuring code works, catching regressions
- XP: 150

**Lesson 7: Test Fixtures & Parametrization**
- Concept: `testing-basics`
- Learn: @pytest.fixture, parametrize, setup/teardown
- Task: Create fixtures for common test objects, write parametrized tests for damage calculations with different inputs
- Starter code: Some tests provided, student adds fixtures and parametrization
- Real-world: Reducing test duplication, testing edge cases
- XP: 200

**Lesson 8: Mocking & Test Doubles**
- Concept: `testing-basics`
- Learn: unittest.mock, MagicMock, patching, when to mock
- Task: Test save/load system by mocking file operations, test API calls by mocking requests
- Starter code: Code to test provided, student writes tests with mocks
- Real-world: Testing without dependencies, isolating units
- XP: 200

**Lesson 9: Test-Driven Development (TDD)**
- Concept: `testing-basics`
- Learn: Red-Green-Refactor cycle, writing tests first
- Task: Build a new feature (inventory weight system) using TDD:
  1. Write failing test for max weight
  2. Implement minimum code to pass
  3. Refactor
  4. Repeat for all features
- Starter code: Test requirements only, student writes tests then code
- Real-world: Better design, fewer bugs, living documentation
- XP: 250

**Lesson 10: ⭐ CHALLENGE - TDD Quest System**
- **Retention Checkpoint**: Testing, TDD, fixtures, mocking
- Task: Build complete quest system using TDD
  - Features to test-drive:
    - `Quest` class (objectives, rewards, completion tracking)
    - `QuestLog` class (add, complete, track progress)
    - `QuestReward` system (give items, xp, gold)
    - Quest chaining (prerequisites)
    - Daily quest system
  - Requirements:
    - Write ALL tests first (minimum 15 tests)
    - Implement code to pass tests
    - Use fixtures for test data
    - Mock file I/O for quest loading
    - Achieve 100% code coverage
- Starter code: Test file with TODO comments for required tests
- Success: All tests pass, TDD process followed, comprehensive coverage
- XP: 450

---

### **Module 3: Database Integration - SQLite (Lessons 11-15)**

**Lesson 11: SQL Basics & sqlite3 Module**
- Concept: Database fundamentals
- Learn: SQL CREATE, INSERT, SELECT, UPDATE, DELETE; sqlite3 connection, cursor, commit
- Task: Create player database, write functions to insert/query players
- Starter code: Database schema provided, student writes Python functions
- Real-world: Persistent storage, structured data
- XP: 150

**Lesson 12: Complex Queries & Joins**
- Concept: Database fundamentals
- Learn: WHERE, ORDER BY, JOINs, GROUP BY, subqueries
- Task: Query game database - find top players, calculate guild statistics, equipment inventory across characters
- Starter code: Populated database provided, student writes complex queries
- Real-world: Data analysis, reporting
- XP: 200

**Lesson 13: Database Abstraction Layer**
- Concept: Database integration + OOP
- Learn: Context managers, connection pooling, repository pattern
- Task: Create `DatabaseManager` context manager and `PlayerRepository` class with CRUD operations
- Starter code: Basic structure, student implements pattern
- Real-world: Separating data access from business logic
- XP: 250

**Lesson 14: Migrations & Schema Evolution**
- Concept: Database management
- Learn: Altering tables, data migration, versioning schema
- Task: Write migration scripts to evolve schema:
  - v1: Basic player table
  - v2: Add inventory table
  - v3: Add achievements table
  - Migration runner that tracks version
- Starter code: Initial schema, student writes migrations
- Real-world: Maintaining databases in production
- XP: 250

**Lesson 15: ⭐ CHALLENGE - Complete Database-Backed Game**
- **Retention Checkpoint**: SQL, database operations, OOP integration
- Task: Build full game with database persistence
  - Database schema:
    - players (id, name, class, level, xp, gold, created_at)
    - inventory (id, player_id, item_id, quantity)
    - items (id, name, type, value, rarity)
    - achievements (id, player_id, achievement_type, earned_at)
    - combat_log (id, player_id, enemy_type, damage_dealt, damage_taken, won, timestamp)
  - Create repository classes for each table
  - Implement:
    - Character creation (inserts to DB)
    - Combat system (logs to DB)
    - Inventory management (queries/updates DB)
    - Achievement tracking (inserts when earned)
    - Statistics dashboard (complex queries)
  - Use context managers for all DB operations
  - Include error handling for DB issues
- Starter code: Schema definitions only
- Success: All data persists, complex queries work, proper abstraction, no SQL injection vulnerabilities
- XP: 500

---

### **Module 4: Async Programming & Concurrency (Lessons 16-20)**

**Lesson 16: Async/Await Basics**
- Concept: `async-basics`
- Learn: async def, await, asyncio.run, when to use async
- Task: Convert blocking game server functions to async (player actions, combat resolution)
- Starter code: Synchronous code provided, student converts to async
- Real-world: Non-blocking I/O, handling multiple clients
- XP: 200

**Lesson 17: Async Context Managers & Iterators**
- Concept: `async-basics`
- Learn: async with, async for, aiofiles
- Task: Implement async database operations and async file logging
- Starter code: Sync versions provided, student creates async versions
- Real-world: Async resources, streaming data
- XP: 200

**Lesson 18: Concurrent Operations**
- Concept: `async-basics`
- Learn: asyncio.gather, asyncio.create_task, concurrent operations
- Task: Process multiple player actions simultaneously, run multiple combat simulations concurrently
- Starter code: Sequential code provided, student parallelizes
- Real-world: Performance optimization, handling load
- XP: 250

**Lesson 19: Async Error Handling & Timeouts**
- Concept: `async-basics` + `error-handling`
- Learn: asyncio.timeout, exception handling in async, cancellation
- Task: Add timeouts to player actions (no action for 30s = auto-logout), handle disconnections gracefully
- Starter code: Basic async code, student adds error handling and timeouts
- Real-world: Robust servers, handling failures
- XP: 250

**Lesson 20: ⭐ CHALLENGE - Async Game Server**
- **Retention Checkpoint**: Async/await, concurrency, error handling
- Task: Build a multi-player game server
  - Server handles multiple connected players concurrently
  - Each player runs in own async task
  - Features:
    - Player login/logout (async)
    - Real-time combat between players
    - Chat system (broadcasts to all)
    - Async database operations
    - Timeout handling (disconnect inactive)
    - Graceful shutdown
  - Server must handle:
    - Multiple concurrent combats
    - Database writes without blocking
    - Player disconnections
    - 10+ simultaneous connections
  - Simulate with async client connections
- Starter code: Socket/connection infrastructure only
- Success: Server handles concurrent operations, no blocking, graceful error handling
- XP: 550

---

### **Module 5: Web APIs - REST & Flask (Lessons 21-25)**

**Lesson 21: Flask Basics & Routing**
- Concept: Web development
- Learn: Flask app, routes, methods (GET, POST), request/response
- Task: Create API endpoints:
  - GET /player/<id> - get player info
  - POST /player - create new player
  - GET /leaderboard - top 10 players
- Starter code: Flask imports and setup, student creates routes
- Real-world: Building web services, exposing data
- XP: 200

**Lesson 22: Request Handling & JSON**
- Concept: Web development
- Learn: request.json, jsonify, status codes, error responses
- Task: Build combat API:
  - POST /combat/attack - player attacks enemy
  - POST /combat/heal - player uses potion
  - GET /combat/status/<combat_id> - get battle state
- Starter code: Flask app structure, student implements endpoints with proper JSON handling
- Real-world: REST API design, proper HTTP semantics
- XP: 200

**Lesson 23: API Authentication & Middleware**
- Concept: Web development + security
- Learn: API keys, decorators for auth, request hooks, middleware
- Task: Add authentication system:
  - Generate API keys for players
  - `@require_auth` decorator
  - Rate limiting middleware
  - Request logging
- Starter code: Basic endpoints, student adds auth layer
- Real-world: Securing APIs, preventing abuse
- XP: 250

**Lesson 24: Database Integration with Flask**
- Concept: Web development + database
- Learn: Flask + SQLite, connection handling, transactions
- Task: Connect Flask API to game database:
  - All endpoints read/write from DB
  - Proper connection management
  - Transaction handling for complex operations
- Starter code: Separate Flask and DB code, student integrates
- Real-world: Full-stack backend development
- XP: 250

**Lesson 25: ⭐ CHALLENGE - Complete REST API**
- **Retention Checkpoint**: Flask, REST, database, auth
- Task: Build production-ready RPG API
  - **Endpoints Required:**
    - Authentication:
      - POST /auth/register - create account
      - POST /auth/login - get API key
    - Player:
      - GET /player - get current player
      - PUT /player - update player
      - DELETE /player - delete account
    - Inventory:
      - GET /inventory - list items
      - POST /inventory/item - add item
      - DELETE /inventory/item/<id> - remove item
    - Combat:
      - POST /combat/start - begin combat
      - POST /combat/action - take action
      - GET /combat/<id> - get status
    - Social:
      - GET /players - list all players
      - GET /leaderboard - rankings
      - POST /guild/create - create guild
  - **Requirements:**
    - All endpoints authenticated (except register/login)
    - Proper HTTP methods and status codes
    - Input validation and error handling
    - Rate limiting (10 req/min per user)
    - Request/response logging
    - Database integration with transactions
    - API documentation (docstrings)
    - Postman/curl test collection
- Starter code: Empty Flask app
- Success: All endpoints work, proper REST principles, secure, documented
- XP: 600

---

### **Module 6: Advanced Topics & Optimization (Lessons 26-28)**

**Lesson 26: Performance Profiling & Optimization**
- Concept: Optimization
- Learn: cProfile, timeit, memory_profiler, identifying bottlenecks
- Task: Profile slow game simulation, identify bottlenecks, optimize:
  - Improve algorithm (O(n²) → O(n log n))
  - Cache expensive calculations
  - Use generators for large datasets
  - Optimize database queries
- Starter code: Slow implementation provided, student profiles and optimizes
- Real-world: Scaling applications, performance debugging
- XP: 250

**Lesson 27: Caching Strategies**
- Concept: Optimization
- Learn: functools.lru_cache, caching patterns, cache invalidation
- Task: Add caching to game systems:
  - Cache item lookups
  - Cache player stats calculations
  - Cache leaderboard queries
  - Implement cache warming
  - Handle cache invalidation on updates
- Starter code: Working but slow code, student adds caching
- Real-world: Reducing load, improving response times
- XP: 250

**Lesson 28: Working with APIs (Consumer Side)**
- Concept: API integration
- Learn: requests library, async API calls (aiohttp), rate limiting, retry logic
- Task: Integrate with external services:
  - Weather API (affects game events)
  - Random name generator API
  - Achievement verification service
  - Handle failures gracefully
  - Implement exponential backoff
- Starter code: API endpoints documented, student writes integration
- Real-world: Third-party integrations, resilient systems
- XP: 250

---

### **Module 7: Final Project (Lessons 29-30)**

**Lesson 29: System Architecture & Planning**
- Concept: Software engineering
- Learn: Architecture planning, documentation, breaking down large projects
- Task: Design complete MMO backend system
  - Create architecture diagram
  - Define data models and relationships
  - Plan API endpoints
  - Identify design patterns to use
  - Create project structure
  - Write technical specification
  - Plan testing strategy
- Deliverable: Comprehensive design document
- Starter code: Template documents
- Real-world: Professional development process
- XP: 300

**Lesson 30: ⭐ FINAL PROJECT - Production MMO Backend**
- **Retention Checkpoint**: ALL advanced concepts
- Task: Build a complete, production-ready MMO game backend
  
  **Core Requirements:**
  
  **1. Architecture**
  - Multi-file project structure with clear separation
  - Config management (dev/prod environments)
  - Logging system (file + console)
  - Error tracking and reporting
  
  **2. Database Layer**
  - SQLite database with comprehensive schema:
    - Players, Characters, Inventory, Equipment
    - Guilds, Guild Members
    - Quests, Quest Progress
    - Combat Logs, Achievements
    - Market/Trading, Transactions
  - Repository pattern for all entities
  - Migration system
  - Database connection pooling
  
  **3. Business Logic Layer**
  - Character system with multiple classes
  - Combat system (PvE and PvP)
  - Inventory and equipment system
  - Guild system (create, join, leave, ranks)
  - Quest system (daily quests, achievements)
  - Market/trading system
  - Level and progression system
  - Event system (observer pattern)
  
  **4. API Layer (Flask/FastAPI)**
  - RESTful API with 30+ endpoints
  - Authentication & authorization (API keys + roles)
  - Rate limiting
  - Request validation
  - Error handling with proper status codes
  - API versioning (/api/v1/)
  - Swagger/OpenAPI documentation
  
  **5. Async Operations**
  - Async database operations
  - Background tasks (daily quest reset, maintenance)
  - Async combat resolution
  - Event broadcasting
  
  **6. Testing**
  - Unit tests (80%+ coverage)
  - Integration tests for API endpoints
  - Database tests
  - Performance tests
  - Test fixtures and factories
  
  **7. Design Patterns**
  - Singleton (GameManager, ConfigManager)
  - Factory (CharacterFactory, EnemyFactory)
  - Repository (data access)
  - Observer (event system)
  - Strategy (combat abilities)
  - Decorator (abilities, validation)
  
  **8. Advanced Features**
  - Caching (player stats, leaderboards)
  - Performance monitoring
  - Admin dashboard API
  - Statistics and analytics
  - Backup/restore system
  
  **9. DevOps Basics**
  - Environment configuration
  - Requirements.txt with pinned versions
  - README with setup instructions
  - Docker support (optional bonus)
  - CI/CD ready structure
  
  **10. Documentation**
  - API documentation (auto-generated)
  - Code documentation (docstrings)
  - Architecture documentation
  - Database schema documentation
  - User guide for API consumers
  
  **Technical Specifications:**
  - Minimum 2000 lines of production code
  - Minimum 500 lines of test code
  - Must handle 50+ concurrent users
  - Response time < 200ms for cached endpoints
  - < 1 second for complex operations
  - Zero SQL injection vulnerabilities
  - Proper error handling throughout
  - Graceful degradation on failures
  
  **Deliverables:**
  1. Complete source code with structure
  2. Comprehensive test suite
  3. Database schema and migrations
  4. API documentation
  5. README with setup instructions
  6. Postman collection for testing
  7. Performance benchmarks
  8. Live demo (local server)
  
- Starter code: None (completely independent)
- Time: 8-15 hours (multi-session project)
- Success Criteria:
  - ✅ All required features implemented
  - ✅ Tests pass with good coverage
  - ✅ API is RESTful and well-documented
  - ✅ Code is clean and well-organized
  - ✅ Database properly normalized
  - ✅ No security vulnerabilities
  - ✅ Performance meets requirements
  - ✅ Proper error handling throughout
  - ✅ Design patterns used appropriately
  - ✅ Professional-quality code
- XP: 2000
- Special Rewards:
  - "Python Master" badge
  - "Backend Architect" badge
  - "Professional Developer" badge
  - Unlocks certificate of completion
  - Portfolio-worthy project

---

## **Learning Objectives by Module**

### **Module 1: Advanced OOP**
- Use properties for data validation
- Implement magic methods appropriately
- Create and use decorators
- Apply design patterns to solve problems
- Write maintainable, extensible code

### **Module 2: Testing**
- Write comprehensive unit tests
- Use fixtures and parametrization
- Mock dependencies effectively
- Practice test-driven development
- Achieve high code coverage

### **Module 3: Database**
- Write complex SQL queries
- Integrate databases with Python
- Use repository pattern
- Manage schema evolution
- Optimize database performance

### **Module 4: Async**
- Write non-blocking code
- Handle concurrent operations
- Use async context managers
- Handle timeouts and cancellation
- Build scalable servers

### **Module 5: Web APIs**
- Build RESTful APIs
- Handle authentication
- Integrate databases with Flask
- Follow REST principles
- Document APIs

### **Module 6: Advanced Topics**
- Profile and optimize code
- Implement caching strategies
- Integrate third-party APIs
- Build resilient systems
- Monitor performance

### **Module 7: Professional Development**
- Plan large systems
- Write comprehensive documentation
- Build production-ready code
- Follow best practices
- Create portfolio projects

---

## **Scaffolding Philosophy for Advanced**

### **No Hand-Holding**
- Lessons 1-15: Requirements and interfaces only
- Lessons 16-25: High-level requirements
- Lessons 26-28: Problem descriptions only
- Lessons 29-30: Project specifications only

### **Professional Expectations**
- Students must research solutions
- Multiple correct approaches exist
- Code quality matters (not just working code)
- Documentation is required
- Tests are required
- Performance considerations matter

### **Hints Are Different**
Unlike beginner/intermediate, advanced hints:
- Point to documentation/resources
- Suggest approaches, not implementations
- Reference best practices
- Ask guiding questions
- Never provide code (even in hint 5)

Example Advanced Hints:
1. "Consider the Repository pattern for data access. Research why it's useful for database operations."
2. "Think about separation of concerns. Your API layer shouldn't know about database implementation details."
3. "Look into Flask's application context and blueprints for organizing large APIs."
4. "Check the official Flask documentation on error handlers and middleware."
5. "Review the SOLID principles, particularly Single Responsibility and Dependency Inversion."

---

## **XP Progression**

**Regular Lessons:** 150-250 XP
**Challenge Lessons:**
- Lesson 5: 400 XP (design patterns)
- Lesson 10: 450 XP (TDD system)
- Lesson 15: 500 XP (database integration)
- Lesson 20: 550 XP (async server)
- Lesson 25: 600 XP (REST API)
- Lesson 30: 2000 XP (final project)

**Total Course XP:** ~10,000 XP

---

## **Prerequisites & Unlocks**

### **Prerequisites Check:**
```sql
SELECT status FROM user_course_progress 
WHERE user_id = ? 
AND course_id = 'python-applications' 
AND status = 'completed'
```

### **What This Course Unlocks:**
- Professional developer certification
- Advanced programming badge
- Portfolio project showcase
- Access to community projects
- Mentor role (can help others)

---

## **Real-World Applications**

Throughout the course, emphasize real-world usage:

**Lesson 3 (Decorators):**
"Decorators are used in Flask for routing (@app.route), authentication (@login_required), and caching. You'll see them everywhere in professional Python."

**Lesson 10 (TDD):**
"Companies like Google, Amazon, and Netflix use TDD. Tests are often required before code reviews."

**Lesson 15 (Database):**
"Every web application needs a database. This is exactly how production systems store data."

**Lesson 25 (REST API):**
"This is how mobile apps communicate with servers. Every major app uses REST APIs."

**Lesson 30 (Final Project):**
"This project is portfolio-worthy. You can show this to potential employers."

---

## **Professional Standards**

### **Code Quality Requirements:**
- PEP 8 compliance (linting required)
- Type hints on functions
- Docstrings on all public functions/classes
- No code smells (long functions, god objects)
- DRY principle followed
- Proper error handling

### **Documentation Requirements:**
- README with setup instructions
- API documentation
- Code comments for complex logic
- Architecture diagrams
- Database schema documentation

### **Testing Requirements:**
- 80%+ code coverage
- Unit tests for business logic
- Integration tests for APIs
- All tests must pass
- Performance tests for critical paths

---

## **Common Pitfalls & Addressing Them**

### **Pitfall 1: Not Understanding Async**
- Lesson 16-17: Heavy emphasis on when/why async
- Provide sync vs async comparisons
- Show performance benchmarks

### **Pitfall 2: Poor API Design**
- Lesson 21-22: REST principles emphasized
- Review HTTP status codes
- Discuss API versioning early

### **Pitfall 3: SQL Injection**
- Lesson 11: Immediate focus on parameterized queries
- Lesson 15: Security testing required
- Show vulnerable vs secure code

### **Pitfall 4: Blocking Operations in Async**
- Lesson 18: Explicit warnings
- Show common mistakes
- Teach how to identify blocking code

### **Pitfall 5: Over-Engineering**
- Balance pattern usage with simplicity
- Discuss when NOT to use patterns
- Show simple solutions first

---

## **Time Commitment**

**Per Lesson Average:**
- Regular lessons: 45-60 minutes
- Challenge lessons: 2-4 hours
- Final project: 8-15 hours (multiple sessions encouraged)

**Total Course Time:** 30-35 hours of focused work

---

## **Success Metrics**

Student has mastered advanced Python when they can:
- ✅ Build production-ready applications independently
- ✅ Write clean, tested, documented code
- ✅ Make architectural decisions
- ✅ Optimize performance systematically
- ✅ Build and consume APIs
- ✅ Work with databases effectively
- ✅ Use async programming appropriately
- ✅ Apply design patterns wisely
- ✅ Debug complex issues
- ✅ Read and contribute to large codebases

---

## **What Comes After**

After completing this course, students can:
- Build full-stack applications (learn React/frontend)
- Specialize in data science (NumPy, Pandas, ML)
- Learn system design and architecture
- Contribute to open-source projects
- Build commercial applications
- Apply for Python developer positions

**Recommended Next Steps:**
- Build personal projects
- Contribute to open-source
- Learn cloud deployment (AWS, Docker, Kubernetes)
- Study system design
- Learn additional frameworks (Django, FastAPI deep dive)
- Explore specialized domains (ML, DevOps, Security)

---

## **Final Project Grading Rubric**

Since this is the capstone:

**Functionality (40%)**
- All features work as specified
- No critical bugs
- Edge cases handled

**Code Quality (30%)**
- Clean, readable code
- Proper organization
- DRY principles
- Design patterns used appropriately

**Testing (15%)**
- Good test coverage
- Meaningful tests
- All tests pass

**Documentation (10%)**
- Clear README
- API docs
- Code comments

**Performance (5%)**
- Meets performance requirements
- No obvious bottlenecks
- Proper caching

**Excellence Indicators (Bonus XP):**
- +200 XP: Docker containerization
- +150 XP: CI/CD pipeline
- +100 XP: >90% test coverage
- +100 XP: Admin web interface
- +150 XP: WebSocket real-time features
- +200 XP: Deployed to production (AWS/Heroku)

---

