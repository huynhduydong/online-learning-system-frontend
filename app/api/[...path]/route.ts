/**
 * API Proxy Route - Catch-all
 * Proxies requests to external API when NEXT_PUBLIC_API_BASE_URL is set to external endpoint
 * Falls through to existing local API routes when using localhost
 */

import { NextRequest, NextResponse } from 'next/server'

// Check if we should use external API proxy
const shouldUseProxy = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    return apiBaseUrl && !apiBaseUrl.includes('localhost') && !apiBaseUrl.includes('127.0.0.1')
}

// Get the external backend API base URL
const getBackendUrl = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    if (apiBaseUrl?.includes('/api')) {
        return apiBaseUrl.replace('/api', '')
    }
    return apiBaseUrl || 'http://103.188.82.252:5000'
}

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    if (!shouldUseProxy()) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return handleProxyRequest(request, params.path, 'GET')
}

export async function POST(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    if (!shouldUseProxy()) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return handleProxyRequest(request, params.path, 'POST')
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    if (!shouldUseProxy()) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return handleProxyRequest(request, params.path, 'PUT')
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    if (!shouldUseProxy()) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return handleProxyRequest(request, params.path, 'PATCH')
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    if (!shouldUseProxy()) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
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
        const backendUrl = getBackendUrl()
        const targetUrl = `${backendUrl}/${path}`

        // Get query parameters
        const searchParams = request.nextUrl.searchParams.toString()
        const finalUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl

        console.log(`🔄 Proxying ${method} ${finalUrl}`)

        // Prepare headers
        const headers: Record<string, string> = {}
        request.headers.forEach((value, key) => {
            // Skip problematic headers
            if (!['host', 'connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
                headers[key] = value
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
                // Remove content-type to let fetch set boundary
                delete headers['content-type']
            } else if (contentType?.includes('application/x-www-form-urlencoded')) {
                const formData = await request.formData()
                const params = new URLSearchParams()
                Array.from(formData.entries()).forEach(([key, value]) => {
                    params.append(key, value.toString())
                })
                requestOptions.body = params
            } else {
                const body = await request.text()
                requestOptions.body = body
            }
        }

        // Make the proxied request
        const response = await fetch(finalUrl, requestOptions)

        // Get response data
        const responseData = await response.arrayBuffer()

        // Create response headers
        const responseHeaders = new Headers()

        // Copy important headers
        response.headers.forEach((value, key) => {
            if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
                responseHeaders.set(key, value)
            }
        })

        // Add CORS headers
        responseHeaders.set('Access-Control-Allow-Origin', '*')
        responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        console.log(`✅ Proxy response: ${response.status}`)

        return new NextResponse(responseData, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        })

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
    if (!shouldUseProxy()) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    })
}
