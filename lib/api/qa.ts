import { ApiClient } from './client'
import type {
  // Question types
  Question,
  QuestionDetail,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionQueryParams,
  ApiQuestionsResponse,
  LegacyApiQuestionsResponse,
  ApiQuestionResponse,
  ApiCreateQuestionResponse,
  
  // Answer types
  Answer,
  CreateAnswerRequest,
  UpdateAnswerRequest,
  ApiAnswersResponse,
  ApiAnswerResponse,
  ApiCreateAnswerResponse,
  
  // Comment types
  Comment,
  CreateCommentRequest,
  ApiCommentsResponse,
  ApiCommentResponse,
  ApiCreateCommentResponse,
  
  // Vote types
  VoteRequest,
  ApiVoteResponse,
  
  // Tag types
  QuestionTag,
  ApiTagsResponse,
  
  // Stats types
  QuestionStats,
  ApiQuestionStatsResponse,
  
  // Notification types
  QANotification,
  ApiNotificationsResponse
} from './types'

export class QAService {
  private client: ApiClient

  constructor() {
    this.client = new ApiClient()
  }

  // ===== QUESTION METHODS =====

  /**
   * Get questions with filtering and pagination
   */
  async getQuestions(params?: QuestionQueryParams): Promise<{ questions: Question[], pagination: any }> {
    try {
      // Prepare parameters for the new API endpoint
      const apiParams = {
        page: params?.page || 1,
        per_page: params?.per_page || 20,
        category: params?.category,
        scope: params?.scope || 'course',
        scope_id: params?.scope_id !== undefined ? params.scope_id : 1,
        sort_by: params?.sort_by || 'newest',
        q: params?.q,
        status: params?.status,
        tag: params?.tag
      }

      // Use the new API endpoint
      const response = await this.client.get<ApiQuestionsResponse>('/questions', { params: apiParams })
      
      if (response.success && response.data) {
        // Handle new API format where data is an array of questions
        if (Array.isArray(response.data)) {
          return {
            questions: response.data,
            pagination: response.pagination || {}
          }
        }
        // Fallback for other formats
        return {
          questions: response.data,
          pagination: response.pagination || {}
        }
      }
      
      throw new Error(response.message || 'Failed to fetch questions')
    } catch (error) {
      console.error('Error fetching questions:', error)
      
      // Handle specific database schema errors
      if (error instanceof Error && error.message.includes('Unknown column')) {
        const schemaError = new Error('Database schema error: The backend database is missing required columns. Please contact the administrator to update the database schema.')
        schemaError.name = 'DatabaseSchemaError'
        throw schemaError
      }
      
      // Handle API client errors with more specific messaging
      if (error.name === 'ApiClientError' && error.message.includes('votable_type')) {
        const voteSchemaError = new Error('Vote system database error: The votes table is missing required columns. Please contact the administrator to update the database schema.')
        voteSchemaError.name = 'VoteSchemaError'
        throw voteSchemaError
      }
      
      throw error
    }
  }

  /**
   * Helper method to get questions for a specific lesson
   */
  async getQuestionsForLesson(
    lessonId: number, 
    page: number = 1, 
    perPage: number = 5,
    additionalParams?: Omit<QuestionQueryParams, 'scope' | 'scope_id' | 'page' | 'per_page'>
  ): Promise<{ questions: Question[], pagination: any }> {
    return this.getQuestions({
      scope: 'lesson',
      scope_id: lessonId,
      page,
      per_page: perPage,
      ...additionalParams
    })
  }

