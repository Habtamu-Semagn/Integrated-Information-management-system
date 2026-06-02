# Quick Start Guide: New Feature Modules

## Overview
Four new feature modules have been added to the Startup Backend System. This guide provides quick examples for testing each module.

---

## 1. Authentication Setup

First, authenticate to get a JWT token:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Startup",
    "email": "john@startup.com",
    "password": "SecurePass123",
    "role": "applicant"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@startup.com",
    "password": "SecurePass123"
  }'
```

Save the JWT token from the response. Use it in subsequent requests with:
```bash
-H "Cookie: token=YOUR_JWT_TOKEN"
```

---

## 2. Training Module

### Browse Training Courses
```bash
curl http://localhost:5000/api/training \
  -H "Cookie: token=JWT_TOKEN"

# Filter by category
curl http://localhost:5000/api/training?category=finance \
  -H "Cookie: token=JWT_TOKEN"

# Filter by level
curl http://localhost:5000/api/training?level=beginner \
  -H "Cookie: token=JWT_TOKEN"
```

### Create Training (Admin only)
```bash
curl -X POST http://localhost:5000/api/training \
  -H "Content-Type: application/json" \
  -H "Cookie: token=ADMIN_TOKEN" \
  -d '{
    "title": "Startup Finance 101",
    "description": "Learn essential financial management for startups. This comprehensive course covers budgeting, cash flow management, and financial forecasting.",
    "category": "finance",
    "level": "beginner",
    "instructor": "Jane Financial",
    "duration": 90,
    "content": "Course content including modules on revenue models, expense tracking, fundraising preparation...",
    "materials": [
      {
        "title": "Financial Models Template",
        "url": "https://example.com/templates.xlsx",
        "type": "spreadsheet"
      }
    ]
  }'
```

### Enroll in Training
```bash
curl -X POST http://localhost:5000/api/training/TRAINING_ID/enroll \
  -H "Cookie: token=JWT_TOKEN"
```

### Complete Training
```bash
curl -X POST http://localhost:5000/api/training/TRAINING_ID/complete \
  -H "Cookie: token=JWT_TOKEN"
```

### View My Trainings
```bash
curl http://localhost:5000/api/training/me/enrolled \
  -H "Cookie: token=JWT_TOKEN"
```

---

## 3. Fund Module

### Browse Funding Opportunities
```bash
curl http://localhost:5000/api/funds \
  -H "Cookie: token=JWT_TOKEN"

# Filter by status
curl http://localhost:5000/api/funds?status=open \
  -H "Cookie: token=JWT_TOKEN"

# Filter by fund type
curl http://localhost:5000/api/funds?fundType=seed-funding \
  -H "Cookie: token=JWT_TOKEN"

# Only open funds with future deadlines
curl http://localhost:5000/api/funds?onlyOpen=true \
  -H "Cookie: token=JWT_TOKEN"
```

### Create Funding Opportunity (Admin only)
```bash
curl -X POST http://localhost:5000/api/funds \
  -H "Content-Type: application/json" \
  -H "Cookie: token=ADMIN_TOKEN" \
  -d '{
    "title": "Series A Funding 2024",
    "description": "We are seeking innovative tech startups with proven product-market fit. Ideal for Series A stage companies with ARR between $100K and $10M.",
    "fundType": "series-a",
    "minimumAmount": 500000,
    "maximumAmount": 5000000,
    "currency": "USD",
    "deadline": "2024-12-31",
    "fundingOrganization": "TechVentures Partners",
    "requirements": {
      "minTeamSize": 3,
      "targetIndustries": ["SaaS", "FinTech", "AI/ML"],
      "eligibleCountries": ["US", "Canada", "UK"]
    }
  }'
```

### Apply for Funding
```bash
curl -X POST http://localhost:5000/api/funds/FUND_ID/apply \
  -H "Content-Type: application/json" \
  -H "Cookie: token=JWT_TOKEN" \
  -d '{
    "teamSize": 5,
    "fundingRequired": 2000000,
    "useOfFunds": "Product development (40%), Marketing (35%), Operations (25%)",
    "businessPlan": "Our 5-year business plan shows projected revenue of $50M by year 5...",
    "financialProjections": "Conservative projections show profitability by month 18..."
  }'
