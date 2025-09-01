addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const apiKey = API_KEY; // Use Cloudflare Worker Secrets to store the API key
  const host = request.headers.get('Host'); // Get the Host header from the request
  const subdomain = host.split('.')[0]; // Get the subdomain dynamically (before the first dot)

  // Construct the dynamic API endpoint using the subdomain
  const apiEndpoint = `https://${subdomain}.workers.dev/api/v1/chat/completions`; 

  if (request.method === 'POST') {
    const reqData = await request.json();

    // Make the request to OpenRouter API
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(reqData)
    });

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response('Method Not Allowed', { status: 405 });
  }
}

