# Training Module In-Place Location Update

## Overview
Updated the Training module to display training materials in-place with location information instead of external URLs. This allows trainings to have physical or virtual locations specified directly within the system.

## Changes Made

### 1. Backend Model Update (`backend/src/modules/training/training.model.js`)

**Before:**
```javascript
materials: [{
  title: String,
  url: String,
  type: String
}]
```

**After:**
```javascript
materials: [{
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['online', 'in-person', 'hybrid'],
    default: 'online'
  }
}]
```

**Benefits:**
- `location` field replaces `url` for storing venue/address or Zoom links
- `type` field is now strictly typed (online, in-person, or hybrid)
- All fields are properly validated

### 2. Frontend Type Definitions (`frontend/lib/api.ts`)

Updated the Training interface:
```typescript
materials?: Array<{ 
  title: string; 
  location: string; 
  type: "online" | "in-person" | "hybrid" 
}>;
```

### 3. Admin Training Page (`frontend/app/(dashboard)/dashboard/admin/training/page.tsx`)

**Updated Create Dialog:**
- Replaced "Materials URL" input with three fields:
  1. **Material Title** - e.g., "Main Workshop", "Advanced Module"
  2. **Location Type** - Dropdown (Online, In-Person, Hybrid)
  3. **Location/Address** - Textarea for venue address or Zoom link

**Form Data:**
```typescript
const [createData, setCreateData] = useState({
  title: "",
  description: "",
  category: "",
  level: "",
  instructor: "",
  duration: "",
  materialTitle: "",
  location: "",
  locationType: "online"
});
```

### 4. Applicant Training Page (`frontend/app/(dashboard)/dashboard/applicant/training/page.tsx`)

**Updated Materials Display:**

Before:
```
Materials:
📎 Material Title
```

After:
```
📍 Training Location
┌──────────────────────────────┐
│ Material Title               │
│ [ONLINE] Location info here  │
└──────────────────────────────┘
```

**Visual Features:**
- Blue-colored card container (blue-50 / blue-950)
- Location icon (📍) header
- Type badge (ONLINE, IN-PERSON, HYBRID)
- Clear, in-place display of location information
- Dark mode support with appropriate colors

## Use Cases

### Online Training
- **Material Title**: "Zoom Workshop"
- **Type**: Online
- **Location**: "https://zoom.us/j/..." or "Zoom Meeting Link"

### In-Person Training
- **Material Title**: "Conference Room Workshop"
- **Type**: In-Person
- **Location**: "Building A, Room 101, 123 Main Street"

### Hybrid Training
- **Material Title**: "Main Module"
- **Type**: Hybrid
- **Location**: "Building A Room 101 or Zoom: https://zoom.us/j/..."

## Technical Details

### Type Safety
- All location types are now strictly typed
- TypeScript ensures only valid types are used
- Frontend and backend validation in place

### Display Styling
- Professional blue color scheme matching sidebar updates
- Responsive design works on all screen sizes
- Dark mode fully supported

### Data Structure
Materials now follow this structure:
```typescript
{
  title: string;      // e.g., "Main Workshop"
  location: string;   // e.g., "Room 101" or "Zoom link"
  type: "online" | "in-person" | "hybrid";
}
```

## Files Modified
1. `backend/src/modules/training/training.model.js` - Updated schema
2. `frontend/lib/api.ts` - Updated TypeScript interfaces
3. `frontend/app/(dashboard)/dashboard/admin/training/page.tsx` - Updated admin UI
4. `frontend/app/(dashboard)/dashboard/applicant/training/page.tsx` - Updated display

## Migration Notes

**For existing data:**
- Existing URL-based materials will need to be migrated manually
- Can be converted to location strings in the format: "URL: [original_url]"
- Admin can edit trainings to move URLs to location field

**For new trainings:**
- Use the new location-based system
- Support for online (Zoom), in-person (address), and hybrid formats

## Benefits

✅ **Location-based system** - More intuitive for training management
✅ **In-place display** - No external navigation required
✅ **Type support** - Clear indication of training format
✅ **Professional UI** - Consistent with modern design standards
✅ **Type safety** - TypeScript prevents invalid location types
✅ **Flexibility** - Supports all training formats
✅ **Dark mode** - Full theme support for better UX