```

### View My Applications
```bash
curl http://localhost:5000/api/funds/me/applications \
  -H "Cookie: token=JWT_TOKEN"
```

### Update Application Status (Admin/Staff only)
```bash
curl -X PATCH http://localhost:5000/api/funds/applications/APP_ID/status \
  -H "Content-Type: application/json" \
  -H "Cookie: token=STAFF_TOKEN" \
  -d '{
    "status": "approved",
    "comments": "Excellent team and market potential. Approved for Series A funding."
  }'
```

---

## 4. Competition Module

### Browse Competitions
```bash
curl http://localhost:5000/api/competitions \
  -H "Cookie: token=JWT_TOKEN"

# Filter by status
curl http://localhost:5000/api/competitions?status=upcoming \
  -H "Cookie: token=JWT_TOKEN"

# Only upcoming competitions
curl http://localhost:5000/api/competitions?upcomingOnly=true \
  -H "Cookie: token=JWT_TOKEN"
```

### Create Competition (Admin only)
```bash
curl -X POST http://localhost:5000/api/competitions \
  -H "Content-Type: application/json" \
  -H "Cookie: token=ADMIN_TOKEN" \
  -d '{
    "title": "Pitch Perfect 2024",
    "description": "Annual pitch competition for startup founders. Win up to $100,000 and gain mentorship from industry leaders.",
    "competitionType": "pitch-competition",
    "registrationDeadline": "2024-11-30",
    "competitionDate": "2024-12-15",
    "location": "Virtual",
    "isVirtual": true,
    "maxParticipants": 100,
    "prizes": {
      "firstPlace": 50000,
      "secondPlace": 25000,
      "thirdPlace": 10000,
      "currency": "USD"
    },
    "judges": [
      {
        "name": "Jane Smith",
        "expertise": "Venture Capital",
        "imageUrl": "https://example.com/jane.jpg"
      },
      {
        "name": "Bob Johnson",
        "expertise": "Product Management",
        "imageUrl": "https://example.com/bob.jpg"
      }
    ]
  }'
```

### Register for Competition
```bash
curl -X POST http://localhost:5000/api/competitions/COMP_ID/register \
  -H "Cookie: token=JWT_TOKEN"
```

### View Competition Details
```bash
curl http://localhost:5000/api/competitions/COMP_ID \
  -H "Cookie: token=JWT_TOKEN"
```

### Publish Results (Admin only)
```bash
curl -X POST http://localhost:5000/api/competitions/COMP_ID/results \
  -H "Content-Type: application/json" \
  -H "Cookie: token=ADMIN_TOKEN" \
  -d '{
    "results": {
      "firstPlaceWinner": "USER_ID_1",
      "secondPlaceWinner": "USER_ID_2",
      "thirdPlaceWinner": "USER_ID_3",
      "results": [
        {
          "participantId": "USER_ID_1",
          "rank": 1,
          "score": 95,
          "feedback": "Excellent pitch, clear vision, strong team"
        },
        {
          "participantId": "USER_ID_2",
          "rank": 2,
          "score": 88,
          "feedback": "Good market analysis, needs financial refinement"
        }
      ]
    }
  }'
```

---

## 5. Events Module

### Browse Events
```bash
curl http://localhost:5000/api/events \
  -H "Cookie: token=JWT_TOKEN"

# Filter by event type
curl http://localhost:5000/api/events?eventType=webinar \
  -H "Cookie: token=JWT_TOKEN"

# Filter by category
curl http://localhost:5000/api/events?category=technology \
  -H "Cookie: token=JWT_TOKEN"

# Only upcoming events
curl http://localhost:5000/api/events?upcomingOnly=true \
  -H "Cookie: token=JWT_TOKEN"