  /**
   * Get a specific question with answers and comments
   */
  async getQuestion(questionId: number): Promise<QuestionDetail> {
    try {
      const response = await this.client.get<ApiQuestionResponse>(`/qa/questions/${questionId}`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to fetch question')
    } catch (error) {
      console.error('Error fetching question:', error)
      throw error
    }
  }

  /**
   * Create a new question
   */
  async createQuestion(data: CreateQuestionRequest): Promise<Question> {
    try {
      console.log('=== CREATE QUESTION DEBUG ===')
      console.log('Input data received:', data)
      console.log('Data type:', typeof data)
      console.log('Data keys:', Object.keys(data))
      
      // Always send as JSON to match backend expectations
      console.log('Sending as JSON format')
      
      // Prepare JSON payload according to API specification
      const jsonData: any = {
        title: data.title,
        content: data.content,
        category: data.category,
        scope: data.scope
      }
      
      // Add scope_id if provided
      if (data.scope_id) {
        jsonData.scope_id = data.scope_id
      }
      
      // Handle tags - send as array of strings
      if (data.tags && data.tags.length > 0) {
        jsonData.tags = data.tags
      } else {
        jsonData.tags = []
      }
      
      console.log('Final JSON payload:', jsonData)
      console.log('JSON payload stringified:', JSON.stringify(jsonData))
      console.log('=== END DEBUG ===')
      
      const response = await this.client.post<ApiCreateQuestionResponse>('/qa/questions', jsonData)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to create question')
    } catch (error) {
      console.error('Error creating question:', error)
      throw error
    }
  }

  /**
   * Update a question
   */
  async updateQuestion(questionId: number, data: UpdateQuestionRequest): Promise<Question> {
    try {
      const response = await this.client.put<ApiCreateQuestionResponse>(`/qa/questions/${questionId}`, data)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to update question')
    } catch (error) {
      console.error('Error updating question:', error)
      throw error
    }
  }

  /**
   * Delete a question
   */
  async deleteQuestion(questionId: number): Promise<void> {
    try {
      const response = await this.client.delete(`/qa/questions/${questionId}`)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete question')
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      throw error
    }
  }

  /**
   * Pin/unpin a question
   */
  async toggleQuestionPin(questionId: number): Promise<Question> {
    try {
      const response = await this.client.post<ApiCreateQuestionResponse>(`/qa/questions/${questionId}/pin`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to toggle question pin')
    } catch (error) {
      console.error('Error toggling question pin:', error)
      throw error
    }
  }

  /**
   * Feature/unfeature a question
   */
  async toggleQuestionFeature(questionId: number): Promise<Question> {
    try {
      const response = await this.client.post<ApiCreateQuestionResponse>(`/qa/questions/${questionId}/feature`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to toggle question feature')
    } catch (error) {
      console.error('Error toggling question feature:', error)
      throw error
    }
  }

  /**
   * Close a question
   */
  async closeQuestion(questionId: number): Promise<Question> {
    try {
      const response = await this.client.post<ApiCreateQuestionResponse>(`/qa/questions/${questionId}/close`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to close question')
    } catch (error) {
      console.error('Error closing question:', error)
      throw error
    }
  }

  // ===== ANSWER METHODS =====

  /**
   * Get answers for a question
   */
  async getAnswers(questionId: number, page = 1, perPage = 10): Promise<ApiAnswersResponse['data']> {
    try {
      const response = await this.client.get<ApiAnswersResponse>(`/qa/questions/${questionId}/answers`, {
        params: { page, per_page: perPage }
      })
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to fetch answers')
    } catch (error) {
      console.error('Error fetching answers:', error)
      throw error
    }
  }

  /**
   * Create an answer
   */
  async createAnswer(data: CreateAnswerRequest): Promise<Answer> {
    try {
      const formData = new FormData()
      
      formData.append('question_id', data.question_id.toString())
      formData.append('content', data.content)
      
      // Add attachments
      if (data.attachments) {
        data.attachments.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file)
        })
      }
      
      const response = await this.client.post<ApiCreateAnswerResponse>('/qa/answers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to create answer')
    } catch (error) {
      console.error('Error creating answer:', error)
      throw error
    }
  }

  /**
   * Update an answer
   */
  async updateAnswer(answerId: number, data: UpdateAnswerRequest): Promise<Answer> {
    try {
      const response = await this.client.put<ApiCreateAnswerResponse>(`/qa/answers/${answerId}`, data)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to update answer')
    } catch (error) {
      console.error('Error updating answer:', error)
      throw error
    }
  }

  /**
   * Delete an answer
   */
  async deleteAnswer(answerId: number): Promise<void> {
    try {
      const response = await this.client.delete(`/qa/answers/${answerId}`)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete answer')
      }
    } catch (error) {
      console.error('Error deleting answer:', error)
      throw error
    }
  }

