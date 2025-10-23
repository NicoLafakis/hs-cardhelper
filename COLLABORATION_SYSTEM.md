# Real-time Collaboration System - Feature #3 Documentation

## Overview

Complete real-time multi-user collaboration system with:
- **Live cursor tracking** across all collaborators
- **Operational Transformation** for conflict resolution
- **Version history** with full audit trail
- **Presence indicators** showing who's online/editing
- **Conflict detection & resolution** UI
- **WebSocket-based** communication

## Architecture

### Backend Components

#### 1. CollaborationManager (`server/websocket/CollaborationManager.js`)
Core server-side collaboration engine:

**Key Classes:**
- `CollaborationManager` - Manages all collaboration sessions, users, and operations

**Key Methods:**
- `initializeUser(userId, socket, userData)` - Add user to collaboration system
- `handleCardEdit(userId, data)` - Process card edits with OT
- `handleCursorMove(userId, data)` - Track cursor positions
- `handleCardJoin(userId, data)` - User joins editing session
- `handleCardLeave(userId, data)` - User leaves session
- `getVersionHistory(cardId, limit)` - Retrieve operation history
- `getCardSession(cardId)` - Get session info
- `cleanupStaleConnections(maxIdleTime)` - Remove idle users

**Data Structures:**
- `activeUsers: Map` - Active user sessions {userId → {socket, name, email, presence}}
- `cardSessions: Map` - Active card sessions {cardId → {users, version, operations}}
- `userCursors: Map` - Cursor positions {userId → {cardId, x, y}}
- `versionHistory: Map` - Operation history {cardId → [{version, operation, userId, timestamp}]}
- `conflicts: Map` - Detected conflicts {cardId → [{conflict data}]}

#### 2. WebSocket Server (`server/websocket/server.js`)
Socket.io configuration and authentication:

**Features:**
- JWT authentication on connection
- Automatic connection recovery
- Heartbeat mechanism for stale connection detection
- CORS configuration for frontend access
- Periodic cleanup of idle connections

**Events Handled:**
- `cursor:move` - Cursor position updates
- `card:edit` - Card modification operations
- `card:join` - User joins card session
- `card:leave` - User leaves card session
- `presence:update` - User presence changes (active/away/offline)
- `heartbeat` - Keep-alive signal
- `operation:transform` - OT transformation requests
- `conflict:resolve` - Conflict resolution votes

### Frontend Components

#### 1. Collaboration Store (`src/store/collaborationStore.js`)
Zustand state management for collaboration:

**State:**
- Connection status (connected/disconnected)
- Active users and their presence
- User cursors Map
- Current card session info
- Operation queue
- Version history
- Active conflicts

**Methods:**
- `initializeSocket(socket, userId)` - Initialize WebSocket
- `setConnected(connected)` - Update connection state
- `addActiveUser(user)` - Add user to active list
- `updateUserCursor(userId, cursorData)` - Update cursor position
- `joinCardSession(cardId, collaborators, version)` - Join session
- `queueOperation(operation)` - Queue local operation
- `applyRemoteOperation(operation)` - Apply remote change
- `addConflict(conflict)` - Add conflict to UI queue
- `resolveConflict(conflictId, resolution)` - Resolve conflict

#### 2. Real-time Hooks (`src/hooks/useRealtimeCollaboration.js`)
React hooks for WebSocket integration:

- `useRealtimeConnection()` - Initialize and manage WebSocket
- `useCollaborativeCursor(cardId)` - Track cursor movements
- `useCardSession(cardId)` - Join/leave editing sessions
- `useSendOperation(cardId)` - Send operations to server
- `useConflictResolver()` - Handle conflict resolution
- `useVersionHistory(cardId)` - Manage version history

#### 3. UI Components

**CollaboratorsPanel** (`src/components/Collaboration/CollaboratorsPanel.jsx`)
- Shows all active collaborators
- Displays presence status (active/away/offline)
- Shows editing indicators
- Displays cursor activity count
- Minimizable panel

**VersionHistory** (`src/components/Collaboration/VersionHistory.jsx`)
- Timeline view of all operations
- Shows who made each change
- Displays before/after values
- Revert to any version functionality
- Expandable operation details

**ConflictResolver** (`src/components/Collaboration/ConflictResolver.jsx`)
- Shows conflicts in toast-like format
- 3 resolution options:
  - Keep Mine (local version wins)
  - Accept Theirs (remote version wins)
  - Auto Merge (intelligent merge)
- Resolution status tracker

**RemoteCursor** (`src/components/Collaboration/RemoteCursor.jsx`)
- Visual representation of remote user cursors
- Color-coded per user
- Shows user name/avatar tooltip
- Smooth motion animations

## Operational Transformation (OT) Algorithm

### How It Works

