export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        }
      })
    }

    // 仅接受 POST /oauth/github
    if (request.method !== 'POST' || url.pathname !== '/oauth/github') {
      return new Response('Not Found', { status: 404 })
    }

    try {
      const { code } = await request.json()
      
      if (!code) {
        return Response.json({ error: 'Missing code parameter' }, { status: 400 })
      }

      // 向 GitHub 交换 access_token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: 'https://soft-zihan.github.io/SakuraBlog/oauth/callback'
        })
      })

      const tokenData = await tokenResponse.json()
      
      if (tokenData.error) {
        return Response.json(
          { error: tokenData.error_description || tokenData.error },
          { status: 400 }
        )
      }

      // 获取用户信息
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'sakurablog-oauth-worker'
        }
      })
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user info')
      }
      
      const userData = await userResponse.json()

      // 返回 token 和用户信息
      return Response.json({
        access_token: tokenData.access_token,
        username: userData.login,
        scope: tokenData.scope
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      })
    } catch (error) {
      console.error('OAuth error:', error)
      return Response.json(
        { error: 'Token exchange failed' },
        { status: 500 }
      )
    }
  }
}

interface Env {
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
}
