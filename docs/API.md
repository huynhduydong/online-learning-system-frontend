# 🔌 API Documentation

## Overview

Online Learning System API provides endpoints for managing courses, users, and learning progress.

## Base URL
\`\`\`
Development: http://localhost:3000/api
Production: https://your-domain.com/api
\`\`\`

## Authentication

### Login
\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "user-1",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "student",
  "avatar": "/avatar.jpg"
}
\`\`\`

### Logout
\`\`\`http
POST /api/auth/logout
\`\`\`

## Courses

### Get All Courses
\`\`\`http
GET /api/courses
\`\`\`

**Query Parameters:**
- `category` (optional): Filter by category
- `level` (optional): Filter by level (beginner, intermediate, advanced)
- `search` (optional): Search in title and description

**Response:**
\`\`\`json
[
  {
    "id": "1",
    "title": "React Development",
    "description": "Learn React from basics to advanced",
    "instructor": {
      "id": "instructor-1",
      "name": "John Smith",
      "avatar": "/instructor.jpg"
    },
    "thumbnail": "/course-thumbnail.jpg",
    "price": 1500000,
    "duration": 1200,
    "level": "intermediate",
    "category": "Programming",
    "rating": 4.8,
    "studentsCount": 1250,
    "lessons": [...],
    "createdAt": "2024-01-15T00:00:00Z",
    "updatedAt": "2024-01-20T00:00:00Z"
  }
]
\`\`\`

### Get Single Course
\`\`\`http
GET /api/courses/{id}
\`\`\`

### Enroll in Course
\`\`\`http
POST /api/courses/{id}/enroll
Authorization: Bearer {token}
\`\`\`

### Get Enrolled Courses
\`\`\`http
GET /api/courses/enrolled
Authorization: Bearer {token}
\`\`\`

## Lessons

### Get Course Lessons
\`\`\`http
GET /api/courses/{courseId}/lessons
Authorization: Bearer {token}
\`\`\`

### Mark Lesson Complete
\`\`\`http
POST /api/courses/{courseId}/lessons/{lessonId}/complete
Authorization: Bearer {token}
\`\`\`

## Progress

### Get Learning Progress
\`\`\`http
GET /api/progress/{courseId}
Authorization: Bearer {token}
\`\`\`

**Response:**
\`\`\`json
{
  "courseId": "1",
  "completedLessons": 5,
  "totalLessons": 10,
  "progressPercentage": 50,
  "lastAccessedAt": "2024-01-20T10:30:00Z"
}
\`\`\`

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "error": "Not Found",
  "message": "Course not found"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
\`\`\`

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Webhooks

### Course Enrollment
\`\`\`json
{
  "event": "course.enrolled",
  "data": {
    "courseId": "1",
    "userId": "user-1",
    "enrolledAt": "2024-01-20T10:30:00Z"
  }
}
\`\`\`

### Lesson Completed
\`\`\`json
{
  "event": "lesson.completed",
  "data": {
    "courseId": "1",
    "lessonId": "lesson-1",
    "userId": "user-1",
    "completedAt": "2024-01-20T10:30:00Z"
  }
}