1. **Client sends operation** with current client version
2. **Server checks version** against server version
3. **If versions match**: Apply operation, increment version, broadcast
4. **If versions differ**: Detect conflict, trigger OT transform
5. **Transform operation** against all concurrent operations
6. **Return transformed operation** to client and other users

### Conflict Resolution Strategies

**Keep Mine (keep_mine)**
- Local operation takes precedence
- Remote operation is discarded
- Version incremented once

**Accept Theirs (accept_theirs)**
- Remote operation takes precedence
- Local operation is abandoned
- User notified of override

**Auto Merge (merge)**
- Intelligent combination of both operations
- Used for non-overlapping field edits
- Both changes applied when possible

## Real-time Events Flow

### User Joins Card Session
```
Client: card:join {cardId}
  ↓
Server: Initializes session, sends current state
  ↓
Server: Broadcasts 'user:joined' to all in session
  ↓
All Clients: Update collaborators list
```

### User Edits Field
```
Client: card:edit {operation, version}
  ↓
Server: Validates & transforms operation
  ↓
Server: Increments version, stores in history
  ↓
Server: Broadcasts 'card:changed' to all users
  ↓
All Clients: Apply remote operation, update UI
```

### Conflict Detected
```
Client: card:edit {operation, version}
  ↓
Server: Version mismatch detected
  ↓
Server: Transform operation against history
  ↓
Server: Sends 'conflict:detected' to user
  ↓
Client: Shows ConflictResolver UI
  ↓
User: Selects resolution strategy
  ↓
Client: Sends 'conflict:resolve' {resolution}
  ↓
Server: Broadcasts resolution to all users
```

## Integration Example

### Basic Setup in React Component

```jsx
import { useCardSession, useSendOperation, useCollaborativeCursor } from '../hooks/useRealtimeCollaboration'
import { CollaboratorsPanel, VersionHistory, ConflictResolver } from '../components/Collaboration'

export function CardEditor({ cardId }) {
  // Join editing session
  useCardSession(cardId)
  
  // Track cursor movements
  useCollaborativeCursor(cardId)
  
  // Get send operation function
  const sendOperation = useSendOperation(cardId)
  
  const handleFieldChange = (fieldName, value, oldValue) => {
    sendOperation({
      type: 'update',
      field: fieldName,
      oldValue,
      newValue: value,
      timestamp: Date.now()
    })
  }
  
  return (
    <div>
      {/* Collaboration UI */}
      <CollaboratorsPanel cardId={cardId} />
      <VersionHistory />
      <ConflictResolver />
      
      {/* Card editor */}
      <input
        onChange={(e) => handleFieldChange('title', e.target.value)}
      />
    </div>
  )
}
```

## Performance Optimizations

1. **Cursor throttling** - Updates every 50ms max
2. **Operation batching** - Group rapid changes
3. **History trimming** - Keep only last 100 operations
4. **Memory cleanup** - Remove stale users & sessions
5. **WebSocket transport** - Binary frames for efficiency

## Error Handling

**Connection Lost**
- Auto-reconnect with exponential backoff
- Queue operations while offline
- Sync on reconnection

**Stale Connections**
- 30-second heartbeat timeout
- Auto-disconnect idle users
- Cleanup from session

**Conflict Resolution**
- User prompted to resolve
- Auto-merge attempted
- Fallback to manual resolution

## Database Persistence

Ready to integrate with existing MySQL schema:

```sql
-- Operational history
CREATE TABLE operation_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  card_id VARCHAR(36),
  version INT,
  operation JSON,
  user_id VARCHAR(36),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES cards(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Collaboration sessions
CREATE TABLE collaboration_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  card_id VARCHAR(36),
  active_users JSON,
  version INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES cards(id)
);
```

## Security Considerations

1. **JWT authentication** - All WebSocket connections require valid JWT
2. **User verification** - Operations verified against user permissions
3. **Operation validation** - Prevent malicious operations
4. **Rate limiting** - Throttle operations per user
5. **Audit logging** - Track all changes with user attribution

## Testing Checklist

- [ ] Multiple users can edit same card simultaneously
- [ ] Cursor positions update in real-time
- [ ] Conflicts resolved correctly with all 3 strategies
- [ ] Version history tracks all changes
- [ ] User join/leave broadcasts correctly
- [ ] Presence indicators update on status change
- [ ] Reconnection recovers operation queue
- [ ] Stale connections cleaned up
- [ ] Performance under 100+ concurrent users

## Future Enhancements

1. **Comments & Threads** - Collaborative feedback system
2. **Change Suggestions** - Accept/reject changes UI
3. **Undo/Redo** - Collaborative undo with conflict handling
4. **Field Locking** - Prevent simultaneous edits of same field
5. **Permissions** - Role-based edit restrictions
6. **Activity Log** - Detailed who-did-what-when audit trail
7. **Presence Avatars** - Visual indicators on edited elements
8. **Performance Metrics** - Real-time latency/bandwidth monitoring
