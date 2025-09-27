/**
 * API Proxy Route
 * Handles server-side proxying of API requests to avoid Mixed Content issues
 * This allows HTTPS frontend to communicate with HTTP backends through Next.js server
 */

import { NextRequest, NextResponse } from 'next/server'

// Get the backend API base URL from environment
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api$/, '') || 'http://localhost:5000'

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return handleProxyRequest(request, params.path, 'GET')
}

export async function POST(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return handleProxyRequest(request, params.path, 'POST')
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return handleProxyRequest(request, params.path, 'PUT')
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return handleProxyRequest(request, params.path, 'PATCH')
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return handleProxyRequest(request, params.path, 'DELETE')
}

async function handleProxyRequest(
    request: NextRequest,
    pathSegments: string[],
    method: string
) {
    try {
        // Construct the target URL
        const path = pathSegments.join('/')
        const targetUrl = `${BACKEND_API_BASE_URL}/api/${path}`

        // Get query parameters
        const searchParams = request.nextUrl.searchParams.toString()
        const finalUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl

        console.log(`🔄 Proxying ${method} request to: ${finalUrl}`)

        // Prepare headers (exclude host and other problematic headers)
        const headers = new Headers()
        request.headers.forEach((value, key) => {
            if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
                headers.set(key, value)
            }
        })

        // Prepare request options
        const requestOptions: RequestInit = {
            method,
            headers,
        }

        // Add body for non-GET requests
        if (method !== 'GET' && method !== 'HEAD') {
            const contentType = request.headers.get('content-type')

            if (contentType?.includes('application/json')) {
                const body = await request.json()
                requestOptions.body = JSON.stringify(body)
            } else if (contentType?.includes('multipart/form-data')) {
                const formData = await request.formData()
                requestOptions.body = formData
                // Remove content-type header to let fetch set it with boundary
                headers.delete('content-type')
            } else {
                const body = await request.text()
                requestOptions.body = body
            }
        }

        // Make the proxied request
        const response = await fetch(finalUrl, requestOptions)

        // Get response data
        const responseData = await response.text()

        // Create new response with same status and headers
        const proxyResponse = new NextResponse(responseData, {
            status: response.status,
            statusText: response.statusText,
        })

        // Copy response headers (excluding problematic ones)
        response.headers.forEach((value, key) => {
            if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
                proxyResponse.headers.set(key, value)
            }
        })

        // Add CORS headers if needed
        proxyResponse.headers.set('Access-Control-Allow-Origin', '*')
        proxyResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        proxyResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        console.log(`✅ Proxy response: ${response.status} ${response.statusText}`)

        return proxyResponse

    } catch (error) {
        console.error('❌ Proxy error:', error)

        return NextResponse.json(
            {
                error: 'Proxy request failed',
                message: error instanceof Error ? error.message : 'Unknown error',
                success: false
            },
            { status: 500 }
        )
    }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    })
}