```

### Create Event (Admin only)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Cookie: token=ADMIN_TOKEN" \
  -d '{
    "title": "Growth Hacking Masterclass",
    "description": "Learn proven growth hacking techniques from founders who scaled to unicorn status. Interactive session with Q&A.",
    "eventType": "masterclass",
    "startDateTime": "2024-12-20T10:00:00Z",
    "endDateTime": "2024-12-20T12:00:00Z",
    "isVirtual": true,
    "capacity": 500,
    "category": "marketing",
    "speakers": [
      {
        "name": "Sarah Growth",
        "title": "Growth Lead at TechCorp",
        "bio": "Scaled 3 startups from 0 to $1B valuation",
        "imageUrl": "https://example.com/sarah.jpg"
      }
    ],
    "agenda": [
      {
        "time": "10:00",
        "activity": "Introduction to Growth Hacking",
        "speaker": "Sarah Growth",
        "duration": 30
      },
      {
        "time": "10:30",
        "activity": "Case Studies: Real Growth Strategies",
        "speaker": "Sarah Growth",
        "duration": 45
      },
      {
        "time": "11:15",
        "activity": "Q&A and Discussion",
        "speaker": "Sarah Growth",
        "duration": 30
      }
    ]
  }'
```

### Register for Event
```bash
curl -X POST http://localhost:5000/api/events/EVENT_ID/register \
  -H "Cookie: token=JWT_TOKEN"
```

### View My Events
```bash
curl http://localhost:5000/api/events/me/registered \
  -H "Cookie: token=JWT_TOKEN"
```

### Add Event Materials (Admin only)
```bash
curl -X POST http://localhost:5000/api/events/EVENT_ID/materials \
  -H "Content-Type: application/json" \
  -H "Cookie: token=ADMIN_TOKEN" \
  -d '{
    "materials": [
      {
        "title": "Presentation Slides",
        "url": "https://example.com/slides.pdf",
        "type": "pdf"
      },
      {
        "title": "Event Recording",
        "url": "https://youtube.com/watch?v=...",
        "type": "video"
      },
      {
        "title": "Resources and Links",
        "url": "https://example.com/resources",
        "type": "link"
      }
    ]
  }'
```

---

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Example Title",
    ...
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## Common Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing auth) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not found |
| 409 | Conflict (duplicate, already registered, etc.) |
| 500 | Server error |

---

## Testing Checklist

### Training Module
- [ ] Create training course (as admin)
- [ ] Browse training courses
- [ ] Enroll in training
- [ ] Mark training complete
- [ ] View my trainings

### Fund Module
- [ ] Create funding opportunity (as admin)
- [ ] Browse funding opportunities
- [ ] Apply for funding
- [ ] View my applications
- [ ] Update application status (as staff)

### Competition Module
- [ ] Create competition (as admin)
- [ ] Browse competitions
- [ ] Register for competition
- [ ] View competition details
- [ ] Publish results (as admin)

### Events Module
- [ ] Create event (as admin)
- [ ] Browse events
- [ ] Register for event
- [ ] View my events
- [ ] Add event materials (as admin)

---

## Role Testing

### Test with Different Roles

```bash
# Create admin user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@startup.com",
    "password": "SecurePass123",
    "role": "admin"
  }'

# Create staff user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Staff User",
    "email": "staff@startup.com",
    "password": "SecurePass123",
    "role": "staff"
  }'
```

Then test operations with each role to verify access control is working correctly.

---

## Troubleshooting

### 401 Unauthorized
- Ensure JWT token is included in Cookie header
- Ensure token is valid and not expired
- Check token format: `token=YOUR_TOKEN_HERE`

### 403 Forbidden
- Verify user role has permission for the operation
- Admins: all operations
- Staff: review and management operations
- Applicants: browse and apply operations

### 404 Not Found
- Verify resource ID is correct
- Check resource exists by listing all resources
- Ensure ID format is valid MongoDB ObjectId

### 409 Conflict
- Already registered for event/competition
- Already applied for funding
- Duplicate entry
- Try withdrawing/unregistering first

---

## Next Steps

1. **Test All Endpoints** - Use curl commands above
2. **Build Frontend Pages** - Create dashboard pages for each module
3. **Add More Filters** - Extend query filter support
4. **Setup Email Notifications** - Email on deadlines, registrations
5. **Create Analytics** - Track usage and engagement

---

**Last Updated**: June 2, 2026  
**Module Status**: ✓ Complete and Integrated  
**Documentation**: Complete
