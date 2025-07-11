# AI Makers: Vibe Coding Exercises

## What is Vibe Coding?

Quick, intuitive coding without over-planning. Start coding, see what breaks, fix it. No complex architecture diagrams - just code, test, iterate.

---

## 1. DEBUGGING 🐛

### Task: Fix Double-Click Bug

**Problem:** Users can double-click "Add Task" button and create duplicate tasks.

**Reason:** The `addTask` function has no loading state. Rapid clicks trigger multiple async operations before the first one completes.

**Solution Prompt:**

```
"There's a bug where double-clicking Add Task creates duplicates. Add console.logs to see what happens when I double-click, then fix it by preventing multiple clicks during the async operation."
```

**Vibe Approach:** Add console.logs first, see the problem, then add loading state to prevent multiple clicks.

---

## 2. REFACTORING 🔧

### Task A: Extract Custom Hook

**Problem:** `TaskList.tsx` is 360+ lines. Task management logic is mixed with UI logic.

**Reason:** Large components are hard to debug and test. Separating concerns makes code more maintainable.

**Solution Prompt:**

```
"Create a custom hook called useTasks that handles all the task logic (add, delete, toggle, load). Move the task state and functions there, then use it in TaskList component."
```

### Task B: Break Down Large Component

**Problem:** `TaskList` component renders header, empty state, task list, and add form all in one component.

**Reason:** Single responsibility principle. Each component should do one thing well.

**Solution Prompt:**

```
"Split TaskList into smaller components: TaskHeader, EmptyState, TaskItem, and AddTaskForm. Each should handle one specific UI concern."
```

### Task C: Consolidate Error Handling

**Problem:** Same error handling pattern repeated in `addTask`, `toggleTask`, and `deleteTask`.

**Reason:** DRY principle. Repeated code means bugs need fixing in multiple places.

**Solution Prompt:**

```
"Create a handleTaskError utility function that takes the error, operation name, and toast function. Replace all the repeated error handling with this single function."
```

---

## 3. FEATURES ✨

### Task A: Add Task Search

**Problem:** Users can't find tasks in long lists.

**Reason:** Improved UX. Users need to quickly locate specific tasks.

**Solution Prompt:**

```
"Add a search input above the task list. Filter tasks by text as user types. Show 'No tasks found' when search returns empty results."
```

### Task B: Add Task Categories

**Problem:** All tasks are mixed together with no organization.

**Reason:** Users want to organize tasks by type (work, personal, shopping).

**Solution Prompt:**

```
"Add a category dropdown when creating tasks. Add filter buttons (All, Work, Personal, Shopping) above the task list. Show task count for each category."
```

### Task C: Add Bulk Operations

**Problem:** Users can't select multiple tasks for bulk actions.

**Reason:** Efficiency. Users want to delete/complete multiple tasks at once.

**Solution Prompt:**

```
"Add checkboxes to select multiple tasks. Add a bulk actions bar that appears when tasks are selected. Include 'Delete Selected' and 'Mark Complete' buttons."
```

---

## Vibe Coding Rules 📝

1. **Start messy** - Don't plan perfect architecture
2. **Console.log everything** - See what's actually happening
3. **Make it work first** - Optimize later
4. **One change at a time** - Test after each change
5. **Follow the errors** - Let bugs guide you to solutions
6. **Copy-paste liberally** - Reuse working patterns
7. **Refactor when it hurts** - Clean up only when necessary

## Getting Started 🚀

1. Pick any task above
2. Copy the solution prompt
3. Paste it into your AI coding assistant
4. Start coding immediately
5. Test, debug, iterate

**Remember:** Vibe coding is about building momentum. Start typing, not thinking!