  /**
   * Accept an answer
   */
  async acceptAnswer(answerId: number): Promise<Answer> {
    try {
      const response = await this.client.post<ApiCreateAnswerResponse>(`/qa/answers/${answerId}/accept`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to accept answer')
    } catch (error) {
      console.error('Error accepting answer:', error)
      throw error
    }
  }

  /**
   * Pin/unpin an answer
   */
  async toggleAnswerPin(answerId: number): Promise<Answer> {
    try {
      const response = await this.client.post<ApiCreateAnswerResponse>(`/qa/answers/${answerId}/pin`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to toggle answer pin')
    } catch (error) {
      console.error('Error toggling answer pin:', error)
      throw error
    }
  }

  // ===== COMMENT METHODS =====

  /**
   * Get comments for a question or answer
   */
  async getComments(
    commentableType: 'question' | 'answer',
    commentableId: number,
    page = 1,
    perPage = 10
  ): Promise<ApiCommentsResponse['data']> {
    try {
      const response = await this.client.get<ApiCommentsResponse>(`/qa/${commentableType}s/${commentableId}/comments`, {
        params: { page, per_page: perPage }
      })
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to fetch comments')
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
  }

  /**
   * Create a comment
   */
  async createComment(data: CreateCommentRequest): Promise<Comment> {
    try {
      const response = await this.client.post<ApiCreateCommentResponse>('/qa/comments', data)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to create comment')
    } catch (error) {
      console.error('Error creating comment:', error)
      throw error
    }
  }

  /**
   * Update a comment
   */
  async updateComment(commentId: number, content: string): Promise<Comment> {
    try {
      const response = await this.client.put<ApiCreateCommentResponse>(`/qa/comments/${commentId}`, { content })
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to update comment')
    } catch (error) {
      console.error('Error updating comment:', error)
      throw error
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: number): Promise<void> {
    try {
      const response = await this.client.delete(`/qa/comments/${commentId}`)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  }

  // ===== VOTE METHODS =====

  /**
   * Vote on a question
   */
  async voteQuestion(questionId: number, voteType: 'up' | 'down'): Promise<ApiVoteResponse['data']> {
    try {
      const response = await this.client.post<ApiVoteResponse>(`/qa/questions/${questionId}/vote`, {
        vote_type: voteType
      })
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to vote on question')
    } catch (error) {
      console.error('Error voting on question:', error)
      throw error
    }
  }

  /**
   * Vote on an answer
   */
  async voteAnswer(answerId: number, voteType: 'up' | 'down'): Promise<ApiVoteResponse['data']> {
    try {
      const response = await this.client.post<ApiVoteResponse>(`/qa/answers/${answerId}/vote`, {
        vote_type: voteType
      })
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to vote on answer')
    } catch (error) {
      console.error('Error voting on answer:', error)
      throw error
    }
  }

  /**
   * Remove vote from question
   */
  async removeQuestionVote(questionId: number): Promise<ApiVoteResponse['data']> {
    try {
      const response = await this.client.delete<ApiVoteResponse>(`/qa/questions/${questionId}/vote`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to remove vote from question')
    } catch (error) {
      console.error('Error removing vote from question:', error)
      throw error
    }
  }

  /**
   * Remove vote from answer
   */
  async removeAnswerVote(answerId: number): Promise<ApiVoteResponse['data']> {
    try {
      const response = await this.client.delete<ApiVoteResponse>(`/qa/answers/${answerId}/vote`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to remove vote from answer')
    } catch (error) {
      console.error('Error removing vote from answer:', error)
      throw error
    }
  }

  // ===== TAG METHODS =====

  /**
   * Get all available tags
   */
  async getTags(search?: string): Promise<QuestionTag[]> {
    try {
      const response = await this.client.get<ApiTagsResponse>('/qa/tags', {
        params: search ? { search } : undefined
      })
      
      if (response.success && response.data) {
        return response.data.tags
      }
      
      throw new Error(response.message || 'Failed to fetch tags')
    } catch (error) {
      console.error('Error fetching tags:', error)
      throw error
    }
  }

  /**
   * Create a new tag
   */
  async createTag(name: string, description?: string, color?: string): Promise<QuestionTag> {
    try {
      const response = await this.client.post<{ success: boolean; message: string; data: QuestionTag }>('/qa/tags', {
        name,
        description,
        color
      })
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to create tag')
    } catch (error) {
      console.error('Error creating tag:', error)
      throw error
    }
  }

  // ===== STATISTICS METHODS =====

  /**
   * Get Q&A statistics
   */
  async getStats(scopeType?: string, scopeId?: number): Promise<QuestionStats> {
    try {
      const params: any = {}
      if (scopeType) params.scope_type = scopeType
      if (scopeId) params.scope_id = scopeId
      
      const response = await this.client.get<ApiQuestionStatsResponse>('/qa/stats', { params })
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to fetch stats')
    } catch (error) {
      console.error('Error fetching stats:', error)
      throw error
    }
  }

  // ===== NOTIFICATION METHODS =====

  /**
   * Get Q&A notifications
   */
  async getNotifications(page = 1, perPage = 10): Promise<ApiNotificationsResponse['data']> {
    try {
      const response = await this.client.get<ApiNotificationsResponse>('/qa/notifications', {
        params: { page, per_page: perPage }
      })
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to fetch notifications')
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      const response = await this.client.post(`/qa/notifications/${notificationId}/read`)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to mark notification as read')
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(): Promise<void> {
    try {
      const response = await this.client.post('/qa/notifications/read-all')
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to mark all notifications as read')
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  // ===== SEARCH METHODS =====

  /**
   * Search questions with suggestions
   */
  async searchQuestions(query: string, params?: Partial<QuestionQueryParams>): Promise<{ questions: Question[], pagination: any }> {
    try {
      const searchParams = {
        q: query,
        scope: params?.scope || 'course',
        scope_id: params?.scope_id || 1,
        page: params?.page || 1,
        per_page: params?.per_page || 20,
        ...params
      }
      
      return await this.getQuestions(searchParams)
    } catch (error) {
      console.error('Error searching questions:', error)
      throw error
    }
  }

  /**
   * Get related questions for a specific question
   */
  async getRelatedQuestions(questionId: number, limit = 5): Promise<Question[]> {
    try {
      const response = await this.client.get<{ success: boolean; message: string; data: Question[] }>(
        `/qa/questions/${questionId}/related`,
        { params: { limit } }
      )
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to fetch related questions')
    } catch (error) {
      console.error('Error fetching related questions:', error)
      throw error
    }
  }

  /**
   * Get question suggestions based on title
   */
  async getQuestionSuggestions(title: string, scopeType?: string, scopeId?: number): Promise<Question[]> {
    try {
      const params: any = { title }
      if (scopeType) params.scope_type = scopeType
      if (scopeId) params.scope_id = scopeId
      
      const response = await this.client.get<{ success: boolean; message: string; data: Question[] }>(
        '/qa/questions/suggestions',
        { params }
      )
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to fetch question suggestions')
    } catch (error) {
      console.error('Error fetching question suggestions:', error)
      throw error
    }
  }
}

// Export singleton instance
export const qaService = new QAService()

// Export alias for backward compatibility
export const qaApi = qaService