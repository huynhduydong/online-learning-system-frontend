import { NextResponse } from 'next/server'

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  version: string
  environment: string
  services: {
    database: 'connected' | 'disconnected'
    cache: 'connected' | 'disconnected'
    external_apis: 'connected' | 'disconnected'
  }
  uptime: number
  memory_usage: {
    used: number
    total: number
    percentage: number
  }
  system_info: {
    node_version: string
    platform: string
    arch: string
  }
}

// Track application start time for uptime calculation
const startTime = Date.now()

export async function GET() {
  try {
    // Calculate uptime in seconds
    const uptime = Math.floor((Date.now() - startTime) / 1000)
    
    // Get memory usage information
    const memoryUsage = process.memoryUsage()
    const totalMemory = memoryUsage.heapTotal
    const usedMemory = memoryUsage.heapUsed
    const memoryPercentage = Math.round((usedMemory / totalMemory) * 100)

    // Mock service health checks
    // In a real application, these would be actual health checks
    const services = {
      database: 'connected' as const,
      cache: 'connected' as const,
      external_apis: 'connected' as const
    }

    // Determine overall health status
    const allServicesHealthy = Object.values(services).every(status => status === 'connected')
    const overallStatus = allServicesHealthy ? 'healthy' : 'unhealthy'

    const healthCheck: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services,
      uptime,
      memory_usage: {
        used: Math.round(usedMemory / 1024 / 1024), // Convert to MB
        total: Math.round(totalMemory / 1024 / 1024), // Convert to MB
        percentage: memoryPercentage
      },
      system_info: {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch
      }
    }

    // Return appropriate HTTP status code based on health
    const statusCode = overallStatus === 'healthy' ? 200 : 503

    return NextResponse.json(healthCheck, { status: statusCode })
  } catch (error) {
    console.error('Health check error:', error)
    
    // Return unhealthy status if there's an error
    const errorResponse: HealthCheckResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'disconnected',
        cache: 'disconnected',
        external_apis: 'disconnected'
      },
      uptime: Math.floor((Date.now() - startTime) / 1000),
      memory_usage: {
        used: 0,
        total: 0,
        percentage: 0
      },
      system_info: {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch
      }
    }

    return NextResponse.json(errorResponse, { status: 503 })
  }
}

// Support HEAD requests for simple health checks
export async function HEAD() {
  try {
    // Simple health check without detailed response
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    return new NextResponse(null, { status: 503 })
  }
}